
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Copy, Webhook, Globe, CheckCircle, ExternalLink } from 'lucide-react';

const DeploymentSettings = () => {
  const [webhookUrl, setWebhookUrl] = useState('');
  const { toast } = useToast();

  // Generate the webhook URL for this project
  React.useEffect(() => {
    const projectId = 'qrdulwzjgbfgaplazgsh'; // Your Supabase project ID
    const generatedWebhookUrl = `https://${projectId}.supabase.co/functions/v1/deployment-webhook`;
    setWebhookUrl(generatedWebhookUrl);
  }, []);

  const copyWebhookUrl = async () => {
    try {
      await navigator.clipboard.writeText(webhookUrl);
      toast({
        title: 'Webhook URL copied',
        description: 'The webhook URL has been copied to your clipboard',
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy webhook URL to clipboard',
        variant: 'destructive',
      });
    }
  };

  const testWebhook = async () => {
    try {
      const testPayload = {
        deployment_url: 'https://example.lovable.app',
        branch: 'main',
        commit: 'abc123',
        status: 'success',
        timestamp: new Date().toISOString()
      };

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testPayload),
      });

      if (response.ok) {
        toast({
          title: 'Webhook test successful',
          description: 'The deployment webhook is working correctly',
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Webhook test failed');
      }
    } catch (error) {
      console.error('Webhook test error:', error);
      toast({
        title: 'Webhook test failed',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">Deployment Automation</h3>
        <p className="text-sm text-gray-400">
          Automatically update your domain DNS when you publish your app
        </p>
      </div>

      {/* Webhook Configuration */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Webhook className="h-5 w-5" />
            Deployment Webhook
          </CardTitle>
          <CardDescription className="text-gray-400">
            Use this webhook URL in your deployment platform to automatically update DNS
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="webhook-url" className="text-white">Webhook URL</Label>
            <div className="flex gap-2">
              <Input
                id="webhook-url"
                value={webhookUrl}
                readOnly
                className="bg-black/60 border-white/10 text-gray-300"
              />
              <Button
                onClick={copyWebhookUrl}
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10"
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              onClick={testWebhook}
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10"
            >
              Test Webhook
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Domain Configuration */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white flex items-center gap-2">
            <Globe className="h-5 w-5" />
            Domain Configuration
          </CardTitle>
          <CardDescription className="text-gray-400">
            Current configuration for onlinenote.ai
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
              <div>
                <p className="text-white font-medium">Domain</p>
                <p className="text-sm text-gray-400">onlinenote.ai</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
            
            <div className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5">
              <div>
                <p className="text-white font-medium">Auto-update DNS</p>
                <p className="text-sm text-gray-400">CNAME record will be updated on deployment</p>
              </div>
              <CheckCircle className="w-5 h-5 text-green-400" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Integration Instructions */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Setup Instructions</CardTitle>
          <CardDescription className="text-gray-400">
            How to integrate with your deployment platform
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">For Lovable Projects:</h4>
              <ol className="text-sm text-blue-300 space-y-1 list-decimal list-inside">
                <li>Copy the webhook URL above</li>
                <li>Go to your project settings in Lovable</li>
                <li>Add the webhook URL to your deployment hooks</li>
                <li>Publish your project to test the integration</li>
              </ol>
            </div>

            <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
              <h4 className="text-green-400 font-medium mb-2">For Vercel/Netlify:</h4>
              <ol className="text-sm text-green-300 space-y-1 list-decimal list-inside">
                <li>Go to your project's webhook settings</li>
                <li>Add a new webhook with the URL above</li>
                <li>Set it to trigger on successful deployments</li>
                <li>Deploy your project to test</li>
              </ol>
            </div>

            <div className="p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
              <p className="text-purple-400 text-sm">
                <strong>Note:</strong> The webhook will automatically update your DNS to point to the new deployment URL when a successful deployment is detected.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeploymentSettings;
