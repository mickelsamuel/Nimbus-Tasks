"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@nimbus/ui";
import { api } from "~/trpc/react";
import { TaskCard } from "~/components/tasks/task-card";
import { ProjectCard } from "~/components/projects/project-card";
import { StatsCard } from "~/components/dashboard/stats-card";
import { DashboardSkeleton, TaskCardSkeleton, ProjectCardSkeleton } from "~/components/ui/skeletons";
import { EmptyTasksState, EmptyProjectsState } from "~/components/ui/empty-states";

export default function DashboardPage() {
  const { data: projects, isLoading: projectsLoading } = api.project.getAll.useQuery();
  const { data: tasks, isLoading: tasksLoading } = api.task.getAll.useQuery();

  const handleCreateTask = () => {
    // Navigate to task creation
    console.log('Create task');
  };

  const handleCreateProject = () => {
    // Navigate to project creation
    console.log('Create project');
  };

  // Show full loading skeleton when both are loading
  if (tasksLoading && projectsLoading) {
    return <DashboardSkeleton />;
  }

  const stats = {
    totalTasks: tasks?.length ?? 0,
    todoTasks: tasks?.filter(t => t.status === "TODO").length ?? 0,
    inProgressTasks: tasks?.filter(t => t.status === "IN_PROGRESS").length ?? 0,
    doneTasks: tasks?.filter(t => t.status === "DONE").length ?? 0,
    totalProjects: projects?.length ?? 0,
  };

  const recentTasks = tasks?.slice(0, 5) ?? [];
  const recentProjects = projects?.slice(0, 3) ?? [];

  return (
    <div data-testid="dashboard-page" className="space-y-6 p-6">
      {/* Page Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Overview of your tasks and projects
        </p>
      </div>

      {/* Stats Grid */}
      <div data-testid="dashboard-stats" className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <StatsCard
          title="Total Tasks"
          value={stats.totalTasks}
          description="All tasks across projects"
          isLoading={tasksLoading}
        />
        <StatsCard
          title="To Do"
          value={stats.todoTasks}
          description="Tasks waiting to start"
          isLoading={tasksLoading}
          className="border-l-4 border-l-gray-500"
        />
        <StatsCard
          title="In Progress"
          value={stats.inProgressTasks}
          description="Currently active tasks"
          isLoading={tasksLoading}
          className="border-l-4 border-l-blue-500"
        />
        <StatsCard
          title="Completed"
          value={stats.doneTasks}
          description="Finished tasks"
          isLoading={tasksLoading}
          className="border-l-4 border-l-green-500"
        />
        <StatsCard
          title="Projects"
          value={stats.totalProjects}
          description="Active projects"
          isLoading={projectsLoading}
          className="border-l-4 border-l-purple-500"
        />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <Card data-testid="recent-tasks-card">
          <CardHeader>
            <CardTitle>Recent Tasks</CardTitle>
            <CardDescription>
              Your latest task updates
            </CardDescription>
          </CardHeader>
          <CardContent>
            {tasksLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <TaskCardSkeleton key={i} compact />
                ))}
              </div>
            ) : recentTasks.length > 0 ? (
              <div data-testid="tasks-list" className="space-y-3">
                {recentTasks.map((task) => (
                  <TaskCard key={task.id} task={task} compact />
                ))}
              </div>
            ) : (
              <div data-testid="no-tasks-message" className="py-8">
                <EmptyTasksState onCreateTask={handleCreateTask} />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Projects */}
        <Card data-testid="recent-projects-card">
          <CardHeader>
            <CardTitle>Active Projects</CardTitle>
            <CardDescription>
              Your current project portfolio
            </CardDescription>
          </CardHeader>
          <CardContent>
            {projectsLoading ? (
              <div className="space-y-3">
                {[...Array(3)].map((_, i) => (
                  <ProjectCardSkeleton key={i} compact />
                ))}
              </div>
            ) : recentProjects.length > 0 ? (
              <div data-testid="projects-list" className="space-y-3">
                {recentProjects.map((project) => (
                  <ProjectCard key={project.id} project={project} compact />
                ))}
              </div>
            ) : (
              <div data-testid="no-projects-message" className="py-8">
                <EmptyProjectsState onCreateProject={handleCreateProject} />
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}