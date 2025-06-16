
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ExternalLink } from 'lucide-react';

interface ActivityLogsTabProps {
  deployHooks: any[];
}

const ActivityLogsTab: React.FC<ActivityLogsTabProps> = ({ deployHooks }) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'success':
        return 'bg-green-500';
      case 'failed':
        return 'bg-red-500';
      case 'triggered':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  const allLogs = deployHooks
    .flatMap(hook => 
      hook.deploy_hook_logs?.map(log => ({
        ...log,
        hook_name: hook.hook_name,
      })) || []
    )
    .sort((a, b) => new Date(b.triggered_at).getTime() - new Date(a.triggered_at).getTime())
    .slice(0, 10);

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white">Recent Activity</CardTitle>
        <CardDescription className="text-gray-400">
          Latest webhook triggers and deployment status
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {allLogs.map((log) => (
            <div
              key={log.id}
              className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
            >
              <div className="flex items-center space-x-3">
                <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`} />
                <div>
                  <p className="text-white font-medium">{log.hook_name}</p>
                  <p className="text-sm text-gray-400">
                    {new Date(log.triggered_at).toLocaleString()}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="outline" className={`${getStatusColor(log.status)} text-white border-0`}>
                  {log.status}
                </Badge>
                {log.deployment_id && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.open(`https://vercel.com/dashboard/deployments/${log.deployment_id}`, '_blank')}
                    className="border-white/20 text-white hover:bg-white/10"
                  >
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        
          {allLogs.length === 0 && (
            <p className="text-center text-gray-400 py-4">
              No activity logs found
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ActivityLogsTab;
