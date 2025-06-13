
import { useState, useRef, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface QueuedRequest {
  id: string;
  action: () => Promise<any>;
  resolve: (value: any) => void;
  reject: (error: any) => void;
}

export const useAIRequestQueue = () => {
  const [isProcessing, setIsProcessing] = useState(false);
  const [queueSize, setQueueSize] = useState(0);
  const queueRef = useRef<QueuedRequest[]>([]);
  const processingRef = useRef(false);
  const { toast } = useToast();

  const processQueue = useCallback(async () => {
    if (processingRef.current || queueRef.current.length === 0) {
      return;
    }

    processingRef.current = true;
    setIsProcessing(true);

    while (queueRef.current.length > 0) {
      const request = queueRef.current.shift();
      if (!request) break;

      setQueueSize(queueRef.current.length);

      try {
        console.log(`Processing AI request ${request.id}, ${queueRef.current.length} remaining in queue`);
        const result = await request.action();
        request.resolve(result);
      } catch (error) {
        console.error(`AI request ${request.id} failed:`, error);
        request.reject(error);
      }

      // Small delay between requests to prevent overwhelming the system
      if (queueRef.current.length > 0) {
        await new Promise(resolve => setTimeout(resolve, 100));
      }
    }

    processingRef.current = false;
    setIsProcessing(false);
    setQueueSize(0);
  }, []);

  const enqueueRequest = useCallback(<T>(action: () => Promise<T>): Promise<T> => {
    return new Promise((resolve, reject) => {
      const requestId = `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      const queuedRequest: QueuedRequest = {
        id: requestId,
        action,
        resolve,
        reject
      };

      queueRef.current.push(queuedRequest);
      setQueueSize(queueRef.current.length);

      console.log(`AI request ${requestId} added to queue. Queue size: ${queueRef.current.length}`);

      // Show toast notification if there are multiple requests in queue
      if (queueRef.current.length > 1) {
        toast({
          title: "AI Request Queued",
          description: `Your request is queued. ${queueRef.current.length - 1} requests ahead.`,
          duration: 3000
        });
      }

      // Start processing the queue
      processQueue();
    });
  }, [processQueue, toast]);

  const clearQueue = useCallback(() => {
    const remainingRequests = queueRef.current.splice(0);
    remainingRequests.forEach(request => {
      request.reject(new Error('Request cancelled'));
    });
    setQueueSize(0);
    
    toast({
      title: "Queue Cleared",
      description: "All pending AI requests have been cancelled.",
    });
  }, [toast]);

  return {
    isProcessing,
    queueSize,
    enqueueRequest,
    clearQueue
  };
};
