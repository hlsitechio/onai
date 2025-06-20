
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertTriangle, BarChart3, ExternalLink } from 'lucide-react';
import { useErrorMonitoring } from '@/contexts/ErrorMonitoringContext';
import { useUserRole } from '@/hooks/useUserRole';
import { useNavigate } from 'react-router-dom';

const ErrorMonitorButton: React.FC = () => {
  const { errors, sentryIssues, refreshSentryData } = useErrorMonitoring();
  const { isAdmin, loading } = useUserRole();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // Don't show the button if user is not admin or still loading
  if (loading || !isAdmin) {
    return null;
  }

  const recentErrors = errors.filter(error => 
    Date.now() - error.timestamp.getTime() < 24 * 60 * 60 * 1000
  ).length;

  const criticalErrors = errors.filter(error => 
    error.level === 'error' && Date.now() - error.timestamp.getTime() < 60 * 60 * 1000
  ).length;

  const openDashboard = () => {
    navigate('/error-dashboard');
    setIsOpen(false);
  };

  if (import.meta.env.PROD && recentErrors === 0 && sentryIssues.length === 0) {
    return null; // Hide in production if no errors
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          size="sm"
          className="fixed bottom-4 left-4 bg-black/80 backdrop-blur-sm border-white/20 text-white hover:bg-black/90 z-50"
        >
          <AlertTriangle className={`h-4 w-4 mr-2 ${criticalErrors > 0 ? 'text-red-400' : 'text-yellow-400'}`} />
          Errors
          {recentErrors > 0 && (
            <Badge variant="destructive" className="ml-2 h-5 px-1.5 text-xs">
              {recentErrors}
            </Badge>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-80 bg-black/90 backdrop-blur-sm border-white/20" side="top">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-white">Error Monitor (Admin)</h3>
            <Button onClick={refreshSentryData} variant="ghost" size="sm">
              <BarChart3 className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-red-400">{recentErrors}</div>
              <div className="text-xs text-gray-400">Recent Errors</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-400">{sentryIssues.length}</div>
              <div className="text-xs text-gray-400">Sentry Issues</div>
            </div>
          </div>

          {criticalErrors > 0 && (
            <div className="p-2 bg-red-500/20 border border-red-500/30 rounded">
              <p className="text-xs text-red-300">
                {criticalErrors} critical error{criticalErrors !== 1 ? 's' : ''} in the last hour
              </p>
            </div>
          )}

          <div className="space-y-2">
            {errors.slice(-3).reverse().map((error) => (
              <div key={error.id} className="p-2 bg-white/5 rounded text-xs">
                <div className="flex items-center space-x-2">
                  <Badge variant={error.level === 'error' ? 'destructive' : 'secondary'} className="text-xs">
                    {error.level}
                  </Badge>
                  <span className="text-gray-400">
                    {error.timestamp.toLocaleTimeString()}
                  </span>
                </div>
                <p className="text-white mt-1 truncate">{error.message}</p>
              </div>
            ))}
          </div>

          <Button 
            onClick={openDashboard} 
            className="w-full" 
            size="sm"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Open Dashboard
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default ErrorMonitorButton;
