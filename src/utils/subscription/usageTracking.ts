import { getDB } from '../storage/indexedDBStorage';
import { createError, ErrorCode, ErrorSeverity } from '../errorHandling';
import { v4 as uuidv4 } from 'uuid';

// Constants
const DB_NAME = 'oneai-notes';
const USAGE_STORE = 'usage_tracking';
const SUBSCRIPTION_STORE = 'subscription';

// Plan definitions
export enum SubscriptionPlan {
  FREE = 'free',
  PRO = 'pro',
  ENTERPRISE = 'enterprise'
}

export interface SubscriptionData {
  id: string;
  plan: SubscriptionPlan;
  activatedAt: string;
  expiresAt: string | null; // null means never expires
  features: string[];
}

export interface UsageRecord {
  id: string;
  feature: string;
  timestamp: string;
  day: string; // YYYY-MM-DD format for easy querying
}

// Default quotas for different plans
const DAILY_QUOTAS = {
  [SubscriptionPlan.FREE]: {
    'ai-gemini': 10,
    'ai-image-generation': 5
  },
  [SubscriptionPlan.PRO]: {
    'ai-gemini': 50,
    'ai-image-generation': 25
  },
  [SubscriptionPlan.ENTERPRISE]: {
    'ai-gemini': 200,
    'ai-image-generation': 100
  }
};

/**
 * Initialize the subscription stores
 */
export const initSubscriptionStores = async (): Promise<void> => {
  try {
    // First ensure database exists
    let db: IDBDatabase;
    
    try {
      db = await getDB();
    } catch (err) {
      console.warn('Initial getDB failed, creating stores directly:', err);
      // If database access fails, we'll initialize directly
      await initSubscriptionStoresDirect();
      return;
    }
    
    // Check if stores exist
    if (!db.objectStoreNames.contains(USAGE_STORE) || 
        !db.objectStoreNames.contains(SUBSCRIPTION_STORE)) {
      // Stores missing, initialize them directly
      db.close();
      await initSubscriptionStoresDirect();
    } else {
      // Stores exist, ensure we have a subscription
      await ensureSubscription();
    }
  } catch (error) {
    console.error('Failed to initialize subscription stores:', error);
    // Don't throw here, just log the error and let the app continue
    // with limited functionality
  }
};

/**
 * Direct initialization of subscription stores
 * This is a fallback method when the main initialization fails
 */
const initSubscriptionStoresDirect = async (): Promise<void> => {
  return new Promise((resolve, reject) => {
    try {
      // Get the current database version
      const checkRequest = indexedDB.open(DB_NAME);
      
      checkRequest.onsuccess = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;
        const currentVersion = db.version;
        db.close();
        
        // Open with a new version
        const request = indexedDB.open(DB_NAME, currentVersion + 1);
        
        request.onupgradeneeded = (event) => {
          const db = (event.target as IDBOpenDBRequest).result;
          
          // Create usage tracking store if it doesn't exist
          if (!db.objectStoreNames.contains(USAGE_STORE)) {
            try {
              const usageStore = db.createObjectStore(USAGE_STORE, { keyPath: 'id' });
              usageStore.createIndex('by_day', 'day', { unique: false });
              usageStore.createIndex('by_feature', 'feature', { unique: false });
              usageStore.createIndex('by_day_and_feature', ['day', 'feature'], { unique: false });
              console.log('Created usage store successfully');
            } catch (e) {
              console.warn('Error creating usage store, may already exist:', e);
            }
          }
          
          // Create subscription store if it doesn't exist
          if (!db.objectStoreNames.contains(SUBSCRIPTION_STORE)) {
            try {
              db.createObjectStore(SUBSCRIPTION_STORE, { keyPath: 'id' });
              console.log('Created subscription store successfully');
            } catch (e) {
              console.warn('Error creating subscription store, may already exist:', e);
            }
          }
        };
        
        request.onsuccess = async () => {
          try {
            request.result.close();
            // Now ensure subscription with a fresh DB connection
            await ensureSubscription();
            resolve();
          } catch (err) {
            console.error('Error in final subscription setup:', err);
            resolve(); // Still resolve to prevent blocking app
          }
        };
        
        request.onerror = (event) => {
          console.error('Database upgrade error:', event);
          resolve(); // Still resolve to prevent blocking app
        };
      };
      
      checkRequest.onerror = (event) => {
        console.error('Could not open database for version check:', event);
        resolve(); // Still resolve to prevent blocking app
      };
    } catch (err) {
      console.error('Critical error in database initialization:', err);
      resolve(); // Still resolve to prevent blocking app
    }
  });
};

/**
 * Ensure the user has a subscription record
 */
export const ensureSubscription = async (): Promise<SubscriptionData> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SUBSCRIPTION_STORE], 'readwrite');
      const store = transaction.objectStore(SUBSCRIPTION_STORE);
      
      // Get all subscriptions
      const request = store.getAll();
      
      request.onsuccess = () => {
        if (request.result.length === 0) {
          // No subscription found, create a free one
          const freeSubscription: SubscriptionData = {
            id: 'default',
            plan: SubscriptionPlan.FREE,
            activatedAt: new Date().toISOString(),
            expiresAt: null,
            features: ['ai-gemini', 'ai-image-generation']
          };
          
          const addRequest = store.add(freeSubscription);
          
          addRequest.onsuccess = () => {
            resolve(freeSubscription);
          };
          
          addRequest.onerror = () => {
            reject(new Error('Failed to create default subscription'));
          };
        } else {
          // Return the first subscription found
          resolve(request.result[0]);
        }
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get subscription data'));
      };
    });
  } catch (error) {
    console.error('Error ensuring subscription:', error);
    throw createError(
      ErrorCode.SUBSCRIPTION_ERROR, 
      'Failed to initialize subscription', 
      ErrorSeverity.ERROR,
      { context: error }
    );
  }
};

/**
 * Get the current subscription
 */
export const getCurrentSubscription = async (): Promise<SubscriptionData> => {
  try {
    return await ensureSubscription();
  } catch (error) {
    console.error('Error getting current subscription:', error);
    throw createError(
      ErrorCode.SUBSCRIPTION_ERROR, 
      'Failed to get subscription details', 
      ErrorSeverity.ERROR,
      { context: error }
    );
  }
};

/**
 * Upgrade subscription using a code
 * In a real application, this would connect to a payment processor
 * Here we just validate special codes
 */
export const upgradeSubscription = async (upgradeCode: string): Promise<SubscriptionData> => {
  try {
    // Validate the upgrade code
    // In a real app, this would verify with a server
    // Here we just check for specific codes
    let newPlan: SubscriptionPlan;
    
    if (upgradeCode === 'PRO-ONEAI-2025') {
      newPlan = SubscriptionPlan.PRO;
    } else if (upgradeCode === 'ENTERPRISE-ONEAI-2025') {
      newPlan = SubscriptionPlan.ENTERPRISE;
    } else {
      throw createError(
        ErrorCode.SUBSCRIPTION_ERROR, 
        'Invalid upgrade code', 
        ErrorSeverity.ERROR
      );
    }
    
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SUBSCRIPTION_STORE], 'readwrite');
      const store = transaction.objectStore(SUBSCRIPTION_STORE);
      
      // Get all subscriptions
      const request = store.getAll();
      
      request.onsuccess = () => {
        if (request.result.length === 0) {
          reject(new Error('No subscription found'));
          return;
        }
        
        // Update the subscription
        const subscription = request.result[0];
        subscription.plan = newPlan;
        subscription.activatedAt = new Date().toISOString();
        
        // For this demo, make pro plan expire after 30 days
        if (newPlan === SubscriptionPlan.PRO) {
          const expiryDate = new Date();
          expiryDate.setDate(expiryDate.getDate() + 30);
          subscription.expiresAt = expiryDate.toISOString();
        } else if (newPlan === SubscriptionPlan.ENTERPRISE) {
          // Enterprise never expires in this demo
          subscription.expiresAt = null;
        }
        
        const updateRequest = store.put(subscription);
        
        updateRequest.onsuccess = () => {
          resolve(subscription);
        };
        
        updateRequest.onerror = () => {
          reject(new Error('Failed to update subscription'));
        };
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get subscription data'));
      };
    });
  } catch (error) {
    console.error('Error upgrading subscription:', error);
    throw createError(
      ErrorCode.SUBSCRIPTION_ERROR, 
      error instanceof Error ? error.message : 'Failed to upgrade subscription', 
      ErrorSeverity.ERROR,
      { context: error }
    );
  }
};

/**
 * Track usage of a feature
 */
export const trackFeatureUsage = async (feature: string): Promise<void> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USAGE_STORE], 'readwrite');
      const store = transaction.objectStore(USAGE_STORE);
      
      const now = new Date();
      const today = now.toISOString().split('T')[0]; // YYYY-MM-DD
      
      // Create a new usage record
      const record: UsageRecord = {
        id: uuidv4(),
        feature,
        timestamp: now.toISOString(),
        day: today
      };
      
      const request = store.add(record);
      
      request.onsuccess = () => {
        resolve();
      };
      
      request.onerror = () => {
        reject(new Error('Failed to track feature usage'));
      };
    });
  } catch (error) {
    console.error('Error tracking feature usage:', error);
    throw createError(
      ErrorCode.USAGE_TRACKING_ERROR, 
      'Failed to track feature usage', 
      ErrorSeverity.ERROR,
      { context: error }
    );
  }
};

/**
 * Check if using a feature would exceed the quota
 */
export const canUseFeature = async (feature: string): Promise<boolean> => {
  try {
    const db = await getDB();
    const subscription = await getCurrentSubscription();
    
    // Ensure feature is enabled for this subscription
    if (!subscription.features.includes(feature)) {
      return false;
    }
    
    // Check for expiration
    if (subscription.expiresAt) {
      const expiryDate = new Date(subscription.expiresAt);
      if (expiryDate < new Date()) {
        // Subscription expired, downgrade to free
        await downgradeToFree();
        // Re-check with free plan
        return await canUseFeature(feature);
      }
    }
    
    // Get the quota for this feature based on subscription plan
    const quota = DAILY_QUOTAS[subscription.plan][feature as keyof typeof DAILY_QUOTAS[typeof subscription.plan]];
    
    if (!quota) {
      // No quota defined for this feature, assume unlimited
      return true;
    }
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USAGE_STORE], 'readonly');
      const store = transaction.objectStore(USAGE_STORE);
      const index = store.index('by_day_and_feature');
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const keyRange = IDBKeyRange.only([today, feature]);
      
      const countRequest = index.count(keyRange);
      
      countRequest.onsuccess = () => {
        // Check if we have exceeded our quota
        const count = countRequest.result;
        resolve(count < quota);
      };
      
      countRequest.onerror = () => {
        reject(new Error('Failed to count feature usage'));
      };
    });
  } catch (error) {
    console.error('Error checking feature quota:', error);
    // Default to allowing usage if there's an error
    return true;
  }
};

/**
 * Get usage statistics for a feature
 */
export const getFeatureUsage = async (feature: string): Promise<{used: number, total: number}> => {
  try {
    const db = await getDB();
    const subscription = await getCurrentSubscription();
    
    // Get the quota for this feature based on subscription plan
    const quota = DAILY_QUOTAS[subscription.plan][feature as keyof typeof DAILY_QUOTAS[typeof subscription.plan]] || 0;
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([USAGE_STORE], 'readonly');
      const store = transaction.objectStore(USAGE_STORE);
      const index = store.index('by_day_and_feature');
      
      const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
      const keyRange = IDBKeyRange.only([today, feature]);
      
      const countRequest = index.count(keyRange);
      
      countRequest.onsuccess = () => {
        const count = countRequest.result;
        resolve({
          used: count,
          total: quota
        });
      };
      
      countRequest.onerror = () => {
        reject(new Error('Failed to count feature usage'));
      };
    });
  } catch (error) {
    console.error('Error getting feature usage:', error);
    return { used: 0, total: 0 };
  }
};

/**
 * Downgrade to free plan
 */
const downgradeToFree = async (): Promise<void> => {
  try {
    const db = await getDB();
    
    return new Promise((resolve, reject) => {
      const transaction = db.transaction([SUBSCRIPTION_STORE], 'readwrite');
      const store = transaction.objectStore(SUBSCRIPTION_STORE);
      
      // Get all subscriptions
      const request = store.getAll();
      
      request.onsuccess = () => {
        if (request.result.length === 0) {
          resolve();
          return;
        }
        
        // Update the subscription to free
        const subscription = request.result[0];
        subscription.plan = SubscriptionPlan.FREE;
        subscription.expiresAt = null;
        
        const updateRequest = store.put(subscription);
        
        updateRequest.onsuccess = () => {
          resolve();
        };
        
        updateRequest.onerror = () => {
          reject(new Error('Failed to downgrade subscription'));
        };
      };
      
      request.onerror = () => {
        reject(new Error('Failed to get subscription data'));
      };
    });
  } catch (error) {
    console.error('Error downgrading to free plan:', error);
    throw createError(
      ErrorCode.SUBSCRIPTION_ERROR,
      'Failed to downgrade subscription to free plan',
      ErrorSeverity.ERROR,
      { context: error }
    );
  }
};
