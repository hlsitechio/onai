import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { generatePairingCode, retrieveContentFromPairingCode } from '@/utils/storage/crossPlatformSharing';
import { Loader2, Clipboard, RefreshCw, Clock } from 'lucide-react';

interface PairingCodeDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  content: string;
  title: string;
  onImportContent?: (content: string, title: string) => void;
  mode: 'share' | 'receive';
}

const PairingCodeDialog: React.FC<PairingCodeDialogProps> = ({
  isOpen,
  onOpenChange,
  content,
  title,
  onImportContent,
  mode = 'share'
}) => {
  const [pairingCode, setPairingCode] = useState('');
  const [inputCode, setInputCode] = useState('');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [expiryMinutes, setExpiryMinutes] = useState(30);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isRetrieving, setIsRetrieving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { toast } = useToast();

  // Format time remaining until expiration
  const formatTimeRemaining = () => {
    if (!expiresAt) return 'N/A';
    
    const now = new Date();
    const diff = expiresAt.getTime() - now.getTime();
    
    if (diff <= 0) return 'Expired';
    
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    return `${minutes}m ${seconds}s`;
  };

  // Generate a new pairing code
  const handleGenerateCode = () => {
    setIsGenerating(true);
    setError('');
    setSuccess('');
    
    try {
      const result = generatePairingCode(content, title, expiryMinutes);
      
      if (result.success && result.pairingCode) {
        setPairingCode(result.pairingCode);
        setExpiresAt(result.expiresAt || null);
        setSuccess(`Pairing code generated! Valid for ${expiryMinutes} minutes.`);
      } else {
        setError(result.error || 'Failed to generate pairing code');
      }
    } catch (err) {
      console.error('Error generating pairing code:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  // Retrieve content using a pairing code
  const handleRetrieveContent = () => {
    if (!inputCode || inputCode.length !== 6) {
      setError('Please enter a valid 6-digit pairing code');
      return;
    }
    
    setIsRetrieving(true);
    setError('');
    setSuccess('');
    
    try {
      const result = retrieveContentFromPairingCode(inputCode);
      
      if (result.success && result.content) {
        setSuccess('Note retrieved successfully!');
        
        if (onImportContent) {
          onImportContent(result.content, result.title || 'Imported Note');
          
          // Close dialog after successful import
          setTimeout(() => {
            onOpenChange(false);
          }, 1500);
        }
      } else {
        setError(result.error || 'Failed to retrieve note');
      }
    } catch (err) {
      console.error('Error retrieving content:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsRetrieving(false);
    }
  };

  // Copy pairing code to clipboard
  const handleCopyCode = () => {
    navigator.clipboard.writeText(pairingCode);
    toast({
      title: 'Pairing code copied',
      description: 'The code has been copied to your clipboard',
    });
  };

  // Reset dialog state when closed
  const handleOpenChange = (open: boolean) => {
    if (!open) {
      setPairingCode('');
      setInputCode('');
      setExpiresAt(null);
      setError('');
      setSuccess('');
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md bg-[#03010a] border border-white/5 text-white">
        <DialogHeader>
          <DialogTitle>
            {mode === 'share' ? 'Share with Pairing Code' : 'Receive with Pairing Code'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'share' 
              ? 'Generate a temporary code to share your note with another device'
              : 'Enter a pairing code to receive a note from another device'
            }
          </DialogDescription>
        </DialogHeader>

        {mode === 'share' ? (
          <div className="space-y-4">
            {!pairingCode ? (
              <div className="space-y-3">
                <div className="grid grid-cols-4 gap-2 items-center">
                  <Label htmlFor="expiryMinutes" className="col-span-2">
                    Expires after (minutes):
                  </Label>
                  <Input
                    id="expiryMinutes"
                    type="number"
                    min="1"
                    max="1440"
                    value={expiryMinutes}
                    onChange={(e) => setExpiryMinutes(Math.max(1, Math.min(1440, parseInt(e.target.value) || 30)))}
                    className="col-span-2 bg-[#0c071e] border-white/10"
                  />
                </div>
                <Button 
                  onClick={handleGenerateCode} 
                  disabled={isGenerating}
                  className="w-full"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </>
                  ) : 'Generate Pairing Code'}
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="text-3xl font-bold tracking-wider border border-white/10 bg-[#0c071e] rounded-md px-8 py-4 w-full text-center">
                    {pairingCode}
                  </div>
                  <div className="flex items-center gap-1 text-sm">
                    <Clock className="h-4 w-4" />
                    <span>Expires in: {formatTimeRemaining()}</span>
                  </div>
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="secondary" 
                    onClick={handleCopyCode}
                    className="flex-1"
                  >
                    <Clipboard className="mr-2 h-4 w-4" />
                    Copy Code
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleGenerateCode}
                    disabled={isGenerating}
                  >
                    <RefreshCw className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="pairingCode">Enter 6-digit pairing code:</Label>
              <Input
                id="pairingCode"
                placeholder="e.g. 123456"
                value={inputCode}
                onChange={(e) => {
                  // Only allow digits and limit to 6 characters
                  const value = e.target.value.replace(/\D/g, '').substring(0, 6);
                  setInputCode(value);
                }}
                className="text-lg tracking-wider text-center bg-[#0c071e] border-white/10"
              />
            </div>
            
            <Button 
              onClick={handleRetrieveContent} 
              disabled={isRetrieving || inputCode.length !== 6}
              className="w-full"
            >
              {isRetrieving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Retrieving...
                </>
              ) : 'Retrieve Note'}
            </Button>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
        
        {success && (
          <div className="text-green-500 text-sm">{success}</div>
        )}

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="secondary"
            onClick={() => handleOpenChange(false)}
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default PairingCodeDialog;
