
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { createIonosDnsRecord, getIonosDomains, getIonosDnsRecords } from '@/utils/ionosService';

const QuickSetup = () => {
  const [isSettingUp, setIsSettingUp] = useState(false);
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupResults, setSetupResults] = useState<string[]>([]);
  const [debugInfo, setDebugInfo] = useState<string[]>([]);
  const { toast } = useToast();

  const handleQuickSetup = async () => {
    setIsSettingUp(true);
    setSetupResults([]);
    setDebugInfo([]);
    
    try {
      const domain = 'onlinenote.ai';
      const targetUrl = 'onai.lovable.app';
      const results: string[] = [];
      const debug: string[] = [];

      // First, check if we can access domains
      debug.push('🔍 Checking IONOS API access...');
      setDebugInfo([...debug]);

      try {
        const domains = await getIonosDomains();
        debug.push(`✅ Found ${domains.length} domains in your account`);
        
        const targetDomain = domains.find(d => d.name === domain);
        if (targetDomain) {
          debug.push(`✅ Found domain: ${domain} (Status: ${targetDomain.status})`);
        } else {
          debug.push(`⚠️ Domain ${domain} not found in your account`);
          debug.push(`Available domains: ${domains.map(d => d.name).join(', ')}`);
        }
        setDebugInfo([...debug]);
      } catch (error) {
        debug.push(`❌ Failed to fetch domains: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setDebugInfo([...debug]);
        throw error;
      }

      // Check existing DNS records
      debug.push('🔍 Checking existing DNS records...');
      setDebugInfo([...debug]);

      try {
        const existingRecords = await getIonosDnsRecords(domain);
        debug.push(`✅ Found ${existingRecords.length} existing DNS records`);
        
        const existingRoot = existingRecords.find(r => r.type === 'CNAME' && r.name === '@');
        const existingWww = existingRecords.find(r => r.type === 'CNAME' && r.name === 'www');
        
        if (existingRoot) {
          debug.push(`⚠️ Root CNAME already exists: ${existingRoot.content}`);
        }
        if (existingWww) {
          debug.push(`⚠️ WWW CNAME already exists: ${existingWww.content}`);
        }
        
        setDebugInfo([...debug]);
      } catch (error) {
        debug.push(`❌ Failed to fetch DNS records: ${error instanceof Error ? error.message : 'Unknown error'}`);
        setDebugInfo([...debug]);
      }

      // Create root domain CNAME record
      toast({
        title: "Setting up DNS...",
        description: "Creating CNAME record for root domain (@)",
      });

      debug.push('🔧 Creating root domain CNAME record...');
      setDebugInfo([...debug]);

      try {
        await createIonosDnsRecord({
          domain,
          recordType: 'CNAME',
          name: '@',
          content: targetUrl,
          ttl: 3600
        });
        results.push('✅ Root domain (@) CNAME record created successfully');
        debug.push('✅ Root CNAME record created');
      } catch (error) {
        console.error('Error creating root CNAME:', error);
        results.push(`⚠️ Root domain (@) CNAME record failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        debug.push(`❌ Root CNAME failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      // Create www subdomain CNAME record
      toast({
        title: "Setting up DNS...",
        description: "Creating CNAME record for www subdomain",
      });

      debug.push('🔧 Creating www subdomain CNAME record...');
      setDebugInfo([...debug]);

      try {
        await createIonosDnsRecord({
          domain,
          recordType: 'CNAME',
          name: 'www',
          content: targetUrl,
          ttl: 3600
        });
        results.push('✅ WWW subdomain CNAME record created successfully');
        debug.push('✅ WWW CNAME record created');
      } catch (error) {
        console.error('Error creating www CNAME:', error);
        results.push(`⚠️ WWW subdomain CNAME record failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        debug.push(`❌ WWW CNAME failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      }

      setSetupResults(results);
      setDebugInfo([...debug]);
      setSetupComplete(true);

      toast({
        title: "DNS Setup Process Complete",
        description: "Check the results below for details",
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

            {debugInfo.length > 0 && (
              <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
                <h4 className="text-white font-medium mb-2">Debug Information:</h4>
                <div className="space-y-1 text-sm font-mono">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="text-gray-300">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
              <span className="font-medium">Setup Process Complete!</span>
            </div>

            {debugInfo.length > 0 && (
              <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
                <h4 className="text-white font-medium mb-2">Debug Information:</h4>
                <div className="space-y-1 text-sm font-mono max-h-32 overflow-y-auto">
                  {debugInfo.map((info, index) => (
                    <div key={index} className="text-gray-300">
                      {info}
                    </div>
                  ))}
                </div>
              </div>
            )}

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
                  <p className="text-green-400 text-sm font-medium">Next Steps</p>
                  <p className="text-green-300 text-sm">
                    Check your IONOS DNS panel for the new records. DNS changes may take up to 24 hours to propagate globally.
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
                setDebugInfo([]);
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
