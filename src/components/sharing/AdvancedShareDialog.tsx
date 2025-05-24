
import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { 
  Copy, 
  Check, 
  Download, 
  Share, 
  QrCode, 
  Link,
  FileText,
  Code,
  Globe
} from "lucide-react";
import { toast } from "@/hooks/use-toast";
import {
  createShareUrl,
  downloadAsFile,
  shareNatively,
  generateQRShareData,
  formatContent,
  ShareOptions
} from '@/utils/advancedSharing';

interface AdvancedShareDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title?: string;
}

const AdvancedShareDialog: React.FC<AdvancedShareDialogProps> = ({
  isOpen,
  onOpenChange,
  content,
  title: defaultTitle
}) => {
  const [shareUrl, setShareUrl] = useState<string>('');
  const [copied, setCopied] = useState(false);
  const [shareOptions, setShareOptions] = useState<ShareOptions>({
    title: defaultTitle || 'My Note',
    format: 'txt',
    includeMetadata: true
  });
  const [previewContent, setPreviewContent] = useState<string>('');

  // Update preview when options change
  useEffect(() => {
    if (content) {
      const formatted = formatContent(content, shareOptions.format || 'txt', shareOptions);
      setPreviewContent(formatted);
    }
  }, [content, shareOptions]);

  // Reset states when dialog opens/closes
  useEffect(() => {
    if (isOpen) {
      setShareUrl('');
      setCopied(false);
      setShareOptions(prev => ({
        ...prev,
        title: defaultTitle || 'My Note'
      }));
    }
  }, [isOpen, defaultTitle]);

  const handleCreateShareUrl = () => {
    const result = createShareUrl(content, shareOptions);
    
    if (result.success && result.shareUrl) {
      setShareUrl(result.shareUrl);
      toast({
        title: "Share link created",
        description: "Your note is now shareable via URL",
      });
    } else {
      toast({
        title: "Failed to create share link",
        description: result.error || "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleCopyUrl = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      toast({
        title: "Link copied",
        description: "Share URL copied to clipboard",
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const result = downloadAsFile(content, shareOptions);
    
    if (result.success) {
      toast({
        title: "File downloaded",
        description: `Note downloaded as ${shareOptions.format} file`,
      });
    } else {
      toast({
        title: "Download failed",
        description: result.error || "Unknown error",
        variant: "destructive",
      });
    }
  };

  const handleNativeShare = async () => {
    const result = await shareNatively(content, shareOptions);
    
    if (result.success) {
      toast({
        title: "Shared successfully",
        description: "Note shared using device share menu",
      });
    } else {
      toast({
        title: "Share failed",
        description: result.error || "Native sharing not available",
        variant: "destructive",
      });
    }
  };

  const handleQRShare = () => {
    if (!shareUrl) {
      handleCreateShareUrl();
    }
    
    if (shareUrl) {
      // For now, we'll just copy the URL - QR generation would need a library
      navigator.clipboard.writeText(shareUrl);
      toast({
        title: "QR Code URL copied",
        description: "Use any QR code generator with this URL",
      });
    }
  };

  const formatIcons = {
    txt: FileText,
    md: FileText,
    html: Globe,
    json: Code
  };

  const FormatIcon = formatIcons[shareOptions.format as keyof typeof formatIcons] || FileText;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl bg-black/90 backdrop-blur-md border border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share className="h-5 w-5" />
            Share Your Note
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="share" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/30">
            <TabsTrigger value="share" className="data-[state=active]:bg-white/10">
              Share Options
            </TabsTrigger>
            <TabsTrigger value="format" className="data-[state=active]:bg-white/10">
              Format & Settings
            </TabsTrigger>
            <TabsTrigger value="preview" className="data-[state=active]:bg-white/10">
              Preview
            </TabsTrigger>
          </TabsList>

          <TabsContent value="share" className="space-y-4">
            {/* URL Sharing */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium flex items-center gap-2">
                <Link className="h-4 w-4" />
                Share via URL
              </h3>
              
              {shareUrl ? (
                <div className="flex items-center gap-2">
                  <Input 
                    value={shareUrl} 
                    readOnly 
                    className="bg-black/30 border-white/10 text-white"
                  />
                  <Button 
                    variant="outline" 
                    size="icon"
                    className="shrink-0 bg-black/30 border-white/10 hover:bg-black/40"
                    onClick={handleCopyUrl}
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-green-500" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              ) : (
                <Button 
                  variant="outline"
                  className="w-full bg-black/30 border-white/10 hover:bg-black/40"
                  onClick={handleCreateShareUrl}
                >
                  Create Share Link
                </Button>
              )}
              
              <p className="text-xs text-slate-400">
                Creates a temporary shareable link (expires in 7 days)
              </p>
            </div>

            <div className="h-px bg-white/10" />

            {/* Quick Actions */}
            <div className="grid grid-cols-2 gap-3">
              <Button
                variant="outline"
                className="bg-black/30 border-white/10 hover:bg-black/40 flex items-center gap-2"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                Download File
              </Button>
              
              <Button
                variant="outline"
                className="bg-black/30 border-white/10 hover:bg-black/40 flex items-center gap-2"
                onClick={handleNativeShare}
              >
                <Share className="h-4 w-4" />
                Device Share
              </Button>
            </div>

            {shareUrl && (
              <Button
                variant="outline"
                className="w-full bg-black/30 border-white/10 hover:bg-black/40 flex items-center gap-2"
                onClick={handleQRShare}
              >
                <QrCode className="h-4 w-4" />
                Copy for QR Code
              </Button>
            )}
          </TabsContent>

          <TabsContent value="format" className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Note Title</Label>
                <Input
                  id="title"
                  value={shareOptions.title}
                  onChange={(e) => setShareOptions(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-black/30 border-white/10 text-white"
                  placeholder="Enter note title..."
                />
              </div>

              <div className="space-y-2">
                <Label>Export Format</Label>
                <div className="grid grid-cols-2 gap-2">
                  {(['txt', 'md', 'html', 'json'] as const).map((format) => {
                    const Icon = formatIcons[format];
                    return (
                      <Button
                        key={format}
                        variant={shareOptions.format === format ? "default" : "outline"}
                        className={`flex items-center gap-2 ${
                          shareOptions.format === format 
                            ? "bg-white/20" 
                            : "bg-black/30 border-white/10 hover:bg-black/40"
                        }`}
                        onClick={() => setShareOptions(prev => ({ ...prev, format }))}
                      >
                        <Icon className="h-4 w-4" />
                        {format.toUpperCase()}
                      </Button>
                    );
                  })}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="metadata">Include Metadata</Label>
                <Switch
                  id="metadata"
                  checked={shareOptions.includeMetadata}
                  onCheckedChange={(checked) => 
                    setShareOptions(prev => ({ ...prev, includeMetadata: checked }))
                  }
                />
              </div>
              
              <p className="text-xs text-slate-400">
                Metadata includes title, creation date, and source attribution
              </p>
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <FormatIcon className="h-4 w-4" />
                <span className="text-sm font-medium">
                  Preview ({shareOptions.format?.toUpperCase()})
                </span>
              </div>
              
              <div className="bg-black/30 border border-white/10 rounded-lg p-4 max-h-60 overflow-auto">
                <pre className="text-xs whitespace-pre-wrap font-mono text-slate-300">
                  {previewContent.substring(0, 1000)}
                  {previewContent.length > 1000 && '...'}
                </pre>
              </div>
              
              <p className="text-xs text-slate-400">
                This is how your note will appear when shared
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdvancedShareDialog;
