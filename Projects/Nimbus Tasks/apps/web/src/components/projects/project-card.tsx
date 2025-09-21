import { Card, CardContent, cn } from "@nimbus/ui";
import { CheckSquare, Clock, Users } from "lucide-react";
import type { RouterOutputs } from "~/trpc/shared";

type Project = RouterOutputs["project"]["getAll"][0];

interface ProjectCardProps {
  project: Project;
  compact?: boolean;
  onClick?: () => void;
}

export function ProjectCard({ project, compact = false, onClick }: ProjectCardProps) {
  const completionRate = project.taskCounts.total > 0
    ? Math.round((project.taskCounts.done / project.taskCounts.total) * 100)
    : 0;

  return (
    <Card
      className={cn(
        "cursor-pointer hover:shadow-md transition-shadow border-l-4",
        compact && "p-3"
      )}
      style={{ borderLeftColor: project.color }}
      onClick={onClick}
    >
      <CardContent className={cn("p-4", compact && "p-3")}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <h3 className={cn(
              "font-medium text-gray-900 truncate",
              compact ? "text-sm" : "text-base"
            )}>
              {project.name}
            </h3>
            {project.description && !compact && (
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {project.description}
              </p>
            )}
          </div>
          <div className="ml-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ backgroundColor: project.color + "20" }}
            >
              <CheckSquare
                className="w-4 h-4"
                style={{ color: project.color }}
              />
            </div>
          </div>
        </div>

        <div className="mt-3">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Progress</span>
            <span>{completionRate}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="h-2 rounded-full transition-all"
              style={{
                backgroundColor: project.color,
                width: `${completionRate}%`,
              }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between mt-3 text-sm text-gray-500">
          <div className="flex items-center space-x-3">
            <div className="flex items-center">
              <CheckSquare className="w-3 h-3 mr-1" />
              <span>{project.taskCounts.total} tasks</span>
            </div>
            <div className="flex items-center">
              <Clock className="w-3 h-3 mr-1" />
              <span>{project.taskCounts.inProgress} active</span>
            </div>
          </div>

          <div className="text-xs text-gray-400">
            {new Date(project.updatedAt).toLocaleDateString()}
          </div>
        </div>

        {!compact && (
          <div className="flex justify-between mt-2 text-xs">
            <span className="text-gray-500">
              {project.taskCounts.todo} to do
            </span>
            <span className="text-blue-600">
              {project.taskCounts.inProgress} in progress
            </span>
            <span className="text-green-600">
              {project.taskCounts.done} done
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}