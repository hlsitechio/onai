
import React from 'react';
import { Button } from "@/components/ui/button";
import { Upload, X, FileImage, Eye, EyeOff, Clipboard } from "lucide-react";
import { OCRImageUploadProps } from '../types/OCRTypes';

const OCRImageUpload: React.FC<OCRImageUploadProps> = ({
  uploadedImage,
  isProcessing,
  showPreview,
  setShowPreview,
  onImageUpload,
  onClearAll,
  onExtractText,
  fileInputRef
}) => {
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      console.log('File dropped:', file.name);
      onImageUpload(file);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected from input:', file.name);
      onImageUpload(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">Image Upload</h3>
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="text-slate-300 hover:text-white"
          >
            {showPreview ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            {showPreview ? 'Hide' : 'Show'} Preview
          </Button>
          {uploadedImage && (
            <Button
              variant="ghost"
              size="sm"
              onClick={onClearAll}
              className="text-red-400 hover:text-red-300"
            >
              <X className="h-4 w-4 mr-1" />
              Clear
            </Button>
          )}
        </div>
      </div>

      {!uploadedImage ? (
        <div 
          className="flex-1 border-2 border-dashed border-white/30 rounded-lg flex flex-col items-center justify-center p-8 hover:border-noteflow-400/50 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
          tabIndex={0}
          role="button"
          aria-label="Upload an image"
        >
          <Upload className="h-16 w-16 text-white/40 mb-4" />
          <h3 className="text-xl font-medium mb-2">Upload Image</h3>
          <p className="text-slate-400 text-center mb-6">
            Drag & drop an image here, or click to browse<br />
            <span className="text-sm">Supports JPG, PNG, WebP (max 10MB)</span>
          </p>
          
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              className="bg-noteflow-600 hover:bg-noteflow-700 border-noteflow-500"
            >
              <Upload className="h-4 w-4 mr-2" />
              Browse Files
            </Button>
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>
      ) : (
        showPreview && (
          <div className="flex-1 bg-black/50 rounded-lg p-4 overflow-auto">
            <img 
              src={uploadedImage} 
              alt="Uploaded for OCR" 
              className="max-w-full max-h-full object-contain mx-auto rounded"
            />
          </div>
        )
      )}

      {uploadedImage && (
        <div className="mt-4 flex gap-3">
          <Button 
            onClick={onExtractText}
            disabled={isProcessing}
            className="flex-1 bg-noteflow-600 hover:bg-noteflow-700"
          >
            {isProcessing ? (
              <>
                <FileImage className="h-4 w-4 mr-2" />
                Extracting Text...
              </>
            ) : (
              <>
                <FileImage className="h-4 w-4 mr-2" />
                Re-extract Text
              </>
            )}
          </Button>
          
          <Button 
            variant="outline" 
            onClick={() => fileInputRef.current?.click()}
            className="border-white/20 hover:bg-white/10"
          >
            <Upload className="h-4 w-4 mr-2" />
            Change Image
          </Button>
        </div>
      )}

      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  );
};

export default OCRImageUpload;
