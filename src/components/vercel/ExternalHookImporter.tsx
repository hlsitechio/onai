
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useDeployHooks } from '@/hooks/useDeployHooks';
import { Download } from 'lucide-react';

interface ExternalHookImporterProps {
  isOpen: boolean;
  onClose: () => void;
}

const ExternalHookImporter: React.FC<ExternalHookImporterProps> = ({ isOpen, onClose }) => {
  const [vercelHookUrl, setVercelHookUrl] = useState('');
  const [hookName, setHookName] = useState('');
  const [isImporting, setIsImporting] = useState(false);
  const { createDeployHook } = useDeployHooks();
  const { toast } = useToast();

  const handleImport = async () => {
    if (!vercelHookUrl || !hookName) {
      toast({
        title: 'Missing fields',
        description: 'Please provide both hook URL and name',
        variant: 'destructive',
      });
      return;
    }

    // Validate Vercel hook URL format
    const vercelHookPattern = /^https:\/\/api\.vercel\.com\/v1\/integrations\/deploy\/[a-zA-Z0-9]+\/[a-zA-Z0-9]+$/;
    if (!vercelHookPattern.test(vercelHookUrl)) {
      toast({
        title: 'Invalid URL',
        description: 'Please provide a valid Vercel deploy hook URL',
        variant: 'destructive',
      });
      return;
    }

    setIsImporting(true);
    try {
      // Extract project ID from Vercel URL
      const urlParts = vercelHookUrl.split('/');
      const projectId = urlParts[urlParts.length - 2];

      await createDeployHook({
        hookName,
        vercelProjectId: projectId,
        branch: 'main',
      });

      toast({
        title: 'Hook Imported',
        description: `External deploy hook "${hookName}" has been successfully imported`,
      });

      setVercelHookUrl('');
      setHookName('');
      onClose();
    } catch (error) {
      console.error('Failed to import external hook:', error);
      toast({
        title: 'Import Failed',
        description: 'Failed to import the external deploy hook',
        variant: 'destructive',
      });
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Import External Deploy Hook</DialogTitle>
          <DialogDescription className="text-gray-400">
            Import an existing Vercel deploy hook URL to manage it through this interface
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hook-url" className="text-white">Vercel Deploy Hook URL</Label>
            <Input
              id="hook-url"
              placeholder="https://api.vercel.com/v1/integrations/deploy/..."
              value={vercelHookUrl}
              onChange={(e) => setVercelHookUrl(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="import-hook-name" className="text-white">Hook Name</Label>
            <Input
              id="import-hook-name"
              placeholder="e.g., Production Deploy"
              value={hookName}
              onChange={(e) => setHookName(e.target.value)}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={isImporting}
              className="bg-gradient-to-r from-noteflow-500 to-purple-500"
            >
              <Download className="w-4 h-4 mr-2" />
              Import Hook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ExternalHookImporter;
