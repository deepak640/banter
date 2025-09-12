"use client";
import React from "react";
import Image from "next/image";
import { Button } from "./ui/button";
import { X } from "lucide-react";
import { IconButton } from "./ui/icon-button";

interface ImagePreviewProps {
  selectedFile: File;
  onCancel: () => void;
  onSend: () => void;
  isUploading?: boolean;
}

export function ImagePreview({
  selectedFile,
  onCancel,
  onSend,
  isUploading,
}: ImagePreviewProps) {
  return (
    <div className="relative w-full max-w-md p-4 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <div className="relative">
        <Image
          src={URL.createObjectURL(selectedFile)}
          alt="Image Preview"
          width={400}
          height={300}
          className="object-contain rounded-lg"
        />
        <div className="absolute top-2 right-2">
          <IconButton onClick={onCancel} disabled={isUploading}>
            <X className="w-5 h-5" />
          </IconButton>
        </div>
      </div>
      <div className="flex justify-end mt-4">
        <Button onClick={onSend} disabled={isUploading}>
          {isUploading ? "Sending..." : "Send"}
        </Button>
      </div>
    </div>
  );
}