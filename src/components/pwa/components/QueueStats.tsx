
import React from 'react';
import { SyncItem } from '../types/SyncTypes';

interface QueueStatsProps {
  syncQueue: SyncItem[];
}

const QueueStats: React.FC<QueueStatsProps> = ({ syncQueue }) => {
  const pendingCount = syncQueue.filter(item => item.status === 'pending').length;
  const completedCount = syncQueue.filter(item => item.status === 'completed').length;
  const failedCount = syncQueue.filter(item => item.status === 'failed').length;

  return (
    <div className="grid grid-cols-3 gap-2 text-sm">
      <div className="text-center">
        <p className="font-medium">{pendingCount}</p>
        <p className="text-muted-foreground">Pending</p>
      </div>
      <div className="text-center">
        <p className="font-medium">{completedCount}</p>
        <p className="text-muted-foreground">Completed</p>
      </div>
      <div className="text-center">
        <p className="font-medium">{failedCount}</p>
        <p className="text-muted-foreground">Failed</p>
      </div>
    </div>
  );
};

export default QueueStats;
