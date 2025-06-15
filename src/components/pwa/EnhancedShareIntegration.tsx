
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { 
  Share, 
  Copy, 
  Mail, 
  MessageSquare, 
  Twitter, 
  Facebook, 
  Linkedin,
  Download,
  QrCode
} from 'lucide-react';

interface ShareData {
  title: string;
  text: string;
  url: string;
}

const EnhancedShareIntegration: React.FC = () => {
  const [shareData, setShareData] = useState<ShareData>({
    title: 'OneAI Notes',
    text: 'Check out this amazing note-taking app with AI features!',
    url: window.location.href
  });

  const [customMessage, setCustomMessage] = useState('');
  const [shareHistory, setShareHistory] = useState<Array<{
    platform: string;
    timestamp: number;
    success: boolean;
  }>>([]);

  // Check if Web Share API is supported
  const isWebShareSupported = 'share' in navigator;

  const handleNativeShare = async () => {
    if (!isWebShareSupported) {
      toast.error('Web Share API not supported in this browser');
      return;
    }

    try {
      await navigator.share(shareData);
      recordShare('native', true);
      toast.success('Content shared successfully');
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        recordShare('native', false);
        toast.error('Failed to share content');
      }
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      const shareText = `${shareData.title}\n${shareData.text}\n${shareData.url}`;
      await navigator.clipboard.writeText(shareText);
      recordShare('clipboard', true);
      toast.success('Copied to clipboard');
    } catch (error) {
      recordShare('clipboard', false);
      toast.error('Failed to copy to clipboard');
    }
  };

  const handleEmailShare = () => {
    const subject = encodeURIComponent(shareData.title);
    const body = encodeURIComponent(`${shareData.text}\n\n${shareData.url}`);
    const mailtoUrl = `mailto:?subject=${subject}&body=${body}`;
    
    window.open(mailtoUrl, '_blank');
    recordShare('email', true);
  };

  const handleSocialShare = (platform: string) => {
    let shareUrl = '';
    const encodedUrl = encodeURIComponent(shareData.url);
    const encodedText = encodeURIComponent(shareData.text);
    const encodedTitle = encodeURIComponent(shareData.title);

    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodedText}&url=${encodedUrl}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodedText}%20${encodedUrl}`;
        break;
      case 'telegram':
        shareUrl = `https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`;
        break;
      default:
        return;
    }

    window.open(shareUrl, '_blank', 'width=600,height=400');
    recordShare(platform, true);
  };

  const generateQRCode = async () => {
    try {
      // Using a QR code API service
      const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(shareData.url)}`;
      
      // Create a download link
      const link = document.createElement('a');
      link.href = qrUrl;
      link.download = 'qr-code.png';
      link.click();
      
      recordShare('qr_code', true);
      toast.success('QR code downloaded');
    } catch (error) {
      recordShare('qr_code', false);
      toast.error('Failed to generate QR code');
    }
  };

  const recordShare = (platform: string, success: boolean) => {
    const record = {
      platform,
      timestamp: Date.now(),
      success
    };
    
    setShareHistory(prev => [record, ...prev.slice(0, 9)]); // Keep last 10 records
    
    // Store in localStorage for persistence
    const history = JSON.parse(localStorage.getItem('share-history') || '[]');
    history.unshift(record);
    localStorage.setItem('share-history', JSON.stringify(history.slice(0, 50)));
  };

  const handleFileShare = () => {
    const content = `${shareData.title}\n\n${shareData.text}\n\n${shareData.url}`;
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = 'shared-content.txt';
    link.click();
    
    URL.revokeObjectURL(url);
    recordShare('file', true);
    toast.success('Content saved as file');
  };

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Share className="h-5 w-5" />
          Enhanced Share Integration
        </CardTitle>
        <CardDescription>
          Share your content across multiple platforms and formats
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Share Content Configuration */}
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Title</label>
            <Input
              value={shareData.title}
              onChange={(e) => setShareData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Content title"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Description</label>
            <Textarea
              value={shareData.text}
              onChange={(e) => setShareData(prev => ({ ...prev, text: e.target.value }))}
              placeholder="Content description"
              rows={3}
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">URL</label>
            <Input
              value={shareData.url}
              onChange={(e) => setShareData(prev => ({ ...prev, url: e.target.value }))}
              placeholder="Content URL"
            />
          </div>
        </div>

        {/* Native Share */}
        {isWebShareSupported && (
          <div className="space-y-2">
            <h4 className="font-medium">Native Share</h4>
            <Button onClick={handleNativeShare} className="w-full">
              <Share className="h-4 w-4 mr-2" />
              Share via System
            </Button>
          </div>
        )}

        {/* Quick Actions */}
        <div className="space-y-2">
          <h4 className="font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={handleCopyToClipboard} variant="outline" size="sm">
              <Copy className="h-4 w-4 mr-2" />
              Copy Link
            </Button>
            
            <Button onClick={handleEmailShare} variant="outline" size="sm">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            
            <Button onClick={generateQRCode} variant="outline" size="sm">
              <QrCode className="h-4 w-4 mr-2" />
              QR Code
            </Button>
            
            <Button onClick={handleFileShare} variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Save File
            </Button>
          </div>
        </div>

        {/* Social Media Sharing */}
        <div className="space-y-2">
          <h4 className="font-medium">Social Media</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button 
              onClick={() => handleSocialShare('twitter')} 
              variant="outline" 
              size="sm"
              className="text-blue-500"
            >
              <Twitter className="h-4 w-4 mr-2" />
              Twitter
            </Button>
            
            <Button 
              onClick={() => handleSocialShare('facebook')} 
              variant="outline" 
              size="sm"
              className="text-blue-600"
            >
              <Facebook className="h-4 w-4 mr-2" />
              Facebook
            </Button>
            
            <Button 
              onClick={() => handleSocialShare('linkedin')} 
              variant="outline" 
              size="sm"
              className="text-blue-700"
            >
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
            
            <Button 
              onClick={() => handleSocialShare('whatsapp')} 
              variant="outline" 
              size="sm"
              className="text-green-600"
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              WhatsApp
            </Button>
          </div>
        </div>

        {/* Share History */}
        {shareHistory.length > 0 && (
          <div className="space-y-2">
            <h4 className="font-medium">Recent Shares</h4>
            <div className="space-y-1">
              {shareHistory.slice(0, 5).map((record, index) => (
                <div key={index} className="flex items-center justify-between p-2 bg-muted/30 rounded">
                  <span className="text-sm capitalize">{record.platform.replace('_', ' ')}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant={record.success ? 'default' : 'destructive'}>
                      {record.success ? 'Success' : 'Failed'}
                    </Badge>
                    <span className="text-xs text-muted-foreground">
                      {new Date(record.timestamp).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedShareIntegration;
