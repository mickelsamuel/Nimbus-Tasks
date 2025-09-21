"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Button, Card, CardContent } from "@nimbus/ui";
import { Upload, File, X, AlertCircle, CheckCircle } from "lucide-react";
import { api } from "~/trpc/react";
import { validateFile, ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "~/lib/s3";

interface FileUploadProps {
  taskId: string;
  onUploadComplete?: (attachment: any) => void;
  disabled?: boolean;
}

interface UploadProgress {
  file: File;
  progress: number;
  status: "uploading" | "success" | "error";
  error?: string;
  attachmentId?: string;
}

export function FileUpload({ taskId, onUploadComplete, disabled }: FileUploadProps) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const generateUploadUrlMutation = api.attachment.generateUploadUrl.useMutation();
  const createAttachmentMutation = api.attachment.create.useMutation();

  const uploadFile = async (file: File) => {
    const uploadId = Math.random().toString(36);

    // Add to uploads list
    setUploads(prev => [...prev, {
      file,
      progress: 0,
      status: "uploading",
    }]);

    try {
      // Step 1: Get signed upload URL
      const { uploadUrl, key, fileUrl } = await generateUploadUrlMutation.mutateAsync({
        filename: file.name,
        contentType: file.type as any,
        fileSize: file.size,
        taskId,
      });

      // Step 2: Upload file to S3
      const xhr = new XMLHttpRequest();

      xhr.upload.addEventListener("progress", (event) => {
        if (event.lengthComputable) {
          const progress = Math.round((event.loaded / event.total) * 100);
          setUploads(prev => prev.map(upload =>
            upload.file === file
              ? { ...upload, progress }
              : upload
          ));
        }
      });

      await new Promise<void>((resolve, reject) => {
        xhr.onload = () => {
          if (xhr.status === 200) {
            resolve();
          } else {
            reject(new Error(`Upload failed with status ${xhr.status}`));
          }
        };

        xhr.onerror = () => reject(new Error("Upload failed"));

        xhr.open("PUT", uploadUrl);
        xhr.setRequestHeader("Content-Type", file.type);
        xhr.send(file);
      });

      // Step 3: Create attachment record
      const attachment = await createAttachmentMutation.mutateAsync({
        filename: file.name,
        fileUrl,
        fileSize: file.size,
        mimeType: file.type,
        taskId,
      });

      // Update upload status
      setUploads(prev => prev.map(upload =>
        upload.file === file
          ? { ...upload, status: "success" as const, progress: 100, attachmentId: attachment.id }
          : upload
      ));

      onUploadComplete?.(attachment);

      // Remove from list after 3 seconds
      setTimeout(() => {
        setUploads(prev => prev.filter(upload => upload.file !== file));
      }, 3000);

    } catch (error) {
      console.error("Upload failed:", error);
      setUploads(prev => prev.map(upload =>
        upload.file === file
          ? {
              ...upload,
              status: "error" as const,
              error: error instanceof Error ? error.message : "Upload failed"
            }
          : upload
      ));
    }
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    for (const file of acceptedFiles) {
      const validation = validateFile(file);
      if (!validation.valid) {
        setUploads(prev => [...prev, {
          file,
          progress: 0,
          status: "error",
          error: validation.error,
        }]);
        continue;
      }

      await uploadFile(file);
    }
  }, [taskId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    disabled,
    multiple: true,
    accept: ALLOWED_FILE_TYPES.reduce((acc, type) => {
      acc[type] = [];
      return acc;
    }, {} as Record<string, string[]>),
    maxSize: MAX_FILE_SIZE,
  });

  const removeUpload = (file: File) => {
    setUploads(prev => prev.filter(upload => upload.file !== file));
  };

  return (
    <div className="space-y-4">
      {/* Dropzone */}
      <Card
        {...getRootProps()}
        className={`border-2 border-dashed transition-colors cursor-pointer ${
          isDragActive
            ? "border-blue-500 bg-blue-50"
            : "border-gray-300 hover:border-gray-400"
        } ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
      >
        <CardContent className="flex flex-col items-center justify-center py-8">
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 text-gray-400 mb-2" />
          <p className="text-sm text-gray-600 text-center">
            {isDragActive ? (
              "Drop files here..."
            ) : (
              <>
                <span className="font-medium">Click to upload</span> or drag and drop
                <br />
                <span className="text-xs text-gray-500">
                  Max {MAX_FILE_SIZE / 1024 / 1024}MB • Images, PDFs, Documents
                </span>
              </>
            )}
          </p>
        </CardContent>
      </Card>

      {/* Upload Progress */}
      {uploads.length > 0 && (
        <div className="space-y-2">
          {uploads.map((upload, index) => (
            <Card key={index} className="p-3">
              <div className="flex items-center space-x-3">
                <File className="h-4 w-4 text-gray-500 flex-shrink-0" />

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {upload.file.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {(upload.file.size / 1024 / 1024).toFixed(2)} MB
                  </p>

                  {upload.status === "uploading" && (
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                      <div
                        className="bg-blue-500 h-1.5 rounded-full transition-all"
                        style={{ width: `${upload.progress}%` }}
                      />
                    </div>
                  )}

                  {upload.status === "error" && (
                    <p className="text-xs text-red-600 mt-1">{upload.error}</p>
                  )}
                </div>

                <div className="flex items-center space-x-2">
                  {upload.status === "uploading" && (
                    <div className="text-xs text-gray-500">{upload.progress}%</div>
                  )}

                  {upload.status === "success" && (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  )}

                  {upload.status === "error" && (
                    <AlertCircle className="h-4 w-4 text-red-500" />
                  )}

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeUpload(upload.file)}
                    className="h-6 w-6 p-0"
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}