import { useEffect } from "react";
import { api } from "~/trpc/react";

interface UseRealtimeTasksOptions {
  enabled?: boolean;
  refetchInterval?: number;
}

export function useRealtimeTasks(options: UseRealtimeTasksOptions = {}) {
  const { enabled = true, refetchInterval = 5000 } = options;

  const utils = api.useUtils();

  const { data: tasks, ...queryResult } = api.task.getAll.useQuery(
    undefined,
    {
      enabled,
      refetchInterval: enabled ? refetchInterval : false,
      refetchIntervalInBackground: false,
    }
  );

  // Optimistic updates helper
  const optimisticUpdate = {
    addTask: (newTask: any) => {
      utils.task.getAll.setData(undefined, (old) => {
        if (!old) return [newTask];
        return [newTask, ...old];
      });
    },

    updateTask: (taskId: string, updates: any) => {
      utils.task.getAll.setData(undefined, (old) => {
        if (!old) return [];
        return old.map((task) =>
          task.id === taskId ? { ...task, ...updates } : task
        );
      });
    },

    removeTask: (taskId: string) => {
      utils.task.getAll.setData(undefined, (old) => {
        if (!old) return [];
        return old.filter((task) => task.id !== taskId);
      });
    },
  };

  return {
    tasks,
    optimisticUpdate,
    refetch: queryResult.refetch,
    ...queryResult,
  };
}

interface UseRealtimeTaskDetailOptions {
  taskId: string;
  enabled?: boolean;
  refetchInterval?: number;
}

export function useRealtimeTaskDetail({
  taskId,
  enabled = true,
  refetchInterval = 3000,
}: UseRealtimeTaskDetailOptions) {
  const utils = api.useUtils();

  const { data: task, ...queryResult } = api.task.getById.useQuery(
    { id: taskId },
    {
      enabled: enabled && !!taskId,
      refetchInterval: enabled ? refetchInterval : false,
      refetchIntervalInBackground: false,
    }
  );

  const { data: attachments, refetch: refetchAttachments } = api.attachment.getByTaskId.useQuery(
    { taskId },
    {
      enabled: enabled && !!taskId,
      refetchInterval: enabled ? refetchInterval : false,
      refetchIntervalInBackground: false,
    }
  );

  // Helper to invalidate and refetch related data
  const invalidateRelated = () => {
    utils.task.getById.invalidate({ id: taskId });
    utils.attachment.getByTaskId.invalidate({ taskId });
    utils.task.getAll.invalidate();
  };

  return {
    task,
    attachments,
    refetchAttachments,
    invalidateRelated,
    ...queryResult,
  };
}