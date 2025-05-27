/**
 * Performance Dashboard Component
 * 
 * Displays performance metrics and recommendations to help users
 * optimize their OneAI experience without requiring external services.
 */

import React, { useState, useEffect } from 'react';
import { 
  MetricType, 
  getPerformanceMetrics, 
  getAverageDuration, 
  getPerformanceRecommendations, 
  clearPerformanceMetrics 
} from '../../utils/performance/performanceMonitor';

// Styling constants
const PERFORMANCE_COLORS = {
  good: '#4ade80', // Green
  warning: '#fbbf24', // Yellow
  critical: '#f87171', // Red
  neutral: '#a1a1aa', // Gray
};

interface PerformanceMetricCardProps {
  title: string;
  type: MetricType;
  description: string;
}

const PerformanceMetricCard: React.FC<PerformanceMetricCardProps> = ({ 
  title, 
  type, 
  description 
}) => {
  const [averageDuration, setAverageDuration] = useState<number | null>(null);
  
  useEffect(() => {
    setAverageDuration(getAverageDuration(type));
    
    // Refresh data periodically
    const interval = setInterval(() => {
      setAverageDuration(getAverageDuration(type));
    }, 5000);
    
    return () => clearInterval(interval);
  }, [type]);
  
  // Determine performance color based on duration
  const getPerformanceColor = (duration: number | null): string => {
    if (duration === null) return PERFORMANCE_COLORS.neutral;
    
    if (type === MetricType.EDITOR_RENDER || type === MetricType.SIDEBAR_RENDER) {
      if (duration < 30) return PERFORMANCE_COLORS.good;
      if (duration < 100) return PERFORMANCE_COLORS.warning;
      return PERFORMANCE_COLORS.critical;
    } else {
      if (duration < 200) return PERFORMANCE_COLORS.good;
      if (duration < 800) return PERFORMANCE_COLORS.warning;
      return PERFORMANCE_COLORS.critical;
    }
  };
  
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg p-4 shadow-md">
      <h3 className="text-lg font-semibold mb-1">{title}</h3>
      <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{description}</p>
      {averageDuration !== null ? (
        <div className="flex items-center">
          <div 
            className="w-3 h-3 rounded-full mr-2" 
            style={{ backgroundColor: getPerformanceColor(averageDuration) }}
          />
          <span className="font-mono">
            {averageDuration.toFixed(2)}ms
          </span>
        </div>
      ) : (
        <div className="text-sm text-gray-500">No data available</div>
      )}
    </div>
  );
};

export const PerformanceDashboard: React.FC = () => {
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [isVisible, setIsVisible] = useState(false);
  
  useEffect(() => {
    // Update recommendations
    setRecommendations(getPerformanceRecommendations());
    
    // Refresh recommendations periodically
    const interval = setInterval(() => {
      setRecommendations(getPerformanceRecommendations());
    }, 10000);
    
    return () => clearInterval(interval);
  }, []);
  
  const handleClearMetrics = () => {
    clearPerformanceMetrics();
    setRecommendations(['Performance metrics have been cleared.']);
  };
  
  // Metric cards configuration
  const metricCards = [
    { 
      title: 'Editor Rendering', 
      type: MetricType.EDITOR_RENDER, 
      description: 'Average time to render the note editor'
    },
    { 
      title: 'Sidebar Rendering', 
      type: MetricType.SIDEBAR_RENDER, 
      description: 'Average time to render the sidebar'
    },
    { 
      title: 'Note Saving', 
      type: MetricType.NOTE_SAVE, 
      description: 'Average time to save notes'
    },
    { 
      title: 'Note Loading', 
      type: MetricType.NOTE_LOAD, 
      description: 'Average time to load notes'
    },
    { 
      title: 'Encryption', 
      type: MetricType.ENCRYPTION, 
      description: 'Average time to encrypt data'
    },
    { 
      title: 'Decryption', 
      type: MetricType.DECRYPTION, 
      description: 'Average time to decrypt data'
    },
  ];
  
  if (!isVisible) {
    return (
      <button
        onClick={() => setIsVisible(true)}
        className="fixed bottom-4 right-4 bg-indigo-600 hover:bg-indigo-700 text-white p-2 rounded-full shadow-lg z-50"
        title="Open Performance Dashboard"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      </button>
    );
  }
  
  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Performance Dashboard</h2>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {metricCards.map(card => (
              <PerformanceMetricCard
                key={card.type}
                title={card.title}
                type={card.type}
                description={card.description}
              />
            ))}
          </div>
          
          <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 mb-6">
            <h3 className="text-lg font-semibold mb-3">Recommendations</h3>
            {recommendations.length > 0 ? (
              <ul className="list-disc pl-5 space-y-2">
                {recommendations.map((rec, index) => (
                  <li key={index} className="text-gray-700 dark:text-gray-300">{rec}</li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500">No recommendations available yet.</p>
            )}
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleClearMetrics}
              className="bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-4 py-2 rounded"
            >
              Clear All Metrics
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
