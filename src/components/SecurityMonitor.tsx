
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Shield, AlertTriangle, CheckCircle, Clock, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface SecurityIncident {
  id: string;
  incident_type: string;
  severity: string;
  created_at: string;
  resolved: boolean;
  details: Record<string, any>;
}

interface SecurityStats {
  totalIncidents: number;
  openIncidents: number;
  blockedContent: number;
  rateLimitExceeded: number;
  authFailures: number;
}

export function SecurityMonitor() {
  const { user } = useAuth();
  const [incidents, setIncidents] = useState<SecurityIncident[]>([]);
  const [stats, setStats] = useState<SecurityStats>({
    totalIncidents: 0,
    openIncidents: 0,
    blockedContent: 0,
    rateLimitExceeded: 0,
    authFailures: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      loadSecurityData();
    }
  }, [user]);

  const loadSecurityData = async () => {
    try {
      setIsLoading(true);
      
      // Load recent security incidents
      const { data: incidentsData } = await supabase
        .from('security_incidents')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);
      
      if (incidentsData) {
        setIncidents(incidentsData);
      }

      // Load security audit log stats
      const { data: auditData } = await supabase
        .from('security_audit_log')
        .select('action')
        .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString());
      
      if (auditData) {
        const stats = {
          totalIncidents: incidentsData?.length || 0,
          openIncidents: incidentsData?.filter(i => !i.resolved).length || 0,
          blockedContent: auditData.filter(a => a.action === 'content_blocked').length,
          rateLimitExceeded: auditData.filter(a => a.action === 'rate_limit_exceeded').length,
          authFailures: auditData.filter(a => a.action === 'auth_failure').length
        };
        setStats(stats);
      }
      
    } catch (error) {
      console.error('Error loading security data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const resolveIncident = async (incidentId: string) => {
    try {
      const { error } = await supabase
        .from('security_incidents')
        .update({ resolved: true })
        .eq('id', incidentId);
      
      if (!error) {
        setIncidents(prev => 
          prev.map(inc => 
            inc.id === incidentId ? { ...inc, resolved: true } : inc
          )
        );
      }
    } catch (error) {
      console.error('Error resolving incident:', error);
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high': return 'destructive';
      case 'medium': return 'default';
      case 'low': return 'secondary';
      default: return 'outline';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 animate-spin" />
          <span>Loading security data...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="w-6 h-6 text-blue-600" />
        <h2 className="text-2xl font-bold">Security Monitor</h2>
      </div>

      {/* Security Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalIncidents}</div>
            <p className="text-xs text-muted-foreground">Last 24 hours</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Open Incidents</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.openIncidents}</div>
            <p className="text-xs text-muted-foreground">Requiring attention</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blocked Content</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.blockedContent}</div>
            <p className="text-xs text-muted-foreground">XSS attempts blocked</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rate Limits</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.rateLimitExceeded}</div>
            <p className="text-xs text-muted-foreground">Exceeded limits</p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Security Incidents */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Security Incidents</CardTitle>
          <CardDescription>
            Latest security events and incidents that require attention
          </CardDescription>
        </CardHeader>
        <CardContent>
          {incidents.length === 0 ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground">No security incidents reported</p>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {incidents.map((incident) => (
                <div key={incident.id} className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(incident.severity)}>
                        {incident.severity.toUpperCase()}
                      </Badge>
                      <span className="font-medium">{incident.incident_type}</span>
                    </div>
                    {!incident.resolved && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => resolveIncident(incident.id)}
                      >
                        Resolve
                      </Button>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {new Date(incident.created_at).toLocaleString()}
                  </p>
                  {incident.details && Object.keys(incident.details).length > 0 && (
                    <div className="text-xs bg-muted p-2 rounded">
                      <pre>{JSON.stringify(incident.details, null, 2)}</pre>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
