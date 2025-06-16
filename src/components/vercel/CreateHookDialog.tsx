
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CreateHookDialogProps {
  projects: any[];
  onCreateHook: (hookData: any) => Promise<void>;
  isLoading: boolean;
}

const CreateHookDialog: React.FC<CreateHookDialogProps> = ({
  projects,
  onCreateHook,
  isLoading,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newHook, setNewHook] = useState({
    hookName: '',
    vercelProjectId: '',
    branch: 'main',
  });
  const { toast } = useToast();

  const handleCreateHook = async () => {
    if (!newHook.hookName || !newHook.vercelProjectId) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      await onCreateHook(newHook);
      setIsOpen(false);
      setNewHook({ hookName: '', vercelProjectId: '', branch: 'main' });
    } catch (error) {
      console.error('Failed to create deploy hook:', error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-gradient-to-r from-noteflow-500 to-purple-500">
          <Plus className="w-4 h-4 mr-2" />
          Create Hook
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-black/90 border-white/10">
        <DialogHeader>
          <DialogTitle className="text-white">Create Deploy Hook</DialogTitle>
          <DialogDescription className="text-gray-400">
            Create a webhook that can trigger deployments for your Vercel project
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="hook-name" className="text-white">Hook Name</Label>
            <Input
              id="hook-name"
              placeholder="e.g., Production Deploy"
              value={newHook.hookName}
              onChange={(e) => setNewHook(prev => ({ ...prev, hookName: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="project" className="text-white">Vercel Project</Label>
            <Select onValueChange={(value) => setNewHook(prev => ({ ...prev, vercelProjectId: value }))}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white">
                <SelectValue placeholder="Select a project" />
              </SelectTrigger>
              <SelectContent>
                {projects.map((project) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="branch" className="text-white">Branch</Label>
            <Input
              id="branch"
              placeholder="main"
              value={newHook.branch}
              onChange={(e) => setNewHook(prev => ({ ...prev, branch: e.target.value }))}
              className="bg-white/5 border-white/10 text-white"
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button
              variant="outline"
              onClick={() => setIsOpen(false)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              Cancel
            </Button>
            <Button
              onClick={handleCreateHook}
              disabled={isLoading}
              className="bg-gradient-to-r from-noteflow-500 to-purple-500"
            >
              Create Hook
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CreateHookDialog;
