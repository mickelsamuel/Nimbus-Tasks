"use client";

import { useState } from "react";
import { Button, Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nimbus/ui";
import { Plus, Filter, CheckSquare } from "lucide-react";
import { api } from "~/trpc/react";
import { TaskCard } from "~/components/tasks/task-card";
import { TaskDetailDialog } from "~/components/tasks/task-detail-dialog";
import { useRealtimeTasks } from "~/hooks/use-realtime-tasks";
import { TasksPageSkeleton, TaskCardSkeleton } from "~/components/ui/skeletons";
import { EmptyTasksState, EmptyFilteredTasksState } from "~/components/ui/empty-states";

export default function TasksPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false);

  const { tasks, isLoading } = useRealtimeTasks();

  const filteredTasks = tasks?.filter(task => {
    if (statusFilter === "all") return true;
    return task.status === statusFilter;
  }) ?? [];

  const statusOptions = [
    { value: "all", label: "All Tasks" },
    { value: "TODO", label: "To Do" },
    { value: "IN_PROGRESS", label: "In Progress" },
    { value: "DONE", label: "Done" },
  ];

  const handleTaskClick = (taskId: string) => {
    setSelectedTaskId(taskId);
    setIsDetailDialogOpen(true);
  };

  const handleCreateTask = () => {
    // Navigate to task creation
    console.log('Create task');
  };

  const handleClearFilter = () => {
    setStatusFilter('all');
  };

  // Show full loading skeleton when loading
  if (isLoading) {
    return <TasksPageSkeleton />;
  }

  return (
    <div data-testid="tasks-page" className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Tasks</h1>
          <p className="text-muted-foreground">
            Manage and track all your tasks
          </p>
        </div>
        <Button data-testid="new-task-button">
          <Plus className="w-4 h-4 mr-2" />
          New Task
        </Button>
      </div>

      {/* Filters */}
      <Card data-testid="task-filters">
        <CardHeader>
          <CardTitle className="text-lg">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <Filter className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Status:</span>
            </div>
            <div className="flex space-x-2">
              {statusOptions.map((option) => (
                <Button
                  key={option.value}
                  data-testid={`filter-${option.value}`}
                  variant={statusFilter === option.value ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(option.value)}
                >
                  {option.label}
                </Button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tasks List */}
      <div className="space-y-4">
        {filteredTasks.length > 0 ? (
          <div data-testid="tasks-list" className="space-y-4">
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onClick={() => handleTaskClick(task.id)}
              />
            ))}
          </div>
        ) : (
          <div data-testid="empty-state">
            {statusFilter === "all" ? (
              <EmptyTasksState onCreateTask={handleCreateTask} />
            ) : (
              <EmptyFilteredTasksState
                filter={statusFilter}
                onClearFilter={handleClearFilter}
              />
            )}
          </div>
        )}
      </div>

      {/* Task Stats */}
      {tasks && tasks.length > 0 && (
        <Card data-testid="task-stats">
          <CardHeader>
            <CardTitle className="text-lg">Task Summary</CardTitle>
            <CardDescription>
              Overview of your task progress
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  {tasks.length}
                </div>
                <div className="text-sm text-gray-500">Total</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-600">
                  {tasks.filter(t => t.status === "TODO").length}
                </div>
                <div className="text-sm text-gray-500">To Do</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-blue-600">
                  {tasks.filter(t => t.status === "IN_PROGRESS").length}
                </div>
                <div className="text-sm text-gray-500">In Progress</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">
                  {tasks.filter(t => t.status === "DONE").length}
                </div>
                <div className="text-sm text-gray-500">Done</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Task Detail Dialog */}
      <TaskDetailDialog
        taskId={selectedTaskId}
        open={isDetailDialogOpen}
        onOpenChange={setIsDetailDialogOpen}
      />
    </div>
  );
}