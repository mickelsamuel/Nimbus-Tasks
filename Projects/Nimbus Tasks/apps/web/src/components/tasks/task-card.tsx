import { Card, CardContent, cn } from "@nimbus/ui";
import { Clock, MessageCircle, Paperclip, User } from "lucide-react";
import type { RouterOutputs } from "~/trpc/shared";

type Task = RouterOutputs["task"]["getAll"][0];

interface TaskCardProps {
  task: Task;
  compact?: boolean;
  onClick?: () => void;
}

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const priorityColors = {
  LOW: "border-l-gray-400",
  MEDIUM: "border-l-yellow-400",
  HIGH: "border-l-orange-400",
  URGENT: "border-l-red-400",
};

export function TaskCard({ task, compact = false, onClick }: TaskCardProps) {
  return (
    <Card
      data-testid="task-item"
      data-task-id={task.id}
      data-task-status={task.status}
      data-task-priority={task.priority}
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow border-l-4",
        priorityColors[task.priority],
        compact && "p-3"
      )}
      onClick={onClick}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3
              data-testid="task-title"
              className={cn(
                "font-medium text-gray-900 truncate",
                compact ? "text-sm" : "text-base"
              )}
            >
              {task.title}
            </h3>
            {task.description && !compact && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {task.description}
              </p>
            )}
          </div>
          <span
            data-testid="task-status"
            data-status={task.status}
            className={cn(
              "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ml-2",
              statusColors[task.status]
            )}
          >
            {task.status.replace("_", " ")}
          </span>
        </div>

        <div className="flex items-center justify-between mt-3">
          <div className="flex items-center space-x-3 text-sm text-gray-500">
            {task.project && (
              <div className="flex items-center">
                <div
                  className="w-3 h-3 rounded-full mr-1"
                  style={{ backgroundColor: task.project.color }}
                />
                <span>{task.project.name}</span>
              </div>
            )}

            {(task._count.comments > 0 || task._count.attachments > 0) && (
              <div className="flex items-center space-x-2">
                {task._count.comments > 0 && (
                  <div className="flex items-center">
                    <MessageCircle className="w-3 h-3 mr-1" />
                    <span>{task._count.comments}</span>
                  </div>
                )}
                {task._count.attachments > 0 && (
                  <div className="flex items-center">
                    <Paperclip className="w-3 h-3 mr-1" />
                    <span>{task._count.attachments}</span>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center space-x-2">
            {task.dueAt && (
              <div className="flex items-center text-sm text-gray-500">
                <Clock className="w-3 h-3 mr-1" />
                <span>
                  {new Date(task.dueAt).toLocaleDateString()}
                </span>
              </div>
            )}

            {task.assignee && (
              <div className="flex items-center">
                {task.assignee.image ? (
                  <img
                    src={task.assignee.image}
                    alt={task.assignee.name ?? "User"}
                    className="w-6 h-6 rounded-full"
                  />
                ) : (
                  <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                    <User className="w-3 h-3 text-gray-600" />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-2">
            {task.tags.slice(0, compact ? 2 : 4).map((tag) => (
              <span
                key={tag.id}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                style={{
                  backgroundColor: tag.color + "20",
                  color: tag.color,
                }}
              >
                {tag.name}
              </span>
            ))}
            {task.tags.length > (compact ? 2 : 4) && (
              <span className="text-xs text-gray-500">
                +{task.tags.length - (compact ? 2 : 4)} more
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}