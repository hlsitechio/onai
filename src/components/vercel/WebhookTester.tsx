
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { PlayCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

interface WebhookTesterProps {
  webhookUrl: string;
  hookName: string;
  onTestComplete?: (success: boolean, responseTime: number) => void;
}

const WebhookTester: React.FC<WebhookTesterProps> = ({ 
  webhookUrl, 
  hookName, 
  onTestComplete 
}) => {
  const [isTestingWebhook, setIsTestingWebhook] = useState(false);
  const [lastTestResult, setLastTestResult] = useState<{
    success: boolean;
    responseTime: number;
    timestamp: Date;
  } | null>(null);
  const { toast } = useToast();

  const testWebhook = async () => {
    setIsTestingWebhook(true);
    const startTime = Date.now();

    try {
      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          test: true,
          timestamp: new Date().toISOString(),
          source: 'webhook-tester',
        }),
      });

      const responseTime = Date.now() - startTime;
      const success = response.ok;

      setLastTestResult({
        success,
        responseTime,
        timestamp: new Date(),
      });

      onTestComplete?.(success, responseTime);

      toast({
        title: success ? 'Webhook Test Successful' : 'Webhook Test Failed',
        description: success 
          ? `Hook responded in ${responseTime}ms` 
          : `Hook failed with status ${response.status}`,
        variant: success ? 'default' : 'destructive',
      });
    } catch (error) {
      const responseTime = Date.now() - startTime;
      setLastTestResult({
        success: false,
        responseTime,
        timestamp: new Date(),
      });

      onTestComplete?.(false, responseTime);

      toast({
        title: 'Webhook Test Failed',
        description: 'Failed to reach the webhook endpoint',
        variant: 'destructive',
      });
    } finally {
      setIsTestingWebhook(false);
    }
  };

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white text-sm">Webhook Testing</CardTitle>
        <CardDescription className="text-gray-400 text-xs">
          Test the webhook endpoint for {hookName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <Button
          onClick={testWebhook}
          disabled={isTestingWebhook}
          variant="outline"
          size="sm"
          className="w-full border-white/20 text-white hover:bg-white/10"
        >
          {isTestingWebhook ? (
            <Clock className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <PlayCircle className="w-4 h-4 mr-2" />
          )}
          {isTestingWebhook ? 'Testing...' : 'Test Webhook'}
        </Button>

        {lastTestResult && (
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              {lastTestResult.success ? (
                <CheckCircle className="w-3 h-3 text-green-400" />
              ) : (
                <XCircle className="w-3 h-3 text-red-400" />
              )}
              <span className="text-gray-400">
                Last test: {lastTestResult.timestamp.toLocaleTimeString()}
              </span>
            </div>
            <Badge 
              variant="outline" 
              className={`text-xs ${
                lastTestResult.success 
                  ? 'text-green-400 border-green-400' 
                  : 'text-red-400 border-red-400'
              }`}
            >
              {lastTestResult.responseTime}ms
            </Badge>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WebhookTester;
