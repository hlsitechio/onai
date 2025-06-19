
import { supabase } from '@/integrations/supabase/client';

export interface IonosZone {
  id: string;
  name: string;
  type: 'NATIVE' | 'SLAVE';
}

export interface IonosDnsRecord {
  id?: string;
  name: string;
  rootName?: string;
  type: 'A' | 'AAAA' | 'CNAME' | 'MX' | 'NS' | 'SOA' | 'SRV' | 'TXT' | 'CAA' | 'TLSA' | 'SMIMEA' | 'SSHFP' | 'DS' | 'HTTPS' | 'SVCB' | 'CERT' | 'URI' | 'RP' | 'LOC' | 'OPENPGPKEY';
  content: string;
  ttl: number;
  prio?: number;
  disabled?: boolean;
  changeDate?: string;
}

export interface CustomerZone {
  id: string;
  name: string;
  type: 'NATIVE' | 'SLAVE';
  records: IonosDnsRecord[];
}

export interface CreateDnsRecordRequest {
  zoneId: string;
  recordType: string;
  name: string;
  content: string;
  ttl?: number;
  prio?: number;
}

// Get IONOS API key from Supabase secrets
const getIonosApiKey = async (): Promise<string> => {
  const { data, error } = await supabase.functions.invoke('get-ionos-key');
  if (error || !data?.apiKey) {
    throw new Error('IONOS API key not configured');
  }
  return data.apiKey;
};

/**
 * Get all zones from IONOS using the edge function
 */
export const getIonosZones = async (): Promise<IonosZone[]> => {
  try {
    console.log('Fetching IONOS zones via edge function...');
    
    const { data, error } = await supabase.functions.invoke('ionos-dns-api', {
      body: {
        action: 'list_zones'
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    console.log('Zones response:', data);
    return data || [];
  } catch (error) {
    console.error('Error fetching IONOS zones:', error);
    throw error;
  }
};

/**
 * Get DNS records for a specific zone using the edge function
 */
export const getIonosDnsRecords = async (zoneId: string): Promise<IonosDnsRecord[]> => {
  try {
    console.log('Fetching DNS records for zone:', zoneId);
    
    const { data, error } = await supabase.functions.invoke('ionos-dns-api', {
      body: {
        action: 'get_zone_records',
        zoneId: zoneId
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    console.log('Zone records response:', data);
    // The edge function returns the full customer-zone object
    return data?.records || [];
  } catch (error) {
    console.error('Error fetching IONOS DNS records:', error);
    throw error;
  }
};

/**
 * Create new DNS records using the edge function
 */
export const createIonosDnsRecord = async (request: CreateDnsRecordRequest): Promise<IonosDnsRecord[]> => {
  try {
    const records = [{
      name: request.name,
      type: request.recordType,
      content: request.content,
      ttl: request.ttl || 3600,
      prio: request.prio || 0,
      disabled: false
    }];

    console.log('Creating DNS records via edge function:', {
      zoneId: request.zoneId,
      records: records
    });

    const { data, error } = await supabase.functions.invoke('ionos-dns-api', {
      body: {
        action: 'create_dns_records',
        zoneId: request.zoneId,
        records: records
      }
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw new Error(`Supabase function error: ${error.message}`);
    }

    console.log('DNS records created successfully:', data);
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
