import React, { useState, useEffect, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { extractAndDecryptContent } from '@/utils/storage/crossPlatformSharing';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import EditableContent from '@/components/EditableContent';

const SecureNoteViewer: React.FC = () => {
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [title, setTitle] = useState('');
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDecrypted, setIsDecrypted] = useState(false);
  const [error, setError] = useState('');
  const { toast } = useToast();

  const handleDecrypt = useCallback(async (passToUse = password, hashToUse = window.location.hash) => {
    if (!hashToUse) {
      setError('No encrypted content found in URL');
      return;
    }

    if (!passToUse) {
      setError('Please enter the decryption key');
      return;
    }

    setIsDecrypting(true);
    setError('');

    try {
      const result = extractAndDecryptContent(hashToUse, passToUse);
      
      if (result && result.content) {
        setContent(result.content);
        setTitle(result.title || 'Shared Note');
        setIsDecrypted(true);
        
        // Update the URL to remove the password if it was in the query params
        if (window.location.search.includes('key=')) {
          const newUrl = window.location.pathname + window.location.hash;
          window.history.replaceState({}, document.title, newUrl);
        }
      } else {
        setError('Unable to decrypt content. The key might be incorrect.');
      }
    } catch (err) {
      console.error('Decryption error:', err);
      setError('Decryption failed. Please check the key and try again.');
    } finally {
      setIsDecrypting(false);
    }
  }, [password]);

  useEffect(() => {
    // Check if URL fragment exists and if it has a password query param
    const hash = window.location.hash;
    const searchParams = new URLSearchParams(window.location.search);
    const urlPassword = searchParams.get('key');
    
    if (hash && urlPassword) {
      // Auto-decrypt if both hash and password are provided
      setPassword(urlPassword);
      handleDecrypt(urlPassword, hash);
    }
  }, [handleDecrypt]);

  const handleCopyContent = () => {
    navigator.clipboard.writeText(content);
    toast({
      title: "Content copied",
      description: "Note content has been copied to clipboard",
    });
  };

  const handleSaveAsFile = () => {
    const blob = new Blob([content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'shared-note'}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleOpenInOneAI = () => {
    // Create a temporary storage item and redirect to main app
    const tempKey = `oneai-temp-import-${Date.now()}`;
    localStorage.setItem(tempKey, JSON.stringify({ content, title }));
    window.location.href = `/${tempKey}`;
  };

  if (isDecrypted) {
    return (
      <div className="container max-w-4xl mx-auto p-4 space-y-6">
        <Card className="border border-white/5 bg-[#03010a] shadow-lg">
          <CardHeader>
            <CardTitle className="text-xl font-bold text-white">
              {title || 'Shared Note'}
            </CardTitle>
            <CardDescription>
              This is a securely shared note. Only those with the decryption key can view it.
            </CardDescription>
          </CardHeader>
          <CardContent className="min-h-[300px] max-h-[600px] overflow-y-auto border border-white/10 rounded-md p-4 bg-[#0c071e]">
            <EditableContent
              content={content}
              setContent={() => {}} // Read-only mode by using empty function
              isFocusMode={false}
            />
          </CardContent>
          <CardFooter className="flex justify-between flex-wrap gap-2">
            <div>
              <Button 
                variant="secondary" 
                onClick={handleCopyContent}
                className="mr-2"
              >
                Copy to Clipboard
              </Button>
              <Button 
                variant="outline" 
                onClick={handleSaveAsFile}
              >
                Save as File
              </Button>
            </div>
            <Button onClick={handleOpenInOneAI}>
              Open in OneAI
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-md mx-auto mt-20 p-4">
      <Card className="border border-white/5 bg-[#03010a] shadow-lg">
        <CardHeader>
          <CardTitle className="text-xl font-bold text-white">
            Secure Note Viewer
          </CardTitle>
          <CardDescription>
            Enter the decryption key to view this shared note
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              type="password"
              placeholder="Enter decryption key"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="bg-[#0c071e] border-white/10"
            />
            {error && (
              <p className="text-sm text-red-500">{error}</p>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            onClick={() => handleDecrypt()}
            disabled={isDecrypting}
            className="w-full"
          >
            {isDecrypting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Decrypting...
              </>
            ) : 'Decrypt Note'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default SecureNoteViewer;
