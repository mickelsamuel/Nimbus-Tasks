import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";
import { generateUploadUrl, generateDownloadUrl, extractKeyFromUrl, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "~/lib/s3";
import { emitAttachmentUpdate } from "./realtime";

export const attachmentRouter = createTRPCRouter({
  generateUploadUrl: organizationProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        contentType: z.enum(ALLOWED_FILE_TYPES as any),
        fileSize: z.number().min(1).max(MAX_FILE_SIZE),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to the task
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          project: {
            organizationId: ctx.organization.id,
          },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      try {
        const uploadData = await generateUploadUrl({
          filename: input.filename,
          contentType: input.contentType,
          fileSize: input.fileSize,
        });

        return uploadData;
      } catch (error) {
        console.error("Failed to generate upload URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate upload URL",
        });
      }
    }),

  create: organizationProcedure
    .input(
      z.object({
        filename: z.string().min(1),
        fileUrl: z.string().url(),
        fileSize: z.number().min(1),
        mimeType: z.string().min(1),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      // Verify user has access to the task
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          project: {
            organizationId: ctx.organization.id,
          },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const attachment = await ctx.prisma.attachment.create({
        data: {
          filename: input.filename,
          fileUrl: input.fileUrl,
          fileSize: input.fileSize,
          mimeType: input.mimeType,
          taskId: input.taskId,
        },
      });

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          type: "TASK_UPDATED",
          description: `Added attachment "${input.filename}" to task "${task.title}"`,
          userId: ctx.session.user.id,
          metadata: {
            taskId: input.taskId,
            attachmentId: attachment.id,
          },
        },
      });

      // Emit real-time update
      emitAttachmentUpdate({
        type: "ATTACHMENT_CREATED",
        taskId: input.taskId,
        attachmentId: attachment.id,
        organizationId: ctx.organization.id,
        data: attachment,
      });

      return attachment;
    }),

  generateDownloadUrl: organizationProcedure
    .input(z.object({ attachmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const attachment = await ctx.prisma.attachment.findFirst({
        where: {
          id: input.attachmentId,
          task: {
            project: {
              organizationId: ctx.organization.id,
            },
          },
        },
      });

      if (!attachment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attachment not found",
        });
      }

      try {
        const key = extractKeyFromUrl(attachment.fileUrl);
        const downloadUrl = await generateDownloadUrl(key);
        return { downloadUrl };
      } catch (error) {
        console.error("Failed to generate download URL:", error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to generate download URL",
        });
      }
    }),

  getByTaskId: organizationProcedure
    .input(z.object({ taskId: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          project: {
            organizationId: ctx.organization.id,
          },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const attachments = await ctx.prisma.attachment.findMany({
        where: {
          taskId: input.taskId,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      return attachments;
    }),

  delete: organizationProcedure
    .input(z.object({ attachmentId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const attachment = await ctx.prisma.attachment.findFirst({
        where: {
          id: input.attachmentId,
          task: {
            project: {
              organizationId: ctx.organization.id,
            },
          },
        },
        include: {
          task: true,
        },
      });

      if (!attachment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Attachment not found",
        });
      }

      await ctx.prisma.attachment.delete({
        where: { id: input.attachmentId },
      });

      // Log activity
      await ctx.prisma.activityLog.create({
        data: {
          type: "TASK_UPDATED",
          description: `Removed attachment "${attachment.filename}" from task "${attachment.task.title}"`,
          userId: ctx.session.user.id,
          metadata: {
            taskId: attachment.taskId,
            attachmentId: input.attachmentId,
          },
        },
      });

      return { success: true };
    }),
});