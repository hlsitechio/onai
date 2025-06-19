
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
 * Get all zones from IONOS
 */
export const getIonosZones = async (): Promise<IonosZone[]> => {
  try {
    const apiKey = await getIonosApiKey();
    
    const response = await fetch('https://api.hosting.ionos.com/dns/v1/zones', {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IONOS zones API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText
      });
      throw new Error(`IONOS API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Zones API response:', {
      status: response.status,
      dataType: typeof data,
      dataLength: Array.isArray(data) ? data.length : 'not array',
      firstZone: Array.isArray(data) && data.length > 0 ? data[0] : null
    });

    return data || [];
  } catch (error) {
    console.error('Error fetching IONOS zones:', error);
    throw error;
  }
};

/**
 * Get DNS records for a specific zone (returns customer-zone object)
 */
export const getIonosDnsRecords = async (zoneId: string): Promise<IonosDnsRecord[]> => {
  try {
    const apiKey = await getIonosApiKey();
    
    const response = await fetch(`https://api.hosting.ionos.com/dns/v1/zones/${zoneId}`, {
      headers: {
        'X-API-Key': apiKey,
        'Accept': 'application/json'
      }
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IONOS zone records API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        zoneId
      });
      throw new Error(`IONOS API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('Zone records API response:', {
      status: response.status,
      zoneId,
      dataType: typeof data,
      hasRecords: data?.records ? data.records.length : 'no records field',
      zoneInfo: {
        id: data?.id,
        name: data?.name,
        type: data?.type
      }
    });

    // The API returns a customer-zone object with records array
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
    const apiKey = await getIonosApiKey();
    
    const records = [{
      name: request.name,
      type: request.recordType,
      content: request.content,
      ttl: request.ttl || 3600,
      prio: request.prio || 0,
      disabled: false
    }];

    console.log('Creating DNS records for zone:', request.zoneId, 'Records:', records);

    const response = await fetch(`https://api.hosting.ionos.com/dns/v1/zones/${request.zoneId}/records`, {
      method: 'POST',
      headers: {
        'X-API-Key': apiKey,
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(records)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('IONOS create DNS records API error:', {
        status: response.status,
        statusText: response.statusText,
        body: errorText,
        zoneId: request.zoneId,
        records
      });
      throw new Error(`IONOS API error: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('DNS records created successfully:', {
      status: response.status,
      responseData: data
    });

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
