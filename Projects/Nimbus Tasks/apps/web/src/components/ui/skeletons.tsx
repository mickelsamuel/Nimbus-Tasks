import { cn } from "@nimbus/ui"

interface SkeletonProps {
  className?: string
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-md bg-muted",
        className
      )}
    />
  )
}

export function TaskCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-testid="task-skeleton"
      className={cn(
        "border rounded-lg p-4 space-y-3",
        compact && "p-3"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-3/4" />
          {!compact && <Skeleton className="h-3 w-full" />}
          {!compact && <Skeleton className="h-3 w-2/3" />}
        </div>
        <Skeleton className="h-6 w-16 ml-2" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12" />
        </div>
        <div className="flex items-center space-x-2">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>

      <div className="flex space-x-2">
        <Skeleton className="h-6 w-12 rounded-full" />
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    </div>
  )
}

export function ProjectCardSkeleton({ compact = false }: { compact?: boolean }) {
  return (
    <div
      data-testid="project-skeleton"
      className={cn(
        "border rounded-lg p-4 space-y-3",
        compact && "p-3"
      )}
    >
      <div className="flex items-start justify-between">
        <div className="flex items-center space-x-3">
          <Skeleton className="h-10 w-10 rounded-lg" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            {!compact && <Skeleton className="h-3 w-48" />}
          </div>
        </div>
        <Skeleton className="h-6 w-16" />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-3 w-16" />
        </div>
        <div className="flex -space-x-2">
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function StatsCardSkeleton() {
  return (
    <div data-testid="stats-skeleton" className="border rounded-lg p-6 space-y-3">
      <div className="flex items-center justify-between">
        <Skeleton className="h-4 w-24" />
        <Skeleton className="h-4 w-4" />
      </div>
      <Skeleton className="h-8 w-16" />
      <Skeleton className="h-3 w-32" />
    </div>
  )
}

export function DashboardSkeleton() {
  return (
    <div data-testid="dashboard-skeleton" className="space-y-6 p-6">
      {/* Header */}
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {[...Array(5)].map((_, i) => (
          <StatsCardSkeleton key={i} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Recent Tasks */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <TaskCardSkeleton key={i} compact />
            ))}
          </div>
        </div>

        {/* Recent Projects */}
        <div className="border rounded-lg">
          <div className="p-6 border-b">
            <Skeleton className="h-5 w-32 mb-1" />
            <Skeleton className="h-4 w-48" />
          </div>
          <div className="p-6 space-y-3">
            {[...Array(3)].map((_, i) => (
              <ProjectCardSkeleton key={i} compact />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export function TasksPageSkeleton() {
  return (
    <div data-testid="tasks-page-skeleton" className="space-y-6 p-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-8 w-32 mb-2" />
          <Skeleton className="h-4 w-48" />
        </div>
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Filters */}
      <div className="border rounded-lg p-6">
        <Skeleton className="h-5 w-16 mb-4" />
        <div className="flex items-center space-x-4">
          <Skeleton className="h-4 w-12" />
          <div className="flex space-x-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-20" />
            ))}
          </div>
        </div>
      </div>

      {/* Tasks List */}
      <div className="space-y-4">
        {[...Array(5)].map((_, i) => (
          <TaskCardSkeleton key={i} />
        ))}
      </div>
    </div>
  )
}

export function TaskDetailSkeleton() {
  return (
    <div data-testid="task-detail-skeleton" className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-6 border-b">
        <Skeleton className="h-6 w-64 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>

      {/* Tabs */}
      <div className="flex-1 overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex space-x-4">
            <Skeleton className="h-8 w-16" />
            <Skeleton className="h-8 w-24" />
            <Skeleton className="h-8 w-28" />
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Info */}
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-5 w-32 mb-4" />
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center space-x-2">
                  <Skeleton className="h-4 w-16" />
                  <Skeleton className="h-4 w-24" />
                </div>
              ))}
            </div>

            {/* Description & Tags */}
            <div className="border rounded-lg p-6 space-y-4">
              <Skeleton className="h-5 w-32 mb-4" />
              <div className="space-y-2">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </div>
              <div className="flex space-x-2 mt-4">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20 rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}