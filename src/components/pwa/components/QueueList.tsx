
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { RotateCw as Sync, CheckCircle, Clock, AlertCircle } from 'lucide-react';
import { SyncItem } from '../types/SyncTypes';

interface QueueListProps {
  syncQueue: SyncItem[];
}

const QueueList: React.FC<QueueListProps> = ({ syncQueue }) => {
  const getStatusIcon = (status: SyncItem['status']) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4" />;
      case 'syncing':
        return <Sync className="h-4 w-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: SyncItem['status']) => {
    switch (status) {
      case 'pending':
        return 'secondary';
      case 'syncing':
        return 'default';
      case 'completed':
        return 'default';
      case 'failed':
        return 'destructive';
    }
  };

  if (syncQueue.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2 max-h-40 overflow-y-auto">
      {syncQueue.slice(-5).map((item) => (
        <div key={item.id} className="flex items-center gap-2 p-2 bg-muted/30 rounded">
          {getStatusIcon(item.status)}
          <span className="text-sm flex-1">{item.type}</span>
          <Badge variant={getStatusColor(item.status)} className="text-xs">
            {item.status}
          </Badge>
        </div>
      ))}
    </div>
  );
};

export default QueueList;
