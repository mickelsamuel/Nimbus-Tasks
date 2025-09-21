"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  Button,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@nimbus/ui";
import { Calendar, User, Tag, MessageCircle, Paperclip, Clock } from "lucide-react";
import { api } from "~/trpc/react";
import { FileUpload } from "~/components/attachments/file-upload";
import { AttachmentList } from "~/components/attachments/attachment-list";
import { useRealtimeTaskDetail } from "~/hooks/use-realtime-tasks";
import { TaskDetailSkeleton } from "~/components/ui/skeletons";
import { EmptyCommentsState, EmptyAttachmentsState } from "~/components/ui/empty-states";
import type { RouterOutputs } from "~/trpc/shared";

type Task = RouterOutputs["task"]["getById"];

interface TaskDetailDialogProps {
  taskId: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusColors = {
  TODO: "bg-gray-100 text-gray-800",
  IN_PROGRESS: "bg-blue-100 text-blue-800",
  DONE: "bg-green-100 text-green-800",
  CANCELLED: "bg-red-100 text-red-800",
};

const priorityColors = {
  LOW: "bg-gray-100 text-gray-800",
  MEDIUM: "bg-yellow-100 text-yellow-800",
  HIGH: "bg-orange-100 text-orange-800",
  URGENT: "bg-red-100 text-red-800",
};

export function TaskDetailDialog({ taskId, open, onOpenChange }: TaskDetailDialogProps) {
  const [activeTab, setActiveTab] = useState("details");

  const {
    task,
    attachments,
    isLoading,
    refetchAttachments,
    invalidateRelated
  } = useRealtimeTaskDetail({
    taskId: taskId!,
    enabled: !!taskId && open,
  });

  const handleAttachmentUploaded = () => {
    invalidateRelated();
  };

  const handleAttachmentDeleted = () => {
    invalidateRelated();
  };

  if (!open || !taskId) return null;

  if (isLoading) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden">
          <TaskDetailSkeleton />
        </DialogContent>
      </Dialog>
    );
  }

  if (!task) {
    return (
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Task Not Found</DialogTitle>
            <DialogDescription>
              The task you're looking for could not be found.
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent data-testid="task-details" className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle data-testid="task-detail-title" className="text-xl">{task.title}</DialogTitle>
          <DialogDescription>
            {task.project && (
              <span className="inline-flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: task.project.color }}
                />
                {task.project.name}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
            <TabsList className="flex-shrink-0">
              <TabsTrigger data-testid="details-tab" value="details">Details</TabsTrigger>
              <TabsTrigger data-testid="comments-tab" value="comments">
                <MessageCircle className="w-4 h-4 mr-1" />
                Comments ({task.comments?.length || 0})
              </TabsTrigger>
              <TabsTrigger data-testid="attachments-tab" value="attachments">
                <Paperclip className="w-4 h-4 mr-1" />
                Attachments ({attachments?.length || 0})
              </TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-auto mt-4">
              <TabsContent value="details" className="mt-0 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Task Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Task Information</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Status:</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            statusColors[task.status]
                          }`}
                        >
                          {task.status.replace("_", " ")}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <span className="text-sm font-medium">Priority:</span>
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            priorityColors[task.priority]
                          }`}
                        >
                          {task.priority}
                        </span>
                      </div>

                      {task.assignee && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Assignee:</span>
                          <div className="flex items-center space-x-2">
                            {task.assignee.image ? (
                              <img
                                src={task.assignee.image}
                                alt={task.assignee.name || "User"}
                                className="w-6 h-6 rounded-full"
                              />
                            ) : (
                              <div className="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center">
                                <User className="w-3 h-3 text-gray-600" />
                              </div>
                            )}
                            <span className="text-sm">{task.assignee.name}</span>
                          </div>
                        </div>
                      )}

                      {task.dueAt && (
                        <div className="flex items-center space-x-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Due:</span>
                          <span className="text-sm">
                            {new Date(task.dueAt).toLocaleDateString()}
                          </span>
                        </div>
                      )}

                      <div className="flex items-center space-x-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="text-sm font-medium">Created:</span>
                        <span className="text-sm">
                          {new Date(task.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {task.creator && (
                        <div className="flex items-center space-x-2">
                          <User className="w-4 h-4 text-gray-500" />
                          <span className="text-sm font-medium">Creator:</span>
                          <span className="text-sm">{task.creator.name}</span>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Description & Tags */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Description & Tags</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {task.description ? (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Description</h4>
                          <p className="text-sm text-gray-600 whitespace-pre-wrap">
                            {task.description}
                          </p>
                        </div>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No description provided</p>
                      )}

                      {task.tags && task.tags.length > 0 && (
                        <div>
                          <h4 className="text-sm font-medium mb-2">Tags</h4>
                          <div className="flex flex-wrap gap-2">
                            {task.tags.map((tag) => (
                              <span
                                key={tag.id}
                                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium"
                                style={{
                                  backgroundColor: tag.color + "20",
                                  color: tag.color,
                                }}
                              >
                                <Tag className="w-3 h-3 mr-1" />
                                {tag.name}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              <TabsContent value="comments" className="mt-0">
                <Card>
                  <CardContent className="p-6">
                    {task.comments && task.comments.length > 0 ? (
                      <div className="space-y-4">
                        {task.comments.map((comment) => (
                          <div key={comment.id} className="border-b border-gray-200 pb-4 last:border-b-0">
                            <div className="flex items-start space-x-3">
                              {comment.user.image ? (
                                <img
                                  src={comment.user.image}
                                  alt={comment.user.name || "User"}
                                  className="w-8 h-8 rounded-full"
                                />
                              ) : (
                                <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
                                  <User className="w-4 h-4 text-gray-600" />
                                </div>
                              )}
                              <div className="flex-1">
                                <div className="flex items-center space-x-2 mb-1">
                                  <span className="text-sm font-medium">{comment.user.name}</span>
                                  <span className="text-xs text-gray-500">
                                    {new Date(comment.createdAt).toLocaleString()}
                                  </span>
                                </div>
                                <p className="text-sm text-gray-600 whitespace-pre-wrap">
                                  {comment.content}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <EmptyCommentsState />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="attachments" className="mt-0 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Upload Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <FileUpload
                      taskId={task.id}
                      onUploadComplete={handleAttachmentUploaded}
                    />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Attachments</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {attachments && attachments.length > 0 ? (
                      <AttachmentList
                        taskId={task.id}
                        attachments={attachments}
                        onAttachmentDeleted={handleAttachmentDeleted}
                      />
                    ) : (
                      <EmptyAttachmentsState />
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}