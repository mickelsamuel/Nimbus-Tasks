import type { MembershipRole, User, Membership, Organization } from "@nimbus/db";

export interface UserWithMembership extends User {
  membership?: Membership & {
    organization: Organization;
  };
}

export interface PermissionContext {
  user: UserWithMembership;
  resource?: {
    type: "organization" | "project" | "task" | "comment" | "attachment";
    organizationId: string;
    creatorId?: string;
    assigneeId?: string;
  };
}

export enum Permission {
  // Organization permissions
  "organization.view" = "organization.view",
  "organization.update" = "organization.update",
  "organization.delete" = "organization.delete",
  "organization.invite_members" = "organization.invite_members",
  "organization.remove_members" = "organization.remove_members",

  // Project permissions
  "project.create" = "project.create",
  "project.view" = "project.view",
  "project.update" = "project.update",
  "project.delete" = "project.delete",

  // Task permissions
  "task.create" = "task.create",
  "task.view" = "task.view",
  "task.update" = "task.update",
  "task.update.own" = "task.update.own",
  "task.update.assigned" = "task.update.assigned",
  "task.delete" = "task.delete",
  "task.assign" = "task.assign",

  // Comment permissions
  "comment.create" = "comment.create",
  "comment.view" = "comment.view",
  "comment.update" = "comment.update",
  "comment.update.own" = "comment.update.own",
  "comment.delete" = "comment.delete",
  "comment.delete.own" = "comment.delete.own",

  // Attachment permissions
  "attachment.create" = "attachment.create",
  "attachment.view" = "attachment.view",
  "attachment.delete" = "attachment.delete",
  "attachment.delete.own" = "attachment.delete.own",

  // Tag permissions
  "tag.create" = "tag.create",
  "tag.view" = "tag.view",
  "tag.update" = "tag.update",
  "tag.delete" = "tag.delete",

  // Member management
  "member.view" = "member.view",
  "member.invite" = "member.invite",
  "member.remove" = "member.remove",
  "member.update_role" = "member.update_role",
}

type RolePermissions = {
  [K in MembershipRole]: Permission[];
};

const ROLE_PERMISSIONS: RolePermissions = {
  OWNER: [
    // Organization permissions
    Permission["organization.view"],
    Permission["organization.update"],
    Permission["organization.delete"],
    Permission["organization.invite_members"],
    Permission["organization.remove_members"],

    // Project permissions
    Permission["project.create"],
    Permission["project.view"],
    Permission["project.update"],
    Permission["project.delete"],

    // Task permissions
    Permission["task.create"],
    Permission["task.view"],
    Permission["task.update"],
    Permission["task.update.own"],
    Permission["task.update.assigned"],
    Permission["task.delete"],
    Permission["task.assign"],

    // Comment permissions
    Permission["comment.create"],
    Permission["comment.view"],
    Permission["comment.update"],
    Permission["comment.update.own"],
    Permission["comment.delete"],
    Permission["comment.delete.own"],

    // Attachment permissions
    Permission["attachment.create"],
    Permission["attachment.view"],
    Permission["attachment.delete"],
    Permission["attachment.delete.own"],

    // Tag permissions
    Permission["tag.create"],
    Permission["tag.view"],
    Permission["tag.update"],
    Permission["tag.delete"],

    // Member management
    Permission["member.view"],
    Permission["member.invite"],
    Permission["member.remove"],
    Permission["member.update_role"],
  ],

  ADMIN: [
    // Organization permissions (limited)
    Permission["organization.view"],
    Permission["organization.invite_members"],
    Permission["organization.remove_members"],

    // Project permissions
    Permission["project.create"],
    Permission["project.view"],
    Permission["project.update"],
    Permission["project.delete"],

    // Task permissions
    Permission["task.create"],
    Permission["task.view"],
    Permission["task.update"],
    Permission["task.update.own"],
    Permission["task.update.assigned"],
    Permission["task.delete"],
    Permission["task.assign"],

    // Comment permissions
    Permission["comment.create"],
    Permission["comment.view"],
    Permission["comment.update"],
    Permission["comment.update.own"],
    Permission["comment.delete"],
    Permission["comment.delete.own"],

    // Attachment permissions
    Permission["attachment.create"],
    Permission["attachment.view"],
    Permission["attachment.delete"],
    Permission["attachment.delete.own"],

    // Tag permissions
    Permission["tag.create"],
    Permission["tag.view"],
    Permission["tag.update"],
    Permission["tag.delete"],

    // Member management (limited)
    Permission["member.view"],
    Permission["member.invite"],
    Permission["member.remove"],
  ],

  MEMBER: [
    // Organization permissions (view only)
    Permission["organization.view"],

    // Project permissions (view only)
    Permission["project.view"],

    // Task permissions
    Permission["task.create"],
    Permission["task.view"],
    Permission["task.update.own"],
    Permission["task.update.assigned"],

    // Comment permissions
    Permission["comment.create"],
    Permission["comment.view"],
    Permission["comment.update.own"],
    Permission["comment.delete.own"],

    // Attachment permissions
    Permission["attachment.create"],
    Permission["attachment.view"],
    Permission["attachment.delete.own"],

    // Tag permissions (view only)
    Permission["tag.view"],

    // Member management (view only)
    Permission["member.view"],
  ],
};

/**
 * Central permission checking function
 */
export function can(
  permission: Permission,
  context: PermissionContext
): boolean {
  const { user, resource } = context;

  // System admins can do everything (for future super admin role)
  if (user.email === "admin@system.com") {
    return true;
  }

  // User must have a membership to access organization resources
  if (!user.membership) {
    return false;
  }

  // Check if resource belongs to user's organization
  if (resource && resource.organizationId !== user.membership.organizationId) {
    return false;
  }

  const userRole = user.membership.role;
  const basePermissions = ROLE_PERMISSIONS[userRole];

  // Check base role permissions
  if (!basePermissions.includes(permission)) {
    return false;
  }

  // Handle resource-specific permissions
  if (resource) {
    return checkResourcePermission(permission, context);
  }

  return true;
}

function checkResourcePermission(
  permission: Permission,
  context: PermissionContext
): boolean {
  const { user, resource } = context;

  if (!resource || !user.membership) {
    return false;
  }

  const userId = user.id;

  switch (permission) {
    // Own resource permissions
    case Permission["task.update.own"]:
      return resource.creatorId === userId;

    case Permission["task.update.assigned"]:
      return resource.assigneeId === userId;

    case Permission["comment.update.own"]:
    case Permission["comment.delete.own"]:
      return resource.creatorId === userId;

    case Permission["attachment.delete.own"]:
      return resource.creatorId === userId;

    // Member management restrictions
    case Permission["member.remove"]:
      // Members can't remove other members, only admins/owners
      return user.membership.role !== "MEMBER";

    case Permission["member.update_role"]:
      // Only owners can update roles
      return user.membership.role === "OWNER";

    default:
      return true;
  }
}

/**
 * Helper to check multiple permissions
 */
export function canAny(
  permissions: Permission[],
  context: PermissionContext
): boolean {
  return permissions.some((permission) => can(permission, context));
}

/**
 * Helper to check all permissions
 */
export function canAll(
  permissions: Permission[],
  context: PermissionContext
): boolean {
  return permissions.every((permission) => can(permission, context));
}

/**
 * Rate limiting configuration per role
 */
export const RATE_LIMITS = {
  OWNER: {
    requests: 1000,
    window: "1h",
  },
  ADMIN: {
    requests: 500,
    window: "1h",
  },
  MEMBER: {
    requests: 200,
    window: "1h",
  },
} as const;

/**
 * Get rate limit for user role
 */
export function getRateLimit(role: MembershipRole) {
  return RATE_LIMITS[role];
}