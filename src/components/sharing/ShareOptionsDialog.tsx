import React, { useState, useEffect } from 'react';
import { 
  shareNote, 
  ExportFormat, 
  ShareOptions 
} from '@/utils/storage/shareOperations';
import { 
  createEncryptedShareableLink,
  generateRandomPassword
} from '@/utils/storage/crossPlatformSharing';
import PairingCodeDialog from './PairingCodeDialog';
import Modal from 'react-modal';
import { toast } from 'sonner';
import { 
  Link, 
  Download, 
  Share2, 
  Mail, 
  QrCode, 
  Twitter, 
  Linkedin, 
  Copy, 
  FileDown,
  X,
  BookText,
  Code,
  FileCode,
  Printer,
  Lock,
  KeyRound,
  Smartphone,
  Loader2
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

// Ensure accessibility
if (typeof window !== 'undefined') {
  Modal.setAppElement('#root');
}

interface ShareOptionsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  noteContent: string;
  noteTitle?: string;
}

const ShareOptionsDialog: React.FC<ShareOptionsDialogProps> = ({
  isOpen,
  onClose,
  noteContent,
  noteTitle
}) => {
  const [activeTab, setActiveTab] = useState<string>('link');
  const [shareUrl, setShareUrl] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [isSharing, setIsSharing] = useState<boolean>(false);
  const [exportFormat, setExportFormat] = useState<ExportFormat>('md');
  const [expirationDays, setExpirationDays] = useState<number>(7);
  const [socialPlatform, setSocialPlatform] = useState<'twitter' | 'linkedin' | 'reddit'>('twitter');
  const [encryptionPassword, setEncryptionPassword] = useState<string>('');
  const [isPairingDialogOpen, setIsPairingDialogOpen] = useState<boolean>(false);
  const [pairingMode, setPairingMode] = useState<'share' | 'receive'>('share');

  // Scroll to top when modal opens
  useEffect(() => {
    if (isOpen) {
      window.scrollTo(0, 0);
    }
  }, [isOpen]);

  // Clear state when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setShareUrl('');
      setQrCodeUrl('');
      setIsSharing(false);
    }
  }, [isOpen]);

  // Generate link share
  const handleCreateLink = async () => {
    setIsSharing(true);
    
    try {
      const options: ShareOptions = {
        title: noteTitle,
        expirationDays,
        includeMetadata: true
      };
      
      const result = await shareNote(noteContent, 'server', options);
      
      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
        if (result.qrCode) {
          setQrCodeUrl(result.qrCode);
        }
        toast.success('Share link created!');
      } else {
        toast.error(result.error || 'Failed to create share link');
      }
    } catch (error) {
      console.error('Error creating share link:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsSharing(false);
    }
  };

  // Copy link to clipboard
  const handleCopyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      toast.success('Link copied to clipboard!');
    }
  };

  // Generate QR code
  const handleGenerateQRCode = async () => {
    setIsSharing(true);
    
    try {
      const options: ShareOptions = {
        title: noteTitle,
        expirationDays
      };
      
      const result = await shareNote(noteContent, 'qrcode', options);
      
      if (result.success && result.qrCode) {
        setQrCodeUrl(result.qrCode);
        if (result.shareUrl) {
          setShareUrl(result.shareUrl);
        }
        toast.success('QR code generated!');
      } else {
        toast.error(result.error || 'Failed to generate QR code');
      }
    } catch (error) {
      console.error('Error generating QR code:', error);
      toast.error('Failed to generate QR code');
    } finally {
      setIsSharing(false);
    }
  };

  // Export note as file
  const handleExport = async () => {
    setIsSharing(true);
    
    try {
      const options: ShareOptions = {
        format: exportFormat,
        title: noteTitle
      };
      
      const result = await shareNote(noteContent, 'download', options);
      
      if (result.success) {
        toast.success(`Note exported as ${exportFormat.toUpperCase()}!`);
      } else {
        toast.error(result.error || 'Failed to export note');
      }
    } catch (error) {
      console.error('Error exporting note:', error);
      toast.error('Failed to export note');
    } finally {
      setIsSharing(false);
    }
  };

  // Share via device sharing API
  const handleShareViaDevice = async () => {
    setIsSharing(true);
    
    try {
      const options: ShareOptions = {
        format: exportFormat,
        title: noteTitle
      };
      
      const result = await shareNote(noteContent, 'device', options);
      
      if (!result.success) {
        toast.error(result.error || 'Failed to share via device');
      }
    } catch (error) {
      console.error('Error sharing via device:', error);
      toast.error('Failed to share via device');
    } finally {
      setIsSharing(false);
    }
  };

  // Share via email
  const handleShareViaEmail = async () => {
    try {
      const result = await shareNote(noteContent, 'email', { title: noteTitle });
      
      if (!result.success) {
        toast.error(result.error || 'Failed to share via email');
      }
    } catch (error) {
      console.error('Error sharing via email:', error);
      toast.error('Failed to share via email');
    }
  };

  // Share to social media
  const handleShareToSocial = async () => {
    setIsSharing(true);
    
    try {
      const options: ShareOptions & { platform: typeof socialPlatform } = {
        title: noteTitle,
        platform: socialPlatform
      };
      
      const result = await shareNote(noteContent, 'social', options);
      
      if (!result.success) {
        toast.error(result.error || `Failed to share to ${socialPlatform}`);
      }
    } catch (error) {
      console.error('Error sharing to social media:', error);
      toast.error('Failed to share to social media');
    } finally {
      setIsSharing(false);
    }
  };

  // Get the title from the note content if not provided
  const derivedTitle = noteTitle || noteContent.split('\n')[0].replace(/^#+ /, '').substring(0, 50) || 'OneAI Note';

  // Generate secure encrypted link
  const handleCreateSecureLink = () => {
    setIsSharing(true);
    
    try {
      // Generate random password if not already generated
      const password = encryptionPassword || generateRandomPassword();
      setEncryptionPassword(password);
      
      const result = createEncryptedShareableLink(noteContent, derivedTitle, password);
      
      if (result.success && result.shareUrl) {
        setShareUrl(result.shareUrl);
        toast.success('Secure link created!');
      } else {
        toast.error(result.error || 'Failed to create secure link');
      }
    } catch (error) {
      console.error('Error creating secure link:', error);
      toast.error('Failed to create secure link');
    } finally {
      setIsSharing(false);
    }
  };

  // Open pairing code dialog
  const handleOpenPairingDialog = (mode: 'share' | 'receive') => {
    setPairingMode(mode);
    setIsPairingDialogOpen(true);
  };

  // Handle imported content from pairing code
  const handleImportFromPairing = (content: string, title: string) => {
    // This would typically update the editor content
    toast.success(`Note "${title}" imported successfully!`);
    // Implementation would depend on how you want to handle imported notes
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Share Options"
      className="fixed top-24 left-1/2 transform -translate-x-1/2 bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 w-full max-w-2xl max-h-[80vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/50"
      closeTimeoutMS={300}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Share "{derivedTitle}"</h2>
        <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
          <X className="h-5 w-5" />
        </Button>
      </div>
      
      <Tabs defaultValue="link" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid grid-cols-7 mb-6">
          <TabsTrigger value="link" className="flex items-center gap-2">
            <Link className="h-4 w-4" />
            Link
          </TabsTrigger>
          <TabsTrigger value="export" className="flex items-center gap-2">
            <FileDown className="h-4 w-4" />
            Export
          </TabsTrigger>
          <TabsTrigger value="device" className="flex items-center gap-2">
            <Share2 className="h-4 w-4" />
            Device
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Twitter className="h-4 w-4" />
            Social
          </TabsTrigger>
          <TabsTrigger value="qrcode" className="flex items-center gap-2">
            <QrCode className="h-4 w-4" />
            QR Code
          </TabsTrigger>
          <TabsTrigger value="secure" className="flex items-center gap-2">
            <Lock className="h-4 w-4" />
            Secure
          </TabsTrigger>
          <TabsTrigger value="pairing" className="flex items-center gap-2">
            <Smartphone className="h-4 w-4" />
            Pairing
          </TabsTrigger>
        </TabsList>
        
        {/* Link Sharing Tab */}
        <TabsContent value="link" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Create a shareable link that will be valid for a limited time. No login required to view.
            </p>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">Link expiration</label>
              <select
                value={expirationDays}
                onChange={(e) => setExpirationDays(Number(e.target.value))}
                className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value={1}>1 day</option>
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
              </select>
            </div>
            
            {!shareUrl ? (
              <Button 
                onClick={handleCreateLink} 
                disabled={isSharing}
                className="w-full"
              >
                {isSharing ? 'Creating link...' : 'Create Share Link'}
              </Button>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center">
                  <input
                    type="text"
                    value={shareUrl}
                    readOnly
                    className="flex-1 p-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700"
                  />
                  <Button 
                    onClick={handleCopyLink}
                    variant="secondary"
                    className="rounded-l-none"
                  >
                    <Copy className="h-4 w-4 mr-2" />
                    Copy
                  </Button>
                </div>
                
                <div className="flex flex-col items-center gap-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    This link will expire in {expirationDays} {expirationDays === 1 ? 'day' : 'days'}
                  </p>
                  
                  <div className="flex gap-2">
                    <Button 
                      onClick={() => {
                        setShareUrl('');
                        setQrCodeUrl('');
                      }}
                      variant="outline"
                      size="sm"
                    >
                      Create New Link
                    </Button>
                    
                    <Button
                      onClick={() => window.open(shareUrl, '_blank')}
                      variant="outline"
                      size="sm"
                    >
                      Test Link
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </TabsContent>
        
        {/* Export Tab */}
        <TabsContent value="export" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Export your note in various formats to use in other applications.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setExportFormat('md');
                  handleExport();
                }}
                className="flex flex-col items-center py-6"
              >
                <BookText className="h-8 w-8 mb-2" />
                <span>Markdown (.md)</span>
                <span className="text-xs text-gray-500 mt-1">Original format</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setExportFormat('txt');
                  handleExport();
                }}
                className="flex flex-col items-center py-6"
              >
                <FileCode className="h-8 w-8 mb-2" />
                <span>Plain Text (.txt)</span>
                <span className="text-xs text-gray-500 mt-1">Universal format</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setExportFormat('html');
                  handleExport();
                }}
                className="flex flex-col items-center py-6"
              >
                <Code className="h-8 w-8 mb-2" />
                <span>HTML (.html)</span>
                <span className="text-xs text-gray-500 mt-1">Web-ready format</span>
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setExportFormat('pdf');
                  handleExport();
                }}
                className="flex flex-col items-center py-6"
              >
                <Printer className="h-8 w-8 mb-2" />
                <span>PDF (.pdf)</span>
                <span className="text-xs text-gray-500 mt-1">Print-ready format</span>
              </Button>
            </div>
          </div>
        </TabsContent>
        
        {/* Device Sharing Tab */}
        <TabsContent value="device" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share this note using your device's native sharing capabilities.
            </p>
            
            <div className="grid grid-cols-2 gap-4">
              <Button
                variant="outline"
                onClick={() => {
                  setExportFormat('txt');
                  handleShareViaDevice();
                }}
                className="flex items-center justify-center gap-2 py-3"
              >
                <Share2 className="h-5 w-5" />
                Share as Text
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  setExportFormat('md');
                  handleShareViaDevice();
                }}
                className="flex items-center justify-center gap-2 py-3"
              >
                <Share2 className="h-5 w-5" />
                Share as Markdown
              </Button>
            </div>
            
            <Button
              variant="default"
              onClick={handleShareViaEmail}
              className="w-full flex items-center justify-center gap-2"
            >
              <Mail className="h-5 w-5" />
              Share via Email
            </Button>
          </div>
        </TabsContent>
        
        {/* Social Media Tab */}
        <TabsContent value="social" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share your note on social media platforms.
            </p>
            
            <div className="grid grid-cols-3 gap-4">
              <Button
                variant={socialPlatform === 'twitter' ? 'default' : 'outline'}
                onClick={() => setSocialPlatform('twitter')}
                className="flex flex-col items-center py-4"
              >
                <Twitter className="h-6 w-6 mb-2" />
                <span>Twitter</span>
              </Button>
              
              <Button
                variant={socialPlatform === 'linkedin' ? 'default' : 'outline'}
                onClick={() => setSocialPlatform('linkedin')}
                className="flex flex-col items-center py-4"
              >
                <Linkedin className="h-6 w-6 mb-2" />
                <span>LinkedIn</span>
              </Button>
              
              <Button
                variant={socialPlatform === 'reddit' ? 'default' : 'outline'}
                onClick={() => setSocialPlatform('reddit')}
                className="flex flex-col items-center py-4"
              >
                <div className="h-6 w-6 mb-2 flex items-center justify-center font-bold text-xl">R</div>
                <span>Reddit</span>
              </Button>
            </div>
            
            <Button
              onClick={handleShareToSocial}
              disabled={isSharing}
              className="w-full"
            >
              {isSharing ? 'Sharing...' : `Share to ${socialPlatform}`}
            </Button>
          </div>
        </TabsContent>
        
        {/* QR Code Tab */}
        <TabsContent value="qrcode" className="space-y-4">
          <div className="flex flex-col space-y-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Generate a QR code for your note that can be scanned to access the content.
            </p>
            
            <div className="flex flex-col space-y-2">
              <label className="text-sm font-medium">QR Code expiration</label>
              <select
                value={expirationDays}
                onChange={(e) => setExpirationDays(Number(e.target.value))}
                className="p-2 border rounded-md dark:bg-gray-800 dark:border-gray-700"
              >
                <option value={7}>7 days</option>
                <option value={30}>30 days</option>
                <option value={90}>90 days</option>
                <option value={365}>1 year</option>
              </select>
            </div>
            
            {!qrCodeUrl ? (
              <Button 
                onClick={handleGenerateQRCode} 
                disabled={isSharing}
                className="w-full"
              >
                {isSharing ? 'Generating QR Code...' : 'Generate QR Code'}
              </Button>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <div className="bg-white p-4 rounded-lg">
                  <img
                    src={qrCodeUrl}
                    alt="QR Code for Note"
                    className="w-48 h-48"
                  />
                </div>
                
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  This QR code will expire in {expirationDays} {expirationDays === 1 ? 'day' : 'days'}
                </p>
                
                <div className="flex gap-2">
                  <Button 
                    onClick={() => {
                      const link = document.createElement('a');
                      link.href = qrCodeUrl;
                      link.download = `oneai-note-qrcode.png`;
                      document.body.appendChild(link);
                      link.click();
                      document.body.removeChild(link);
                    }}
                    variant="outline"
                    size="sm"
                  >
                    <FileDown className="h-4 w-4 mr-2" />
                    Download QR Code
                  </Button>
                  
                  <Button
                    onClick={() => {
                      setQrCodeUrl('');
                    }}
                    variant="outline"
                    size="sm"
                  >
                    Generate New QR Code
                  </Button>
                </div>
                
                {shareUrl && (
                  <div className="mt-2 flex flex-col items-center gap-2">
                    <p className="text-sm font-medium">Share link directly:</p>
                    <div className="flex w-full">
                      <input
                        type="text"
                        value={shareUrl}
                        readOnly
                        className="flex-1 p-2 border rounded-l-md dark:bg-gray-800 dark:border-gray-700 text-sm"
                      />
                      <Button 
                        onClick={handleCopyLink}
                        variant="secondary"
                        className="rounded-l-none"
                        size="sm"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
      {/* Pairing Code Dialog */}
      <PairingCodeDialog
        isOpen={isPairingDialogOpen}
        onOpenChange={setIsPairingDialogOpen}
        content={noteContent}
        title={derivedTitle}
        onImportContent={handleImportFromPairing}
        mode={pairingMode}
      />
    </Modal>
  );
};

export default ShareOptionsDialog;
