
import React from 'react';
import { Image as ImageIcon, X } from "lucide-react";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

interface ImageUploadAreaProps {
  uploadedImage: UploadedImage | null;
  onImageUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
  fileInputRef: React.RefObject<HTMLInputElement>;
}

const ImageUploadArea: React.FC<ImageUploadAreaProps> = ({
  uploadedImage,
  onImageUpload,
  onRemoveImage,
  fileInputRef
}) => {
  return (
    <div className="flex flex-col gap-2">
      <div className="w-full h-32 bg-black/30 border border-dashed border-white/20 rounded-lg flex flex-col items-center justify-center relative">
        {uploadedImage ? (
          <div className="relative w-full h-full">
            <img 
              src={uploadedImage.preview} 
              alt="Uploaded image" 
              className="w-full h-full object-contain"
            />
            <button
              onClick={onRemoveImage}
              className="absolute top-2 right-2 bg-black/50 rounded-full p-1 hover:bg-black/70 transition-colors"
              title="Remove image"
            >
              <X className="h-4 w-4 text-white" />
            </button>
          </div>
        ) : (
          <>
            <ImageIcon className="h-8 w-8 text-slate-500 mb-2" />
            <p className="text-sm text-slate-400 text-center">
              Drop image here or click to upload
            </p>
            <input
              type="file"
              ref={fileInputRef}
              accept="image/*"
              onChange={onImageUpload}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ImageUploadArea;
