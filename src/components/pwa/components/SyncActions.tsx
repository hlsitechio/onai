
import React from 'react';
import { Button } from '@/components/ui/button';
import { RotateCw as Sync } from 'lucide-react';

interface SyncActionsProps {
  isOnline: boolean;
  isSyncing: boolean;
  hasFailedItems: boolean;
  hasCompletedItems: boolean;
  onSyncNow: () => void;
  onRetryFailed: () => void;
  onClearCompleted: () => void;
}

const SyncActions: React.FC<SyncActionsProps> = ({
  isOnline,
  isSyncing,
  hasFailedItems,
  hasCompletedItems,
  onSyncNow,
  onRetryFailed,
  onClearCompleted,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={onSyncNow}
          disabled={!isOnline || isSyncing}
          className="flex-1"
        >
          <Sync className="h-4 w-4 mr-2" />
          {isSyncing ? 'Syncing...' : 'Sync Now'}
        </Button>
        {hasFailedItems && (
          <Button
            variant="outline"
            size="sm"
            onClick={onRetryFailed}
            className="flex-1"
          >
            Retry Failed
          </Button>
        )}
      </div>

      {hasCompletedItems && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearCompleted}
          className="w-full"
        >
          Clear Completed
        </Button>
      )}
    </div>
  );
};

export default SyncActions;
