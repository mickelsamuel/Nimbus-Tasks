import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";

export const tagRouter = createTRPCRouter({
  getAll: organizationProcedure.query(async ({ ctx }) => {
    const tags = await ctx.prisma.tag.findMany({
      where: {
        organizationId: ctx.organization.id,
      },
      include: {
        _count: {
          select: {
            tasks: true,
          },
        },
      },
      orderBy: {
        name: "asc",
      },
    });

    return tags;
  }),

  create: organizationProcedure
    .input(
      z.object({
        name: z.string().min(1),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).default("#10B981"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const existingTag = await ctx.prisma.tag.findFirst({
        where: {
          name: input.name.toLowerCase(),
          organizationId: ctx.organization.id,
        },
      });

      if (existingTag) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "Tag with this name already exists",
        });
      }

      const tag = await ctx.prisma.tag.create({
        data: {
          name: input.name.toLowerCase(),
          color: input.color,
          organizationId: ctx.organization.id,
        },
      });

      return tag;
    }),

  update: organizationProcedure
    .input(
      z.object({
        id: z.string(),
        name: z.string().min(1).optional(),
        color: z.string().regex(/^#[0-9A-F]{6}$/i).optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const { id, ...updateData } = input;

      const existingTag = await ctx.prisma.tag.findFirst({
        where: {
          id,
          organizationId: ctx.organization.id,
        },
      });

      if (!existingTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      if (input.name) {
        const nameConflict = await ctx.prisma.tag.findFirst({
          where: {
            name: input.name.toLowerCase(),
            organizationId: ctx.organization.id,
            id: { not: id },
          },
        });

        if (nameConflict) {
          throw new TRPCError({
            code: "CONFLICT",
            message: "Tag with this name already exists",
          });
        }

        updateData.name = input.name.toLowerCase();
      }

      const tag = await ctx.prisma.tag.update({
        where: { id },
        data: updateData,
      });

      return tag;
    }),

  delete: organizationProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const existingTag = await ctx.prisma.tag.findFirst({
        where: {
          id: input.id,
          organizationId: ctx.organization.id,
        },
      });

      if (!existingTag) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Tag not found",
        });
      }

      await ctx.prisma.tag.delete({
        where: { id: input.id },
      });

      return { success: true };
    }),
});