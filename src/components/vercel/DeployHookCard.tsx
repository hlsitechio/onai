
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Copy, Trash2, Power, PowerOff, Settings } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import WebhookTester from './WebhookTester';

interface DeployHookCardProps {
  hook: any;
  onDelete: (hookId: string) => void;
  onToggle: (hookId: string) => void;
  onConfigureCICD: (hook: any) => void;
}

const DeployHookCard: React.FC<DeployHookCardProps> = ({
  hook,
  onDelete,
  onToggle,
  onConfigureCICD,
}) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: `${label} has been copied to your clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-white flex items-center gap-2">
              {hook.hook_name}
              <Badge 
                variant="outline" 
                className={`${hook.is_active ? 'text-green-400 border-green-400' : 'text-red-400 border-red-400'}`}
              >
                {hook.is_active ? 'Active' : 'Inactive'}
              </Badge>
            </CardTitle>
            <CardDescription className="text-gray-400">
              Branch: {hook.branch} • Triggers: {hook.trigger_count}
              {hook.last_triggered_at && (
                <> • Last triggered: {new Date(hook.last_triggered_at).toLocaleString()}</>
              )}
            </CardDescription>
          </div>
          
          <div className="flex gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => onConfigureCICD(hook)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Settings className="w-4 h-4" />
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onToggle(hook.id)}
              className="border-white/20 text-white hover:bg-white/10"
            >
              {hook.is_active ? (
                <PowerOff className="w-4 h-4" />
              ) : (
                <Power className="w-4 h-4" />
              )}
            </Button>
            
            <Button
              size="sm"
              variant="outline"
              onClick={() => onDelete(hook.id)}
              className="border-red-400/20 text-red-400 hover:bg-red-400/10"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm text-gray-400">Webhook URL</Label>
          <div className="flex gap-2 mt-1">
            <Input
              readOnly
              value={hook.webhook_url}
              className="bg-white/5 border-white/10 text-white font-mono text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(hook.webhook_url, 'Webhook URL')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>
        
        <div>
          <Label className="text-sm text-gray-400">Webhook Secret</Label>
          <div className="flex gap-2 mt-1">
            <Input
              readOnly
              type="password"
              value={hook.webhook_secret}
              className="bg-white/5 border-white/10 text-white font-mono text-sm"
            />
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyToClipboard(hook.webhook_secret, 'Webhook Secret')}
              className="border-white/20 text-white hover:bg-white/10"
            >
              <Copy className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <WebhookTester 
          webhookUrl={hook.webhook_url}
          hookName={hook.hook_name}
        />
      </CardContent>
    </Card>
  );
};

export default DeployHookCard;
