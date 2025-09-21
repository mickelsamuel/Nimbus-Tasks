import { initTRPC, TRPCError } from "@trpc/server";
import { type CreateNextContextOptions } from "@trpc/server/adapters/next";
import { type Session } from "next-auth";
import superjson from "superjson";
import { ZodError } from "zod";
import { getServerAuthSession } from "~/server/auth";
import { prisma } from "@nimbus/db";
import { can, Permission, type UserWithMembership } from "~/lib/permissions";
import { checkRateLimit, getRateLimitIdentifier, type RateLimitType } from "~/lib/rate-limit";

interface CreateContextOptions {
  session: Session | null;
}

const createInnerTRPCContext = (opts: CreateContextOptions) => {
  return {
    session: opts.session,
    prisma,
  };
};

export const createTRPCContext = async (opts: CreateNextContextOptions) => {
  const { req, res } = opts;

  const session = await getServerAuthSession({ req, res });

  return createInnerTRPCContext({
    session,
  });
};

const t = initTRPC.context<typeof createTRPCContext>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError:
          error.cause instanceof ZodError ? error.cause.flatten() : null,
      },
    };
  },
});

export const createTRPCRouter = t.router;

export const publicProcedure = t.procedure;

const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.session || !ctx.session.user) {
    throw new TRPCError({ code: "UNAUTHORIZED" });
  }
  return next({
    ctx: {
      session: { ...ctx.session, user: ctx.session.user },
    },
  });
});

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed);

export const organizationProcedure = protectedProcedure.use(
  async ({ ctx, next }) => {
    const user = ctx.session.user;

    const membership = await ctx.prisma.membership.findFirst({
      where: {
        userId: user.id,
      },
      include: {
        organization: true,
      },
    });

    if (!membership) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: "User is not a member of any organization",
      });
    }

    const userWithMembership: UserWithMembership = {
      ...user,
      membership,
    };

    return next({
      ctx: {
        ...ctx,
        membership,
        organization: membership.organization,
        userWithMembership,
      },
    });
  }
);

/**
 * Create a procedure with permission checking
 */
export function createPermissionProcedure(permission: Permission) {
  return organizationProcedure.use(async ({ ctx, next }) => {
    const hasPermission = can(permission, {
      user: ctx.userWithMembership,
    });

    if (!hasPermission) {
      throw new TRPCError({
        code: "FORBIDDEN",
        message: `Insufficient permissions: ${permission}`,
      });
    }

    return next();
  });
}

/**
 * Create a procedure with rate limiting
 */
export function createRateLimitedProcedure(
  rateLimitType: RateLimitType,
  identifier: "user" | "ip" = "user"
) {
  return protectedProcedure.use(async ({ ctx, next }) => {
    const id = identifier === "user"
      ? ctx.session.user.id
      : ctx.req?.headers["x-forwarded-for"] as string || "unknown";

    const rateLimitId = getRateLimitIdentifier(identifier, id, rateLimitType);

    const rateLimit = await checkRateLimit(rateLimitType, rateLimitId);

    if (!rateLimit.success) {
      throw new TRPCError({
        code: "TOO_MANY_REQUESTS",
        message: `Rate limit exceeded. Try again after ${rateLimit.reset.toISOString()}`,
      });
    }

    return next();
  });
}

/**
 * Combine organization + permission + rate limiting
 */
export function createSecureProcedure(
  permission: Permission,
  rateLimitType?: RateLimitType
) {
  let procedure = createPermissionProcedure(permission);

  if (rateLimitType) {
    procedure = procedure.use(async ({ ctx, next }) => {
      const rateLimitId = getRateLimitIdentifier("user", ctx.session.user.id, rateLimitType);
      const rateLimit = await checkRateLimit(rateLimitType, rateLimitId);

      if (!rateLimit.success) {
        throw new TRPCError({
          code: "TOO_MANY_REQUESTS",
          message: `Rate limit exceeded. Try again after ${rateLimit.reset.toISOString()}`,
        });
      }

      return next();
    });
  }

  return procedure;
}