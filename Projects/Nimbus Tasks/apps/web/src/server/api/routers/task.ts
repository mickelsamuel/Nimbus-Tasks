import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";
import { emitTaskUpdate } from "./realtime";
import { notificationService } from "~/lib/email";
import { taskCreateSchema, taskUpdateSchema, paginationSchema, searchSchema } from "~/lib/security/validation";
import { createSpan, addSpanAttributes } from "~/lib/observability/telemetry";
import { captureError } from "~/lib/observability/sentry";

const taskStatusEnum = z.enum(["TODO", "IN_PROGRESS", "DONE", "CANCELLED"]);
const taskPriorityEnum = z.enum(["LOW", "MEDIUM", "HIGH", "URGENT"]);

export const taskRouter = createTRPCRouter({
  getAll: organizationProcedure
    .input(
      z.object({
        projectId: z.string().optional(),
        status: taskStatusEnum.optional(),
        assigneeId: z.string().optional(),
        priority: taskPriorityEnum.optional(),
        tagId: z.string().optional(),
      })
    )
    .query(async ({ ctx, input }) => {
      const where: any = {};

      if (input.projectId) {
        where.projectId = input.projectId;
      } else {
        where.project = {
          organizationId: ctx.organization.id,
        };
      }

      if (input.status) {
        where.status = input.status;
      }

      if (input.assigneeId) {
        where.assigneeId = input.assigneeId;
      }

      if (input.priority) {
        where.priority = input.priority;
      }

      if (input.tagId) {
        where.tags = {
          some: {
            id: input.tagId,
          },
        };
      }

      const tasks = await ctx.prisma.task.findMany({
        where,
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tags: true,
          _count: {
            select: {
              comments: true,
              attachments: true,
            },
          },
        },
        orderBy: [
          { priority: "desc" },
          { createdAt: "desc" },
        ],
      });

      return tasks;
    }),

  getById: organizationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const task = await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
          project: {
            organizationId: ctx.organization.id,
          },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tags: true,
          comments: {
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
          },
          attachments: true,
        },
      });

      if (!task) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      return task;
    }),

  create: organizationProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
        status: taskStatusEnum.default("TODO"),
        priority: taskPriorityEnum.default("MEDIUM"),
        projectId: z.string(),
        assigneeId: z.string().optional(),
        dueAt: z.date().optional(),
        tagIds: z.array(z.string()).default([]),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { tagIds, ...taskData } = input;

      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.projectId,
          organizationId: ctx.organization.id,
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      if (input.assigneeId) {
        const assignee = await ctx.prisma.membership.findFirst({
          where: {
            userId: input.assigneeId,
            organizationId: ctx.organization.id,
          },
        });

        if (!assignee) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignee is not a member of this organization",
          });
        }
      }

      const task = await ctx.prisma.task.create({
        data: {
          ...taskData,
          creatorId: ctx.session.user.id,
          tags: {
            connect: tagIds.map((id) => ({ id })),
          },
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tags: true,
        },
      });

      // Emit real-time update
      emitTaskUpdate({
        type: "TASK_CREATED",
        taskId: task.id,
        organizationId: ctx.organization.id,
        data: task,
      });

      // Send assignment notification if task is assigned
      if (task.assignee && task.assignee.id !== ctx.session.user.id) {
        try {
          await notificationService.sendTaskAssignment({
            type: "assignment",
            recipientEmail: task.assignee.email,
            recipientName: task.assignee.name || task.assignee.email,
            data: {
              taskTitle: task.title,
              taskId: task.id,
              projectName: task.project.name,
              assignerName: task.creator?.name || ctx.session.user.name || "Unknown",
              organizationName: ctx.organization.name,
            },
          });
        } catch (error) {
          console.error("Failed to send assignment notification:", error);
        }
      }

      return task;
    }),

  update: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
        status: taskStatusEnum.optional(),
        priority: taskPriorityEnum.optional(),
        assigneeId: z.string().optional(),
        dueAt: z.date().optional(),
        tagIds: z.array(z.string()).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, tagIds, ...updateData } = input;

      const existingTask = await ctx.prisma.task.findFirst({
        where: {
          id,
          project: {
            organizationId: ctx.organization.id,
          },
        },
        include: {
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!existingTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      if (input.assigneeId) {
        const assignee = await ctx.prisma.membership.findFirst({
          where: {
            userId: input.assigneeId,
            organizationId: ctx.organization.id,
          },
        });

        if (!assignee) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: "Assignee is not a member of this organization",
          });
        }
      }

      const task = await ctx.prisma.task.update({
        where: { id },
        data: {
          ...updateData,
          ...(tagIds && {
            tags: {
              set: tagIds.map((id) => ({ id })),
            },
          }),
        },
        include: {
          project: {
            select: {
              id: true,
              name: true,
              color: true,
            },
          },
          assignee: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          creator: {
            select: {
              id: true,
              name: true,
              email: true,
              image: true,
            },
          },
          tags: true,
        },
      });

      // Emit real-time update
      emitTaskUpdate({
        type: "TASK_UPDATED",
        taskId: task.id,
        organizationId: ctx.organization.id,
        data: task,
      });

      // Send assignment notification if assignee changed
      const assigneeChanged = existingTask.assigneeId !== task.assigneeId;
      if (assigneeChanged && task.assignee && task.assignee.id !== ctx.session.user.id) {
        try {
          await notificationService.sendTaskAssignment({
            type: "assignment",
            recipientEmail: task.assignee.email,
            recipientName: task.assignee.name || task.assignee.email,
            data: {
              taskTitle: task.title,
              taskId: task.id,
              projectName: task.project.name,
              assignerName: ctx.session.user.name || "Unknown",
              organizationName: ctx.organization.name,
            },
          });
        } catch (error) {
          console.error("Failed to send assignment notification:", error);
        }
      }

      return task;
    }),

  delete: organizationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingTask = await ctx.prisma.task.findFirst({
        where: {
          id: input.id,
          project: {
            organizationId: ctx.organization.id,
          },
        },
      });

      if (!existingTask) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Task not found",
        });
      }

      await ctx.prisma.task.delete({
        where: { id: input.id },
      });

      // Emit real-time update
      emitTaskUpdate({
        type: "TASK_DELETED",
        taskId: input.id,
        organizationId: ctx.organization.id,
      });

      return { success: true };
    }),
});