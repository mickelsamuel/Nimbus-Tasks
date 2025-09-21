import { z } from "zod";
import { observable } from "@trpc/server/observable";
import { EventEmitter } from "events";
import { createTRPCRouter, organizationProcedure } from "~/server/api/trpc";

// Global event emitter for real-time updates
export const ee = new EventEmitter();

// Event types
export type TaskUpdateEvent = {
  type: "TASK_UPDATED" | "TASK_CREATED" | "TASK_DELETED";
  taskId: string;
  organizationId: string;
  data?: any;
};

export type CommentUpdateEvent = {
  type: "COMMENT_CREATED" | "COMMENT_UPDATED" | "COMMENT_DELETED";
  taskId: string;
  commentId: string;
  organizationId: string;
  data?: any;
};

export type AttachmentUpdateEvent = {
  type: "ATTACHMENT_CREATED" | "ATTACHMENT_DELETED";
  taskId: string;
  attachmentId: string;
  organizationId: string;
  data?: any;
};

export const realtimeRouter = createTRPCRouter({
  onTaskUpdate: organizationProcedure
    .input(
      z.object({
        taskId: z.string().optional(),
      })
    )
    .subscription(({ ctx, input }) => {
      return observable<TaskUpdateEvent>((emit) => {
        const onUpdate = (data: TaskUpdateEvent) => {
          // Only emit updates for the same organization
          if (data.organizationId === ctx.organization.id) {
            // If specific taskId is requested, filter by it
            if (!input.taskId || data.taskId === input.taskId) {
              emit.next(data);
            }
          }
        };

        ee.on("taskUpdate", onUpdate);

        return () => {
          ee.off("taskUpdate", onUpdate);
        };
      });
    }),

  onCommentUpdate: organizationProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .subscription(({ ctx, input }) => {
      return observable<CommentUpdateEvent>((emit) => {
        const onUpdate = (data: CommentUpdateEvent) => {
          // Only emit updates for the same organization and task
          if (
            data.organizationId === ctx.organization.id &&
            data.taskId === input.taskId
          ) {
            emit.next(data);
          }
        };

        ee.on("commentUpdate", onUpdate);

        return () => {
          ee.off("commentUpdate", onUpdate);
        };
      });
    }),

  onAttachmentUpdate: organizationProcedure
    .input(
      z.object({
        taskId: z.string(),
      })
    )
    .subscription(({ ctx, input }) => {
      return observable<AttachmentUpdateEvent>((emit) => {
        const onUpdate = (data: AttachmentUpdateEvent) => {
          // Only emit updates for the same organization and task
          if (
            data.organizationId === ctx.organization.id &&
            data.taskId === input.taskId
          ) {
            emit.next(data);
          }
        };

        ee.on("attachmentUpdate", onUpdate);

        return () => {
          ee.off("attachmentUpdate", onUpdate);
        };
      });
    }),
});

// Helper functions to emit events
export function emitTaskUpdate(event: TaskUpdateEvent) {
  ee.emit("taskUpdate", event);
}

export function emitCommentUpdate(event: CommentUpdateEvent) {
  ee.emit("commentUpdate", event);
}

export function emitAttachmentUpdate(event: AttachmentUpdateEvent) {
  ee.emit("attachmentUpdate", event);
}