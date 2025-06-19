
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Zap, CheckCircle, AlertCircle, ExternalLink } from 'lucide-react';
import { createIonosDnsRecord, getIonosZones, getIonosDnsRecords } from '@/utils/ionosService';

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

      // Step 1: Check API access and find zone
      debug.push('🔍 Step 1: Checking IONOS DNS API access...');
      setDebugInfo([...debug]);

      const zones = await getIonosZones();
      debug.push(`✅ Successfully connected to IONOS API`);
      debug.push(`📋 Found ${zones.length} zones in your account`);
      
      // Log all available zones
      if (zones.length > 0) {
        debug.push(`🏷️  Available zones: ${zones.map(z => `${z.name} (${z.id})`).join(', ')}`);
      }
      
      const targetZone = zones.find(z => z.name === domain);
      if (!targetZone) {
        debug.push(`❌ Zone '${domain}' not found in your IONOS account`);
        debug.push(`💡 Please make sure the domain ${domain} is registered and configured in your IONOS account`);
        setDebugInfo([...debug]);
        throw new Error(`Zone ${domain} not found in your IONOS account. Available zones: ${zones.map(z => z.name).join(', ')}`);
      }

      debug.push(`✅ Found target zone: ${domain} (ID: ${targetZone.id}, Type: ${targetZone.type})`);
      setDebugInfo([...debug]);

      // Step 2: Check existing records
      debug.push('🔍 Step 2: Checking existing DNS records...');
      setDebugInfo([...debug]);

      const existingRecords = await getIonosDnsRecords(targetZone.id);
      debug.push(`📝 Found ${existingRecords.length} existing DNS records`);
      
      // Check for existing CNAME records
      const existingRoot = existingRecords.find(r => 
        r.type === 'CNAME' && (r.name === domain || r.name === '@')
      );
      const existingWww = existingRecords.find(r => 
        r.type === 'CNAME' && r.name === `www.${domain}`
      );
      
      if (existingRoot) {
        debug.push(`⚠️  Root CNAME already exists: ${existingRoot.name} → ${existingRoot.content}`);
      }
      if (existingWww) {
        debug.push(`⚠️  WWW CNAME already exists: ${existingWww.name} → ${existingWww.content}`);
      }
      
      setDebugInfo([...debug]);

      // Step 3: Create root domain CNAME record
      debug.push('🔧 Step 3: Creating root domain CNAME record...');
      setDebugInfo([...debug]);

      try {
        await createIonosDnsRecord({
          zoneId: targetZone.id,
          recordType: 'CNAME',
          name: domain,
          content: targetUrl,
          ttl: 3600
        });
        results.push('✅ Root domain CNAME record created successfully');
        debug.push(`✅ Root CNAME created: ${domain} → ${targetUrl}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.push(`❌ Root domain CNAME record failed: ${errorMsg}`);
        debug.push(`❌ Root CNAME failed: ${errorMsg}`);
        console.error('Root CNAME creation error:', error);
      }

      // Step 4: Create www subdomain CNAME record
      debug.push('🔧 Step 4: Creating www subdomain CNAME record...');
      setDebugInfo([...debug]);

      try {
        await createIonosDnsRecord({
          zoneId: targetZone.id,
          recordType: 'CNAME',
          name: `www.${domain}`,
          content: targetUrl,
          ttl: 3600
        });
        results.push('✅ WWW subdomain CNAME record created successfully');
        debug.push(`✅ WWW CNAME created: www.${domain} → ${targetUrl}`);
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        results.push(`❌ WWW subdomain CNAME record failed: ${errorMsg}`);
        debug.push(`❌ WWW CNAME failed: ${errorMsg}`);
        console.error('WWW CNAME creation error:', error);
      }

      debug.push('🎉 Setup process completed!');
      setSetupResults(results);
      setDebugInfo([...debug]);
      setSetupComplete(true);

      const successCount = results.filter(r => r.includes('✅')).length;
      const errorCount = results.filter(r => r.includes('❌')).length;

      toast({
        title: "DNS Setup Complete",
        description: `${successCount} records created successfully${errorCount > 0 ? `, ${errorCount} failed` : ''}`,
        variant: errorCount > 0 ? "destructive" : "default"
      });

    } catch (error) {
      console.error('Quick setup error:', error);
      const errorMessage = error instanceof Error ? error.message : "Failed to complete quick setup";
      
      setDebugInfo(prev => [...prev, `❌ Setup failed: ${errorMessage}`]);
      
      toast({
        title: "Setup Error",
        description: errorMessage,
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
                <li>• Find your onlinenote.ai zone in IONOS</li>
                <li>• Create CNAME record for {'"onlinenote.ai"'} → onai.lovable.app</li>
                <li>• Create CNAME record for {'"www.onlinenote.ai"'} → onai.lovable.app</li>
                <li>• Set TTL to 3600 seconds (1 hour)</li>
              </ul>
            </div>

            {debugInfo.length > 0 && (
              <div className="p-4 bg-black/20 border border-white/10 rounded-lg">
                <h4 className="text-white font-medium mb-2">Setup Progress:</h4>
                <div className="space-y-1 text-sm font-mono max-h-48 overflow-y-auto">
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
                <h4 className="text-white font-medium mb-2">Setup Log:</h4>
                <div className="space-y-1 text-sm font-mono max-h-48 overflow-y-auto">
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
                <div key={index} className={`text-sm p-2 rounded border-l-2 ${
                  result.includes('✅') 
                    ? 'bg-green-500/10 border-green-500/50 text-green-300' 
                    : 'bg-red-500/10 border-red-500/50 text-red-300'
                }`}>
                  {result}
                </div>
              ))}
            </div>

            <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
              <div className="flex items-start gap-2">
                <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-amber-400 text-sm font-medium">Next Steps</p>
                  <p className="text-amber-300 text-sm">
                    Check your IONOS DNS panel to verify the new records. DNS changes may take up to 24 hours to propagate globally, but are usually active within a few minutes.
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
