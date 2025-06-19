
import { supabase } from '@/integrations/supabase/client';

export interface SecurityIncident {
  incident_type: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  details?: any;
}

export const logSecurityIncident = async (incident: SecurityIncident) => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'log_incident',
        incidentType: incident.incident_type,
        severity: incident.severity,
        details: incident.details
      })
    });

    if (error) {
      console.error('Failed to log security incident:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Error logging security incident:', error);
    return false;
  }
};

export const checkForeignTableSecurity = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'check_foreign_tables'
      })
    });

    if (error) {
      console.error('Failed to check foreign table security:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error checking foreign table security:', error);
    return null;
  }
};

export const getSecurityStatus = async () => {
  try {
    const { data, error } = await supabase.functions.invoke('security-monitor', {
      body: JSON.stringify({
        action: 'get_security_status'
      })
    });

    if (error) {
      console.error('Failed to get security status:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error getting security status:', error);
    return null;
  }
};
