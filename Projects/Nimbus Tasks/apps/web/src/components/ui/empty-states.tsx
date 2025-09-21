import { Button, Card, CardContent } from "@nimbus/ui"
import { CheckSquare, Plus, FolderOpen, Users, Search, Zap } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  action?: {
    label: string
    onClick: () => void
    variant?: 'default' | 'outline' | 'ghost'
  }
  secondaryAction?: {
    label: string
    onClick: () => void
  }
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction
}: EmptyStateProps) {
  return (
    <Card data-testid="empty-state" className="border-dashed">
      <CardContent className="flex flex-col items-center justify-center py-12 px-6 text-center">
        {icon && (
          <div className="mb-4 text-gray-400">
            {icon}
          </div>
        )}

        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          {title}
        </h3>

        <p className="text-gray-600 mb-6 max-w-md">
          {description}
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          {action && (
            <Button
              onClick={action.onClick}
              variant={action.variant || 'default'}
              data-testid="empty-state-primary-action"
            >
              {action.label}
            </Button>
          )}

          {secondaryAction && (
            <Button
              onClick={secondaryAction.onClick}
              variant="outline"
              data-testid="empty-state-secondary-action"
            >
              {secondaryAction.label}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export function EmptyTasksState({ onCreateTask }: { onCreateTask: () => void }) {
  return (
    <EmptyState
      icon={<CheckSquare className="w-12 h-12" />}
      title="No tasks yet"
      description="Get started by creating your first task. Organize your work, set priorities, and track progress all in one place."
      action={{
        label: "Create First Task",
        onClick: onCreateTask
      }}
      secondaryAction={{
        label: "Learn More",
        onClick: () => console.log("Show help")
      }}
    />
  )
}

export function EmptyProjectsState({ onCreateProject }: { onCreateProject: () => void }) {
  return (
    <EmptyState
      icon={<FolderOpen className="w-12 h-12" />}
      title="No projects yet"
      description="Projects help you organize related tasks and collaborate with your team. Create your first project to get started."
      action={{
        label: "Create First Project",
        onClick: onCreateProject
      }}
      secondaryAction={{
        label: "Import Project",
        onClick: () => console.log("Show import")
      }}
    />
  )
}

export function EmptyFilteredTasksState({
  filter,
  onClearFilter
}: {
  filter: string
  onClearFilter: () => void
}) {
  const getFilterMessage = (filter: string) => {
    switch (filter) {
      case 'TODO':
        return {
          title: "No pending tasks",
          description: "All caught up! You don't have any tasks waiting to be started."
        }
      case 'IN_PROGRESS':
        return {
          title: "No tasks in progress",
          description: "No tasks are currently being worked on. Start working on a task to see it here."
        }
      case 'DONE':
        return {
          title: "No completed tasks",
          description: "Complete some tasks to see your accomplishments here."
        }
      default:
        return {
          title: "No tasks found",
          description: "No tasks match your current filters."
        }
    }
  }

  const { title, description } = getFilterMessage(filter)

  return (
    <EmptyState
      icon={<Search className="w-12 h-12" />}
      title={title}
      description={description}
      action={{
        label: "Clear Filter",
        onClick: onClearFilter,
        variant: 'outline'
      }}
    />
  )
}

export function EmptySearchState({
  query,
  onClearSearch
}: {
  query: string
  onClearSearch: () => void
}) {
  return (
    <EmptyState
      icon={<Search className="w-12 h-12" />}
      title="No results found"
      description={`No tasks, projects, or content found for "${query}". Try adjusting your search terms or clearing the search.`}
      action={{
        label: "Clear Search",
        onClick: onClearSearch,
        variant: 'outline'
      }}
    />
  )
}

export function EmptyTeamState({ onInviteMembers }: { onInviteMembers: () => void }) {
  return (
    <EmptyState
      icon={<Users className="w-12 h-12" />}
      title="No team members yet"
      description="Invite your colleagues to collaborate on projects and tasks. Working together makes everything more efficient."
      action={{
        label: "Invite Team Members",
        onClick: onInviteMembers
      }}
    />
  )
}

export function EmptyNotificationsState() {
  return (
    <EmptyState
      icon={<Zap className="w-12 h-12" />}
      title="All caught up!"
      description="You have no new notifications. We'll let you know when there's something that needs your attention."
    />
  )
}

export function EmptyCommentsState({ onAddComment }: { onAddComment?: () => void }) {
  return (
    <div data-testid="empty-comments" className="text-center py-8">
      <MessageCircle className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-500 mb-4">No comments yet</p>
      {onAddComment && (
        <Button
          onClick={onAddComment}
          variant="outline"
          size="sm"
          data-testid="add-first-comment"
        >
          <Plus className="w-4 h-4 mr-1" />
          Add First Comment
        </Button>
      )}
    </div>
  )
}

export function EmptyAttachmentsState() {
  return (
    <div data-testid="empty-attachments" className="text-center py-8">
      <Paperclip className="w-8 h-8 text-gray-400 mx-auto mb-2" />
      <p className="text-sm text-gray-500">No attachments yet</p>
      <p className="text-xs text-gray-400 mt-1">
        Upload files to share with your team
      </p>
    </div>
  )
}

// Import missing icons
import { MessageCircle, Paperclip } from "lucide-react"