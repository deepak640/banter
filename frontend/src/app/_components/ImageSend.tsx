"use client";
import React, { useState, forwardRef } from "react";
import { ImagePreview } from "./ImagePreview";
import { toastError } from "@/utils/toast";
import axios from "axios";
import { BASE_URL } from "@/services/url.service";

interface ImageSendProps {
  onSend: (imageUrl: string) => void;
}

export const ImageSend = forwardRef<HTMLInputElement, ImageSendProps>(({ onSend }, ref) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleCancel = () => {
    setSelectedFile(null);
  };

  const handleSend = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("image", selectedFile);

    try {
      const res = await axios.post(`${BASE_URL}/upload`, formData);
      onSend(res.data.url);
      setSelectedFile(null);
    } catch (error) {
      toastError("Image upload failed");
      console.error(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        ref={ref}
      />

      {selectedFile && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <ImagePreview
            selectedFile={selectedFile}
            onCancel={handleCancel}
            onSend={handleSend}
            isUploading={isUploading}
          />
        </div>
      )}
    </div>
  );
});

ImageSend.displayName = "ImageSend";
