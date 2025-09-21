import { describe, it, expect } from 'vitest'
import { can, canAny, canAll, Permission, type UserWithMembership, type PermissionContext } from '~/lib/permissions'

describe('Permissions System', () => {
  const mockOrganization = {
    id: 'org-1',
    name: 'Test Organization',
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  const createUserWithRole = (role: 'OWNER' | 'ADMIN' | 'MEMBER'): UserWithMembership => ({
    id: 'user-1',
    email: 'test@example.com',
    name: 'Test User',
    emailVerified: null,
    image: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    membership: {
      id: 'membership-1',
      userId: 'user-1',
      organizationId: 'org-1',
      role,
      createdAt: new Date(),
      updatedAt: new Date(),
      organization: mockOrganization,
    },
  })

  describe('can() function', () => {
    it('should grant all permissions to OWNER', () => {
      const owner = createUserWithRole('OWNER')
      const context: PermissionContext = { user: owner }

      expect(can(Permission['organization.delete'], context)).toBe(true)
      expect(can(Permission['project.create'], context)).toBe(true)
      expect(can(Permission['task.delete'], context)).toBe(true)
      expect(can(Permission['member.update_role'], context)).toBe(true)
    })

    it('should grant limited permissions to ADMIN', () => {
      const admin = createUserWithRole('ADMIN')
      const context: PermissionContext = { user: admin }

      expect(can(Permission['organization.view'], context)).toBe(true)
      expect(can(Permission['project.create'], context)).toBe(true)
      expect(can(Permission['task.delete'], context)).toBe(true)
      expect(can(Permission['member.invite'], context)).toBe(true)

      // Should not have owner-only permissions
      expect(can(Permission['organization.delete'], context)).toBe(false)
      expect(can(Permission['member.update_role'], context)).toBe(false)
    })

    it('should grant minimal permissions to MEMBER', () => {
      const member = createUserWithRole('MEMBER')
      const context: PermissionContext = { user: member }

      expect(can(Permission['organization.view'], context)).toBe(true)
      expect(can(Permission['project.view'], context)).toBe(true)
      expect(can(Permission['task.create'], context)).toBe(true)
      expect(can(Permission['comment.create'], context)).toBe(true)

      // Should not have admin/owner permissions
      expect(can(Permission['project.create'], context)).toBe(false)
      expect(can(Permission['task.delete'], context)).toBe(false)
      expect(can(Permission['member.invite'], context)).toBe(false)
    })

    it('should deny access to users without membership', () => {
      const userWithoutMembership: UserWithMembership = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const context: PermissionContext = { user: userWithoutMembership }

      expect(can(Permission['organization.view'], context)).toBe(false)
      expect(can(Permission['task.create'], context)).toBe(false)
    })

    it('should deny access to resources from different organization', () => {
      const owner = createUserWithRole('OWNER')
      const context: PermissionContext = {
        user: owner,
        resource: {
          type: 'task',
          organizationId: 'different-org',
          creatorId: 'user-1',
        },
      }

      expect(can(Permission['task.view'], context)).toBe(false)
    })

    it('should handle resource-specific permissions correctly', () => {
      const member = createUserWithRole('MEMBER')

      // Own resource context
      const ownResourceContext: PermissionContext = {
        user: member,
        resource: {
          type: 'task',
          organizationId: 'org-1',
          creatorId: 'user-1', // Same as user
        },
      }

      // Other's resource context
      const otherResourceContext: PermissionContext = {
        user: member,
        resource: {
          type: 'task',
          organizationId: 'org-1',
          creatorId: 'other-user',
        },
      }

      // Should be able to update own tasks
      expect(can(Permission['task.update.own'], ownResourceContext)).toBe(true)
      // Should not be able to update others' tasks
      expect(can(Permission['task.update.own'], otherResourceContext)).toBe(false)
    })

    it('should handle assigned task permissions', () => {
      const member = createUserWithRole('MEMBER')

      const assignedTaskContext: PermissionContext = {
        user: member,
        resource: {
          type: 'task',
          organizationId: 'org-1',
          creatorId: 'other-user',
          assigneeId: 'user-1', // Assigned to user
        },
      }

      const notAssignedTaskContext: PermissionContext = {
        user: member,
        resource: {
          type: 'task',
          organizationId: 'org-1',
          creatorId: 'other-user',
          assigneeId: 'different-user',
        },
      }

      expect(can(Permission['task.update.assigned'], assignedTaskContext)).toBe(true)
      expect(can(Permission['task.update.assigned'], notAssignedTaskContext)).toBe(false)
    })

    it('should allow system admin access', () => {
      const systemAdmin: UserWithMembership = {
        id: 'system-admin',
        email: 'admin@system.com', // Special system admin email
        name: 'System Admin',
        emailVerified: null,
        image: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      const context: PermissionContext = { user: systemAdmin }

      // System admin should have access to everything
      expect(can(Permission['organization.delete'], context)).toBe(true)
      expect(can(Permission['member.update_role'], context)).toBe(true)
    })
  })

  describe('canAny() function', () => {
    it('should return true if user has any of the permissions', () => {
      const member = createUserWithRole('MEMBER')
      const context: PermissionContext = { user: member }

      const permissions = [
        Permission['organization.delete'], // Member doesn't have this
        Permission['task.create'], // Member has this
        Permission['member.invite'], // Member doesn't have this
      ]

      expect(canAny(permissions, context)).toBe(true)
    })

    it('should return false if user has none of the permissions', () => {
      const member = createUserWithRole('MEMBER')
      const context: PermissionContext = { user: member }

      const permissions = [
        Permission['organization.delete'],
        Permission['project.create'],
        Permission['member.invite'],
      ]

      expect(canAny(permissions, context)).toBe(false)
    })
  })

  describe('canAll() function', () => {
    it('should return true if user has all permissions', () => {
      const owner = createUserWithRole('OWNER')
      const context: PermissionContext = { user: owner }

      const permissions = [
        Permission['organization.view'],
        Permission['task.create'],
        Permission['project.create'],
      ]

      expect(canAll(permissions, context)).toBe(true)
    })

    it('should return false if user is missing any permission', () => {
      const member = createUserWithRole('MEMBER')
      const context: PermissionContext = { user: member }

      const permissions = [
        Permission['organization.view'], // Member has this
        Permission['task.create'], // Member has this
        Permission['project.create'], // Member doesn't have this
      ]

      expect(canAll(permissions, context)).toBe(false)
    })
  })
})