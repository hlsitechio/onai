
import React, { useRef, useState } from 'react';
import { Image, Upload, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Editor } from '@tiptap/react';

interface ImageControlsProps {
  editor: Editor;
}

const ImageControls: React.FC<ImageControlsProps> = ({ editor }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const insertImageFromUrl = () => {
    if (!imageUrl) return;

    try {
      if (editor?.chain) {
        editor.chain().focus().setImage({ src: imageUrl, alt: altText }).run();
      } else {
        const imgHtml = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto;" />`;
        document.execCommand('insertHTML', false, imgHtml);
      }
    } catch {
      const imgHtml = `<img src="${imageUrl}" alt="${altText}" style="max-width: 100%; height: auto;" />`;
      document.execCommand('insertHTML', false, imgHtml);
    }

    setImageUrl('');
    setAltText('');
    setIsDialogOpen(false);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;
        try {
          if (editor?.chain) {
            editor.chain().focus().setImage({ src: base64, alt: altText || file.name }).run();
          } else {
            const imgHtml = `<img src="${base64}" alt="${altText || file.name}" style="max-width: 100%; height: auto;" />`;
            document.execCommand('insertHTML', false, imgHtml);
          }
        } catch {
          const imgHtml = `<img src="${base64}" alt="${altText || file.name}" style="max-width: 100%; height: auto;" />`;
          document.execCommand('insertHTML', false, imgHtml);
        }
        setIsDialogOpen(false);
        setAltText('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Insert Image"
        >
          <Image className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#27202C] border-white/10 text-white">
        <DialogHeader>
          <DialogTitle>Insert Image</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="url" className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-black/20">
            <TabsTrigger value="url">From URL</TabsTrigger>
            <TabsTrigger value="upload">Upload File</TabsTrigger>
          </TabsList>
          
          <TabsContent value="url" className="space-y-4">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                type="url"
                placeholder="https://example.com/image.jpg"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="altText">Alt Text (optional)</Label>
              <Input
                id="altText"
                type="text"
                placeholder="Description of the image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            
            <div className="flex justify-end gap-2">
              <Button
                variant="ghost"
                onClick={() => setIsDialogOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                Cancel
              </Button>
              <Button
                onClick={insertImageFromUrl}
                disabled={!imageUrl}
                className="bg-noteflow-500 hover:bg-noteflow-600"
              >
                <Link className="h-4 w-4 mr-2" />
                Insert Image
              </Button>
            </div>
          </TabsContent>
          
          <TabsContent value="upload" className="space-y-4">
            <div>
              <Label htmlFor="altTextUpload">Alt Text (optional)</Label>
              <Input
                id="altTextUpload"
                type="text"
                placeholder="Description of the image"
                value={altText}
                onChange={(e) => setAltText(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            
            <div className="border-2 border-dashed border-white/20 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="hidden"
              />
              <Button
                onClick={() => fileInputRef.current?.click()}
                variant="ghost"
                className="text-gray-300 hover:text-white"
              >
                <Upload className="h-4 w-4 mr-2" />
                Choose Image File
              </Button>
              <p className="text-sm text-gray-400 mt-2">
                Supports JPG, PNG, GIF, WebP
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ImageControls;
