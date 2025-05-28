/**
 * Roadmap Type Definitions
 * 
 * These types define the structure of roadmap data used throughout the application,
 * ensuring consistent data handling between the UI, API, and GitHub synchronization.
 */

// Roadmap item categories
export type RoadmapCategory = 'core' | 'ai' | 'ui' | 'security' | 'performance';

// Roadmap item priorities
export type RoadmapPriority = 'low' | 'medium' | 'high' | 'critical';

// Roadmap item status
export type RoadmapStatus = 'planned' | 'in-progress' | 'completed' | 'delayed';

// GitHub issue reference
export interface GitHubIssueReference {
  number: number;
  url: string;
  createdAt: string;
  updatedAt: string;
  closedAt?: string;
}

// Roadmap item
export interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  estimatedDays: number;
  status: RoadmapStatus;
  category: RoadmapCategory;
  priority: RoadmapPriority;
  completionPercentage?: number;
  tags?: string[];
  dependencies?: string[];
  githubIssue?: GitHubIssueReference;
  syncError?: string;
}

// Roadmap configuration
export interface RoadmapConfig {
  categories: {
    [key in RoadmapCategory]: {
      label: string;
      description: string;
      color: string;
    }
  };
  priorities: {
    [key in RoadmapPriority]: {
      label: string;
      description: string;
      color: string;
    }
  };
  statuses: {
    [key in RoadmapStatus]: {
      label: string;
      description: string;
      color: string;
    }
  };
  milestones: Array<{
    id: string;
    title: string;
    description: string;
    targetDate: string;
    features: string[];
  }>;
  lastSyncedAt?: string;
}
