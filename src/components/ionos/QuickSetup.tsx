
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { createIonosDnsRecord } from '@/utils/ionosService';

const QuickSetup = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupResults, setSetupResults] = useState<string[]>([]);
  const { toast } = useToast();

  const handleQuickSetup = async () => {
    setIsSettingUp(true);
    setSetupResults([]);
    
    try {
      const domain = 'onlinenote.ai';
      const targetUrl = 'onai.lovable.app';
      const results: string[] = [];

      // Create root domain CNAME record
      toast({
        title: "Setting up DNS...",
        description: "Creating CNAME record for root domain (@)",
      });

      try {
        await createIonosDnsRecord({
          domain,
          recordType: 'CNAME',
          name: '@',
          content: targetUrl,
          ttl: 3600
        });
        results.push('✅ Root domain (@) CNAME record created successfully');
      } catch (error) {
        console.error('Error creating root CNAME:', error);
        results.push('⚠️ Root domain (@) CNAME record may already exist or failed to create');
      }

      // Create www subdomain CNAME record
      toast({
        title: "Setting up DNS...",
        description: "Creating CNAME record for www subdomain",
      });

      try {
        await createIonosDnsRecord({
          domain,
          recordType: 'CNAME',
          name: 'www',
          content: targetUrl,
          ttl: 3600
        });
        results.push('✅ WWW subdomain CNAME record created successfully');
      } catch (error) {
        console.error('Error creating www CNAME:', error);
        results.push('⚠️ WWW subdomain CNAME record may already exist or failed to create');
      }

      setSetupResults(results);
      setSetupComplete(true);

      toast({
        title: "DNS Setup Complete!",
        description: "onlinenote.ai has been configured to point to your Lovable app",
      });

    } catch (error) {
      console.error('Quick setup error:', error);
      toast({
        title: "Setup Error",
        description: error instanceof Error ? error.message : "Failed to complete quick setup",
        variant: "destructive",
      });
    } finally {
      setIsSettingUp(false);
    }
  };

  return (
    <Card className="border-blue-500/20 bg-blue-500/5">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-blue-400">
          <Zap className="h-5 w-5" />
          Quick Setup for onlinenote.ai
        </CardTitle>
        <CardDescription className="text-gray-300">
          Automatically configure DNS records to make your site live
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!setupComplete ? (
          <div className="space-y-4">
            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h4 className="text-blue-400 font-medium mb-2">What this will do:</h4>
              <ul className="text-blue-300 text-sm space-y-1">
                <li>• Create CNAME record for @ (root domain) → onai.lovable.app</li>
                <li>• Create CNAME record for www → onai.lovable.app</li>
                <li>• Set TTL to 3600 seconds (1 hour)</li>
              </ul>
            </div>

            <Button 
              onClick={handleQuickSetup} 
              disabled={isSettingUp}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {isSettingUp ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  Setting up DNS records...
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Setup onlinenote.ai DNS Now
                </>
              )}
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-green-400">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium">Setup Complete!</span>
            </div>

            <div className="space-y-2">
              {setupResults.map((result, index) => (
                <div key={index} className="text-sm p-2 bg-black/20 rounded border-l-2 border-green-500/50">
                  {result}
                </div>
              ))}
            </div>

            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-green-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-green-400 text-sm font-medium">DNS Propagation</p>
                  <p className="text-green-300 text-sm">
                    DNS changes may take up to 24 hours to propagate globally. 
                    Your site should be accessible within a few minutes to a few hours.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={() => window.open('https://onlinenote.ai', '_blank')}
                variant="outline"
                className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Test onlinenote.ai
              </Button>
              <Button
                onClick={() => window.open('https://www.onlinenote.ai', '_blank')}
                variant="outline"
                className="flex-1 border-green-500/20 text-green-400 hover:bg-green-500/10"
              >
                <ExternalLink className="h-4 w-4 mr-2" />
                Test www.onlinenote.ai
              </Button>
            </div>

            <Button
              onClick={() => {
                setSetupComplete(false);
                setSetupResults([]);
              }}
              variant="ghost"
              className="w-full text-gray-400 hover:text-white"
            >
              Setup Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuickSetup;
