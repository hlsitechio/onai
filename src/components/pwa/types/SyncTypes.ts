
export interface SyncItem {
  id: string;
  type: string;
  data: any;
  timestamp: number;
  status: 'pending' | 'syncing' | 'completed' | 'failed';
  retryCount: number;
}

export interface SyncQueueState {
  items: SyncItem[];
  isSyncing: boolean;
}
