import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";

export const organizationRouter = createTRPCRouter({
  getCurrent: organizationProcedure.query(async ({ ctx }) => {
    return ctx.organization;
  }),

  getMembers: organizationProcedure.query(async ({ ctx }) => {
    const members = await ctx.prisma.membership.findMany({
      where: {
        organizationId: ctx.organization.id,
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

    return members;
  }),

  inviteMember: organizationProcedure
    .input(
      z.object({
        email: z.string().email(),
        role: z.enum(["ADMIN", "MEMBER"]).default("MEMBER"),
      })
    )
    .mutation(async ({ ctx, input }) => {
      if (ctx.membership.role !== "OWNER" && ctx.membership.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners and admins can invite members",
        });
      }

      const existingUser = await ctx.prisma.user.findUnique({
        where: { email: input.email },
      });

      if (!existingUser) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "User with this email does not exist",
        });
      }

      const existingMembership = await ctx.prisma.membership.findUnique({
        where: {
          userId_organizationId: {
            userId: existingUser.id,
            organizationId: ctx.organization.id,
          },
        },
      });

      if (existingMembership) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "User is already a member of this organization",
        });
      }

      const membership = await ctx.prisma.membership.create({
        data: {
          userId: existingUser.id,
          organizationId: ctx.organization.id,
          role: input.role,
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

      return membership;
    }),

  removeMember: organizationProcedure
    .input(z.object({ memberId: z.string() }))
    .mutation(async ({ ctx, input }) => {
      if (ctx.membership.role !== "OWNER" && ctx.membership.role !== "ADMIN") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners and admins can remove members",
        });
      }

      if (input.memberId === ctx.membership.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "You cannot remove yourself",
        });
      }

      const memberToRemove = await ctx.prisma.membership.findUnique({
        where: {
          id: input.memberId,
          organizationId: ctx.organization.id,
        },
      });

      if (!memberToRemove) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Member not found",
        });
      }

      if (memberToRemove.role === "OWNER" && ctx.membership.role !== "OWNER") {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Only owners can remove other owners",
        });
      }

      await ctx.prisma.membership.delete({
        where: { id: input.memberId },
      });

      return { success: true };
    }),
});