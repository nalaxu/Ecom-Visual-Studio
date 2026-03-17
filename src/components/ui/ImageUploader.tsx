'use client';

import * as React from 'react';
import { useCallback, useState } from 'react';
import { UploadCloud, X, FileImage } from 'lucide-react';
import { cn, formatBytes } from '@/lib/utils';

interface ImageUploaderProps {
  onImageSelected: (file: File | null, previewUrl: string | null) => void;
  className?: string;
}

export function ImageUploader({ onImageSelected, className }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('请上传图片文件 (JPG, PNG, WebP等)');
      return;
    }

    const objectUrl = URL.createObjectURL(file);
    setSelectedFile(file);
    setPreviewUrl(objectUrl);
    onImageSelected(file, objectUrl);
  }, [onImageSelected]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  const clearImage = useCallback(() => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedFile(null);
    setPreviewUrl(null);
    onImageSelected(null, null);
  }, [previewUrl, onImageSelected]);

  return (
    <div className={cn("w-full relative", className)}>
      {!previewUrl ? (
        <label
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={cn(
            "flex flex-col items-center justify-center w-full h-64 border-2 border-dashed rounded-xl cursor-pointer transition-all duration-200 ease-in-out bg-muted/20 hover:bg-muted/40",
            isDragging ? "border-primary bg-primary/5" : "border-border"
          )}
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <UploadCloud className={cn("w-10 h-10 mb-4 transition-colors", isDragging ? "text-primary" : "text-muted-foreground")} />
            <p className="mb-2 text-sm text-foreground font-medium">
              <span className="font-semibold text-primary">点击上传</span> 或是把图片拖拽到这里
            </p>
            <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (最大尺寸建议 5MB)</p>
          </div>
          <input 
            type="file" 
            className="hidden" 
            accept="image/*" 
            onChange={handleFileChange} 
          />
        </label>
      ) : (
        <div className="relative w-full h-64 rounded-xl overflow-hidden border border-border group bg-muted/30 flex items-center justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={previewUrl} 
            alt="Preview" 
            className="max-h-full max-w-full object-contain"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
             <button
                type="button"
                onClick={clearImage}
                className="bg-destructive text-destructive-foreground p-2 rounded-full hover:bg-destructive/90 transition-colors shadow-sm"
                title="移除图片"
             >
                <X className="w-5 h-5" />
             </button>
          </div>
          {selectedFile && (
            <div className="absolute bottom-2 left-2 right-2 bg-background/80 backdrop-blur-sm p-2 rounded-lg text-xs flex items-center justify-between border border-border">
              <span className="truncate flex items-center gap-2 max-w-[70%]">
                <FileImage className="w-4 h-4 text-primary shrink-0" />
                <span className="truncate">{selectedFile.name}</span>
              </span>
              <span className="text-muted-foreground font-medium">{formatBytes(selectedFile.size)}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
