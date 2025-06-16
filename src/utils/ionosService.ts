
import { supabase } from '@/integrations/supabase/client';

export interface IonosDomain {
  id: string;
  name: string;
  status: string;
  created?: string;
  expires?: string;
}

export interface IonosDnsRecord {
  id: string;
  type: string;
  name: string;
  content: string;
  ttl: number;
  priority?: number;
}

export interface CreateDnsRecordRequest {
  domain: string;
  recordType: string;
  name: string;
  content: string;
  ttl?: number;
  priority?: number;
}

/**
 * Get all domains from IONOS
 */
export const getIonosDomains = async (): Promise<IonosDomain[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('ionos-api', {
      body: JSON.stringify({
        action: 'list_domains'
      }),
    });

    if (error) {
      console.error('Failed to fetch IONOS domains:', error);
      throw new Error(`Failed to fetch domains: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching IONOS domains:', error);
    throw error;
  }
};

/**
 * Get DNS records for a specific domain
 */
export const getIonosDnsRecords = async (domain: string): Promise<IonosDnsRecord[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('ionos-api', {
      body: JSON.stringify({
        action: 'list_dns_records',
        domain
      }),
    });

    if (error) {
      console.error('Failed to fetch IONOS DNS records:', error);
      throw new Error(`Failed to fetch DNS records: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching IONOS DNS records:', error);
    throw error;
  }
};

/**
 * Create a new DNS record
 */
export const createIonosDnsRecord = async (request: CreateDnsRecordRequest): Promise<IonosDnsRecord> => {
  try {
    const { data, error } = await supabase.functions.invoke('ionos-api', {
      body: JSON.stringify({
        action: 'create_dns_record',
        domain: request.domain,
        recordType: request.recordType,
        name: request.name,
        content: request.content,
        ttl: request.ttl,
        priority: request.priority
      }),
    });

    if (error) {
      console.error('Failed to create IONOS DNS record:', error);
      throw new Error(`Failed to create DNS record: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error('Error creating IONOS DNS record:', error);
    throw error;
  }
};

/**
 * Validate domain format
 */
export const isValidDomain = (domain: string): boolean => {
  const domainRegex = /^[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(\.[a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
  return domainRegex.test(domain);
};

/**
 * Validate DNS record content based on type
 */
export const validateDnsRecordContent = (type: string, content: string): boolean => {
  switch (type.toUpperCase()) {
    case 'A':
      // IPv4 address validation
      const ipv4Regex = /^(\d{1,3}\.){3}\d{1,3}$/;
      return ipv4Regex.test(content);
    case 'AAAA':
      // IPv6 address validation (simplified)
      const ipv6Regex = /^([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}$/;
      return ipv6Regex.test(content) || content.includes('::');
    case 'CNAME':
    case 'MX':
      return isValidDomain(content);
    case 'TXT':
      return content.length > 0;
    default:
      return true; // Allow other record types
  }
};
