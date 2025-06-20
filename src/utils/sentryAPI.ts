
import * as Sentry from '@sentry/react';

interface SentryError {
  id: string;
  title: string;
  culprit: string;
  level: string;
  status: string;
  count: number;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  shortId: string;
  metadata: {
    title: string;
    type: string;
    value: string;
    filename?: string;
    function?: string;
  };
  tags: Array<{ key: string; value: string }>;
  context: Record<string, any>;
}

interface SentryIssue {
  id: string;
  shortId: string;
  title: string;
  culprit: string;
  permalink: string;
  logger: string;
  level: string;
  status: string;
  statusDetails: Record<string, any>;
  isPublic: boolean;
  platform: string;
  project: {
    id: string;
    name: string;
    slug: string;
  };
  type: string;
  metadata: {
    title: string;
    type: string;
    value: string;
  };
  numComments: number;
  assignedTo?: any;
  isBookmarked: boolean;
  isSubscribed: boolean;
  subscriptionDetails?: any;
  hasSeen: boolean;
  annotations: any[];
  issueType: string;
  issueCategory: string;
  priority: string;
  priorityLockedAt?: string;
  isUnhandled: boolean;
  count: string;
  userCount: number;
  firstSeen: string;
  lastSeen: string;
  stats: {
    '24h': Array<[number, number]>;
  };
}

class SentryAPIService {
  private authToken: string | null = null;
  private organizationSlug: string = 'o4509521908400128';
  private projectSlug: string = '4509521909252096';
  private baseURL: string = 'https://sentry.io/api/0';

  constructor() {
    // Try to get auth token from environment or localStorage
    this.authToken = import.meta.env.VITE_SENTRY_AUTH_TOKEN || 
                     localStorage.getItem('sentry-auth-token');
  }

  setAuthToken(token: string) {
    this.authToken = token;
    localStorage.setItem('sentry-auth-token', token);
  }

  private async makeRequest(endpoint: string): Promise<any> {
    if (!this.authToken) {
      throw new Error('Sentry auth token not configured');
    }

    const response = await fetch(`${this.baseURL}${endpoint}`, {
      headers: {
        'Authorization': `Bearer ${this.authToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Sentry API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getRecentIssues(limit: number = 25): Promise<SentryIssue[]> {
    try {
      const endpoint = `/projects/${this.organizationSlug}/${this.projectSlug}/issues/?statsPeriod=24h&limit=${limit}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Failed to fetch Sentry issues:', error);
      return [];
    }
  }

  async getIssueDetails(issueId: string): Promise<SentryIssue | null> {
    try {
      const endpoint = `/issues/${issueId}/`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Failed to fetch issue details:', error);
      return null;
    }
  }

  async getIssueEvents(issueId: string, limit: number = 10): Promise<any[]> {
    try {
      const endpoint = `/issues/${issueId}/events/?limit=${limit}`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Failed to fetch issue events:', error);
      return [];
    }
  }

  async getProjectStats(): Promise<any> {
    try {
      const endpoint = `/projects/${this.organizationSlug}/${this.projectSlug}/stats/?stat=received&resolution=1h&since=1672531200`;
      return await this.makeRequest(endpoint);
    } catch (error) {
      console.error('Failed to fetch project stats:', error);
      return null;
    }
  }

  isConfigured(): boolean {
    return !!this.authToken;
  }

  getAuthTokenInstructions(): string {
    return `
    To enable Sentry API integration:
    1. Go to https://sentry.io/settings/account/api/auth-tokens/
    2. Create a new token with 'project:read' scope
    3. Add the token to your environment or use the form below
    `;
  }
}

export const sentryAPI = new SentryAPIService();
export type { SentryError, SentryIssue };
