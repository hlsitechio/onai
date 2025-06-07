
import { useState, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";

interface UploadedImage {
  url: string;
  preview: string;
  name: string;
}

export const useImageUpload = () => {
  const [uploadedImage, setUploadedImage] = useState<UploadedImage | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Check file size (max 4MB)
    if (file.size > 4 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 4MB",
        variant: "destructive"
      });
      return;
    }
    
    // Create object URL for preview
    const objectUrl = URL.createObjectURL(file);
    
    // Convert to base64 for storage/transmission
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      setUploadedImage({
        url: reader.result as string,
        preview: objectUrl,
        name: file.name
      });
    };
  };
  
  const removeUploadedImage = () => {
    if (uploadedImage) {
      URL.revokeObjectURL(uploadedImage.preview);
      setUploadedImage(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  return {
    uploadedImage,
    fileInputRef,
    handleImageUpload,
    removeUploadedImage
  };
};
