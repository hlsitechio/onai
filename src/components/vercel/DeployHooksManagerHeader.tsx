
import React from 'react';
import { Button } from '@/components/ui/button';
import { RefreshCw, Download } from 'lucide-react';
import CreateHookDialog from './CreateHookDialog';

interface DeployHooksManagerHeaderProps {
  onRefresh: () => void;
  onImport: () => void;
  isLoading: boolean;
  projects: any[];
  onCreateHook: (hookData: any) => Promise<void>;
}

const DeployHooksManagerHeader: React.FC<DeployHooksManagerHeaderProps> = ({
  onRefresh,
  onImport,
  isLoading,
  projects,
  onCreateHook,
}) => {
  return (
    <div className="flex justify-between items-center">
      <div>
        <h2 className="text-2xl font-bold text-white">Deploy Hooks</h2>
        <p className="text-gray-400 mt-1">
          Create webhooks to trigger deployments from external services
        </p>
      </div>
      
      <div className="flex gap-2">
        <Button
          onClick={onRefresh}
          disabled={isLoading}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
        
        <Button
          onClick={onImport}
          variant="outline"
          className="border-white/20 text-white hover:bg-white/10"
        >
          <Download className="w-4 h-4 mr-2" />
          Import Hook
        </Button>
        
        <CreateHookDialog
          projects={projects}
          onCreateHook={onCreateHook}
          isLoading={isLoading}
        />
      </div>
    </div>
  );
};

export default DeployHooksManagerHeader;
