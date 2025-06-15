
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ConnectionStatusProps {
  isOnline: boolean;
}

const ConnectionStatus: React.FC<ConnectionStatusProps> = ({ isOnline }) => {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm text-muted-foreground">Status</span>
      <Badge variant={isOnline ? 'default' : 'secondary'}>
        {isOnline ? 'Online' : 'Offline'}
      </Badge>
    </div>
  );
};

export default ConnectionStatus;
