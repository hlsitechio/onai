
// Type definitions for Chrome extension API
declare namespace chrome {
  namespace storage {
    interface StorageArea {
      get(keys: string | string[] | null): Promise<Record<string, any>>;
      set(items: Record<string, any>): Promise<void>;
      remove(keys: string | string[]): Promise<void>;
      clear(): Promise<void>;
    }

    const sync: StorageArea;
    const local: StorageArea;
  }

  namespace tabs {
    interface CreateProperties {
      url?: string;
      active?: boolean;
      windowId?: number;
    }
    
    function create(properties: CreateProperties): Promise<any>;
  }
}
