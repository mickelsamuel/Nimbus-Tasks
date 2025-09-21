import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";

export const projectRouter = createTRPCRouter({
  getAll: organizationProcedure.query(async ({ ctx }) => {
    const projects = await ctx.prisma.project.findMany({
      where: {
        organizationId: ctx.organization.id,
      },
      include: {
        tasks: {
          select: {
            id: true,
            status: true,
          },
        },
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    return projects.map((project) => ({
      ...project,
      taskCounts: {
        total: project._count.tasks,
        todo: project.tasks.filter((task) => task.status === "TODO").length,
        inProgress: project.tasks.filter((task) => task.status === "IN_PROGRESS").length,
        done: project.tasks.filter((task) => task.status === "DONE").length,
      },
    }));
  }),

  getById: organizationProcedure
    .input(z.object({ id: z.string() }))
    .query(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
          organizationId: ctx.organization.id,
        },
        include: {
          tasks: {
            include: {
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
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });

      if (!project) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      return project;
    }),

  create: organizationProcedure
    .input(
      z.object({
        name: z.string().min(1),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const project = await ctx.prisma.project.create({
        data: {
          name: input.name,
          description: input.description,
          color: input.color,
          organizationId: ctx.organization.id,
        },
      });

      return project;
    }),

  update: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        description: z.string().optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingProject = await ctx.prisma.project.findFirst({
        where: {
          id,
          organizationId: ctx.organization.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      const project = await ctx.prisma.project.update({
        where: { id },
        data: updateData,
      });

      return project;
    }),

  delete: organizationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingProject = await ctx.prisma.project.findFirst({
        where: {
          id: input.id,
          organizationId: ctx.organization.id,
        },
      });

      if (!existingProject) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Project not found",
        });
      }

      await ctx.prisma.project.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});