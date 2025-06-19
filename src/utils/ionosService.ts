
import { supabase } from '@/integrations/supabase/client';

export interface IonosZone {
  id: string;
  name: string;
  type: string;
}

export interface IonosDnsRecord {
  id?: string;
  name: string;
  rootName?: string;
  type: string;
  content: string;
  ttl: number;
  prio?: number;
  disabled?: boolean;
  changeDate?: string;
}

export interface CreateDnsRecordRequest {
  zoneId: string;
  recordType: string;
  name: string;
  content: string;
  ttl?: number;
  prio?: number;
}

/**
 * Get all zones from IONOS
 */
export const getIonosZones = async (): Promise<IonosZone[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('ionos-dns-api', {
      body: JSON.stringify({
        action: 'list_zones'
      }),
    });

    if (error) {
      console.error('Failed to fetch IONOS zones:', error);
      throw new Error(`Failed to fetch zones: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Error fetching IONOS zones:', error);
    throw error;
  }
};

/**
 * Get DNS records for a specific zone
 */
export const getIonosDnsRecords = async (zoneId: string): Promise<IonosDnsRecord[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('ionos-dns-api', {
      body: JSON.stringify({
        action: 'get_zone_records',
        zoneId
      }),
    });

    if (error) {
      console.error('Failed to fetch IONOS DNS records:', error);
      throw new Error(`Failed to fetch DNS records: ${error.message}`);
    }

    return data?.records || [];
  } catch (error) {
    console.error('Error fetching IONOS DNS records:', error);
    throw error;
  }
};

/**
 * Create new DNS records
 */
export const createIonosDnsRecord = async (request: CreateDnsRecordRequest): Promise<IonosDnsRecord[]> => {
  try {
    const { data, error } = await supabase.functions.invoke('ionos-dns-api', {
      body: JSON.stringify({
        action: 'create_dns_records',
        zoneId: request.zoneId,
        records: [{
          name: request.name,
          type: request.recordType,
          content: request.content,
          ttl: request.ttl || 3600,
          prio: request.prio || 0,
          disabled: false
        }]
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

// Legacy compatibility exports
export const getIonosDomains = getIonosZones;
export type IonosDomain = IonosZone;
