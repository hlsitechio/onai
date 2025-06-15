
import { SyncItem } from '../types/SyncTypes';

export const createSyncItem = (type: string, data: any): SyncItem => {
  return {
    id: `${type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    type,
    data,
    timestamp: Date.now(),
    status: 'pending',
    retryCount: 0,
  };
};

export const saveSyncQueue = (queue: SyncItem[]): void => {
  try {
    localStorage.setItem('oneai-sync-queue', JSON.stringify(queue));
  } catch (error) {
    console.error('Error saving sync queue:', error);
  }
};

export const loadSyncQueue = (): SyncItem[] => {
  try {
    const stored = localStorage.getItem('oneai-sync-queue');
    return stored ? JSON.parse(stored) : [];
  } catch (error) {
    console.error('Error loading sync queue:', error);
    return [];
  }
};

export const processSyncItem = async (item: SyncItem): Promise<void> => {
  switch (item.type) {
    case 'note-save':
      // Simulate note saving
      await new Promise(resolve => setTimeout(resolve, 1000));
      break;
    case 'note-delete':
      // Simulate note deletion
      await new Promise(resolve => setTimeout(resolve, 500));
      break;
    case 'settings-update':
      // Simulate settings update
      await new Promise(resolve => setTimeout(resolve, 300));
      break;
    default:
      throw new Error(`Unknown sync type: ${item.type}`);
  }
};
