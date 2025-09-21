import { z } from 'zod'
import { VALIDATION_PATTERNS, FILE_UPLOAD_CONFIG, PAGINATION_CONFIG } from './headers'

// Base validation schemas
export const emailSchema = z
  .string()
  .email('Please enter a valid email address')
  .min(1, 'Email is required')
  .max(254, 'Email is too long')
  .regex(VALIDATION_PATTERNS.email, 'Please enter a valid email address')

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(
    VALIDATION_PATTERNS.password,
    'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
  )

export const usernameSchema = z
  .string()
  .min(3, 'Username must be at least 3 characters')
  .max(20, 'Username must be no more than 20 characters')
  .regex(VALIDATION_PATTERNS.username, 'Username can only contain letters, numbers, underscores, and hyphens')

export const organizationSlugSchema = z
  .string()
  .min(3, 'Organization slug must be at least 3 characters')
  .max(30, 'Organization slug must be no more than 30 characters')
  .regex(VALIDATION_PATTERNS.organizationSlug, 'Organization slug can only contain lowercase letters, numbers, and hyphens')

// File upload validation
export const fileUploadSchema = z.object({
  filename: z
    .string()
    .min(1, 'Filename is required')
    .max(255, 'Filename is too long')
    .regex(VALIDATION_PATTERNS.filename, 'Filename contains invalid characters'),
  contentType: z
    .string()
    .refine(
      (type) => FILE_UPLOAD_CONFIG.allowedTypes.includes(type as any),
      'File type is not allowed'
    )
    .refine(
      (type) => !FILE_UPLOAD_CONFIG.prohibitedTypes.includes(type as any),
      'File type is prohibited for security reasons'
    ),
  fileSize: z
    .number()
    .min(1, 'File cannot be empty')
    .max(FILE_UPLOAD_CONFIG.maxSize, `File size cannot exceed ${FILE_UPLOAD_CONFIG.maxSize / 1024 / 1024}MB`),
})

// Pagination validation
export const paginationSchema = z.object({
  limit: z
    .number()
    .int()
    .min(1, 'Limit must be at least 1')
    .max(PAGINATION_CONFIG.maxLimit, `Limit cannot exceed ${PAGINATION_CONFIG.maxLimit}`)
    .default(PAGINATION_CONFIG.defaultLimit),
  offset: z
    .number()
    .int()
    .min(0, 'Offset must be non-negative')
    .default(PAGINATION_CONFIG.defaultOffset),
})

// Common input sanitization
export const sanitizedStringSchema = z
  .string()
  .transform((val) => val.trim())
  .refine((val) => val.length > 0, 'Field cannot be empty')

export const sanitizedTextSchema = z
  .string()
  .transform((val) => val.trim())
  .transform((val) => {
    // Remove potentially dangerous HTML tags and scripts
    return val
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
      .replace(/on\w+="[^"]*"/gi, '') // Remove event handlers
      .replace(/javascript:/gi, '') // Remove javascript: protocol
  })

// Task-specific validation schemas
export const taskCreateSchema = z.object({
  title: sanitizedStringSchema.max(200, 'Title is too long'),
  description: sanitizedTextSchema.max(2000, 'Description is too long').optional(),
  status: z.enum(['TODO', 'IN_PROGRESS', 'DONE', 'CANCELLED']).default('TODO'),
  priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
  projectId: z.string().uuid('Invalid project ID'),
  assigneeId: z.string().uuid('Invalid assignee ID').optional(),
  dueAt: z.date().optional(),
  tagIds: z.array(z.string().uuid('Invalid tag ID')).default([]),
})

export const taskUpdateSchema = taskCreateSchema.partial().extend({
  id: z.string().uuid('Invalid task ID'),
})

// Comment validation schemas
export const commentCreateSchema = z.object({
  content: sanitizedTextSchema
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long'),
  taskId: z.string().uuid('Invalid task ID'),
})

export const commentUpdateSchema = z.object({
  id: z.string().uuid('Invalid comment ID'),
  content: sanitizedTextSchema
    .min(1, 'Comment cannot be empty')
    .max(1000, 'Comment is too long'),
})

// Project validation schemas
export const projectCreateSchema = z.object({
  name: sanitizedStringSchema.max(100, 'Project name is too long'),
  description: sanitizedTextSchema.max(500, 'Description is too long').optional(),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Invalid color format'),
})

export const projectUpdateSchema = projectCreateSchema.partial().extend({
  id: z.string().uuid('Invalid project ID'),
})

// Organization validation schemas
export const organizationCreateSchema = z.object({
  name: sanitizedStringSchema.max(100, 'Organization name is too long'),
  slug: organizationSlugSchema,
})

export const organizationUpdateSchema = organizationCreateSchema.partial().extend({
  id: z.string().uuid('Invalid organization ID'),
})

// User profile validation schemas
export const userProfileUpdateSchema = z.object({
  name: sanitizedStringSchema.max(100, 'Name is too long').optional(),
  email: emailSchema.optional(),
  bio: sanitizedTextSchema.max(500, 'Bio is too long').optional(),
})

// Auth validation schemas
export const signInSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, 'Password is required'),
})

export const signUpSchema = z.object({
  name: sanitizedStringSchema.max(100, 'Name is too long'),
  email: emailSchema,
  password: passwordSchema,
  organizationName: sanitizedStringSchema.max(100, 'Organization name is too long'),
})

export const resetPasswordSchema = z.object({
  email: emailSchema,
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Current password is required'),
  newPassword: passwordSchema,
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
})

// Search and filter validation
export const searchSchema = z.object({
  query: sanitizedStringSchema.max(100, 'Search query is too long').optional(),
  filters: z.record(z.string()).optional(),
  sort: z.string().max(50, 'Sort parameter is too long').optional(),
  order: z.enum(['asc', 'desc']).optional(),
  ...paginationSchema.shape,
})

// API response validation
export const apiResponseSchema = z.object({
  success: z.boolean(),
  data: z.any().optional(),
  error: z.string().optional(),
  message: z.string().optional(),
})

// Webhook validation (for external integrations)
export const webhookSchema = z.object({
  event: z.string().max(100, 'Event name is too long'),
  payload: z.record(z.any()),
  timestamp: z.number().int().positive(),
  signature: z.string().optional(),
})

// Helper function to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, input: unknown): T {
  try {
    return schema.parse(input)
  } catch (error) {
    if (error instanceof z.ZodError) {
      throw new Error(`Validation error: ${error.errors.map(e => e.message).join(', ')}`)
    }
    throw error
  }
}

// Helper function for safe parsing
export function safeValidateInput<T>(schema: z.ZodSchema<T>, input: unknown): { success: true; data: T } | { success: false; error: z.ZodError } {
  const result = schema.safeParse(input)
  if (result.success) {
    return { success: true, data: result.data }
  }
  return { success: false, error: result.error }
}