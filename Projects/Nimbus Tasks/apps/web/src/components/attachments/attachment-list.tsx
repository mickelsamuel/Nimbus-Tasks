"use client";

import { useState } from "react";
import { Button, Card, CardContent } from "@nimbus/ui";
import { Download, File, Trash2, Eye, Image as ImageIcon } from "lucide-react";
import { api } from "~/trpc/react";
import type { RouterOutputs } from "~/trpc/shared";

type Attachment = RouterOutputs["attachment"]["getByTaskId"][0];

interface AttachmentListProps {
  taskId: string;
  attachments: Attachment[];
  onAttachmentDeleted?: (attachmentId: string) => void;
}

export function AttachmentList({
  taskId,
  attachments,
  onAttachmentDeleted
}: AttachmentListProps) {
  const [downloadingIds, setDownloadingIds] = useState<Set<string>>(new Set());

  const generateDownloadUrlMutation = api.attachment.generateDownloadUrl.useMutation();
  const deleteAttachmentMutation = api.attachment.delete.useMutation();

  const handleDownload = async (attachment: Attachment) => {
    if (downloadingIds.has(attachment.id)) return;

    setDownloadingIds(prev => new Set(prev).add(attachment.id));

    try {
      const { downloadUrl } = await generateDownloadUrlMutation.mutateAsync({
        attachmentId: attachment.id,
      });

      // Create a temporary link and click it to download
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = attachment.filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("Download failed:", error);
      // TODO: Show toast notification
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(attachment.id);
        return newSet;
      });
    }
  };

  const handleDelete = async (attachment: Attachment) => {
    if (!confirm(`Are you sure you want to delete "${attachment.filename}"?`)) {
      return;
    }

    try {
      await deleteAttachmentMutation.mutateAsync({
        attachmentId: attachment.id,
      });
      onAttachmentDeleted?.(attachment.id);
    } catch (error) {
      console.error("Delete failed:", error);
      // TODO: Show toast notification
    }
  };

  const getFileIcon = (mimeType: string) => {
    if (mimeType.startsWith("image/")) {
      return <ImageIcon className="h-4 w-4" />;
    }
    return <File className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const isImage = (mimeType: string) => mimeType.startsWith("image/");

  if (attachments.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-8">
          <File className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">No attachments yet</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-2">
      {attachments.map((attachment) => (
        <Card key={attachment.id} className="p-3">
          <div className="flex items-center space-x-3">
            <div className="flex-shrink-0">
              {getFileIcon(attachment.mimeType)}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {attachment.filename}
              </p>
              <div className="flex items-center space-x-2 text-xs text-gray-500">
                <span>{formatFileSize(attachment.fileSize)}</span>
                <span>•</span>
                <span>{new Date(attachment.createdAt).toLocaleDateString()}</span>
              </div>
            </div>

            <div className="flex items-center space-x-1">
              {isImage(attachment.mimeType) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDownload(attachment)}
                  disabled={downloadingIds.has(attachment.id)}
                  title="Preview"
                >
                  <Eye className="h-3 w-3" />
                </Button>
              )}

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDownload(attachment)}
                disabled={downloadingIds.has(attachment.id)}
                title="Download"
              >
                <Download className="h-3 w-3" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(attachment)}
                disabled={deleteAttachmentMutation.isLoading}
                title="Delete"
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}