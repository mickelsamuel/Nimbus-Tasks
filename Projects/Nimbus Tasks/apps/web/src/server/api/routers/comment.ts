import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";
import { emitCommentUpdate } from "./realtime";
import { notificationService } from "~/lib/email";
import { extractMentions, findMentionedUsers } from "~/lib/mentions";

export const commentRouter = createTRPCRouter({
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

      const comments = await ctx.prisma.comment.findMany({
        where: {
          taskId: input.taskId,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
        orderBy: {
          createdAt: "asc",
        },
      });

      return comments;
    }),

  create: organizationProcedure
    .input(
      z.object({
        content: z.string().min(1),
        taskId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.taskId,
          project: {
            organizationId: ctx.organization.id,
          },
        },
        include: {
          project: {
            select: {
              name: true,
            },
          },
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      const comment = await ctx.prisma.comment.create({
        data: {
          content: input.content,
          taskId: input.taskId,
          userId: ctx.session.user.id,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      // Emit real-time update
      emitCommentUpdate({
        type: "COMMENT_CREATED",
        taskId: input.taskId,
        commentId: comment.id,
        organizationId: ctx.organization.id,
        data: comment,
      });

      // Handle mentions in the comment
      const mentions = extractMentions(input.content);
      if (mentions.length > 0) {
        try {
          const mentionedUsers = await findMentionedUsers(
            mentions,
            ctx.organization.id,
            ctx.prisma
          );

          // Send mention notifications
          for (const mentionedUser of mentionedUsers) {
            // Don't send notification to the comment author
            if (mentionedUser.id !== ctx.session.user.id) {
              await notificationService.sendMentionNotification({
                type: "mention",
                recipientEmail: mentionedUser.email,
                recipientName: mentionedUser.name || mentionedUser.email,
                data: {
                  taskTitle: task.title,
                  taskId: task.id,
                  projectName: task.project?.name,
                  mentionedBy: comment.user.name || ctx.session.user.name || "Unknown",
                  commentContent: input.content,
                  organizationName: ctx.organization.name,
                },
              });
            }
          }
        } catch (error) {
          console.error("Failed to send mention notifications:", error);
        }
      }

      return comment;
    }),

  update: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        content: z.string().min(1),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingComment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
          task: {
            project: {
              organizationId: ctx.organization.id,
            },
          },
        },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found or you don't have permission to edit it",
        });
      }

      const comment = await ctx.prisma.comment.update({
        where: { id: input.id },
        data: { content: input.content },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
        },
      });

      return comment;
    }),

  delete: organizationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingComment = await ctx.prisma.comment.findFirst({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
          task: {
            project: {
              organizationId: ctx.organization.id,
            },
          },
        },
      });

      if (!existingComment) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Comment not found or you don't have permission to delete it",
        });
      }

      await ctx.prisma.comment.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});