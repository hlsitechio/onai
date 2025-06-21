
import React, { useState } from 'react';
import { Link, Link2Off, ExternalLink } from 'lucide-react';
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
import { cn } from '@/lib/utils';
import type { Editor } from '@tiptap/react';

interface LinkControlsProps {
  editor: Editor;
}

const LinkControls: React.FC<LinkControlsProps> = ({ editor }) => {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');
  const [linkText, setLinkText] = useState('');

  const isLinkActive = () => {
    return editor?.isActive('link') || false;
  };

  const insertLink = () => {
    if (!linkUrl) return;

    try {
      if (editor?.chain) {
        if (linkText) {
          editor.chain().focus().insertContent(`<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`).run();
        } else {
          editor.chain().focus().setLink({ href: linkUrl, target: '_blank' }).run();
        }
      } else {
        // Fallback: use document.execCommand
        const linkHtml = linkText 
          ? `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkText}</a>`
          : `<a href="${linkUrl}" target="_blank" rel="noopener noreferrer">${linkUrl}</a>`;
        document.execCommand('insertHTML', false, linkHtml);
      }
    } catch {
      document.execCommand('createLink', false, linkUrl);
    }

    setLinkUrl('');
    setLinkText('');
    setIsDialogOpen(false);
  };

  const removeLink = () => {
    try {
      if (editor?.chain) {
        editor.chain().focus().unsetLink().run();
      } else {
        document.execCommand('unlink', false);
      }
    } catch {
      document.execCommand('unlink', false);
    }
  };

  const openDialog = () => {
    // Pre-fill with selected text if available
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      setLinkText(selection.toString());
    }
    setIsDialogOpen(true);
  };

  return (
    <div className="flex items-center gap-1">
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button
            variant="ghost"
            size="sm"
            onClick={openDialog}
            className={cn(
              "h-8 w-8 p-0 hover:bg-white/10 transition-colors",
              isLinkActive() 
                ? "bg-white/20 text-white" 
                : "text-gray-300 hover:text-white"
            )}
            title="Insert Link"
          >
            <Link className="h-4 w-4" />
          </Button>
        </DialogTrigger>
        
        <DialogContent className="bg-[#27202C] border-white/10 text-white">
          <DialogHeader>
            <DialogTitle>Insert Link</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="linkUrl">URL</Label>
              <Input
                id="linkUrl"
                type="url"
                placeholder="https://example.com"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                className="bg-black/20 border-white/10 text-white"
              />
            </div>
            
            <div>
              <Label htmlFor="linkText">Link Text (optional)</Label>
              <Input
                id="linkText"
                type="text"
                placeholder="Link text"
                value={linkText}
                onChange={(e) => setLinkText(e.target.value)}
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
                onClick={insertLink}
                disabled={!linkUrl}
                className="bg-noteflow-500 hover:bg-noteflow-600"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Insert Link
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {isLinkActive() && (
        <Button
          variant="ghost"
          size="sm"
          onClick={removeLink}
          className="h-8 w-8 p-0 text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
          title="Remove Link"
        >
          <Link2Off className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default LinkControls;
