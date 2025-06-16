import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Plus, RefreshCw, Globe, Settings, Zap } from 'lucide-react';
import { 
  getIonosDomains, 
  getIonosDnsRecords, 
  createIonosDnsRecord, 
  isValidDomain, 
  validateDnsRecordContent,
  type IonosDomain, 
  type IonosDnsRecord 
} from '@/utils/ionosService';
import DeploymentSettings from './DeploymentSettings';

const IonosIntegration = () => {
  const [domains, setDomains] = useState<IonosDomain[]>([]);
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [dnsRecords, setDnsRecords] = useState<IonosDnsRecord[]>([]);
  const [loading, setLoading] = useState({
    domains: false,
    records: false,
    creating: false
  });
  
  // Form state for creating new DNS record
  const [newRecord, setNewRecord] = useState({
    type: 'A',
    name: '',
    content: '',
    ttl: 3600,
    priority: 10
  });

  const { toast } = useToast();

  useEffect(() => {
    loadDomains();
  }, []);

  useEffect(() => {
    if (selectedDomain) {
      loadDnsRecords(selectedDomain);
    }
  }, [selectedDomain]);

  const loadDomains = async () => {
    setLoading(prev => ({ ...prev, domains: true }));
    try {
      const fetchedDomains = await getIonosDomains();
      setDomains(fetchedDomains);
      
      if (fetchedDomains.length > 0 && !selectedDomain) {
        setSelectedDomain(fetchedDomains[0].name);
      }
      
      toast({
        title: "Domains loaded",
        description: `Found ${fetchedDomains.length} domains`,
      });
    } catch (error) {
      console.error('Error loading domains:', error);
      toast({
        title: "Error loading domains",
        description: error instanceof Error ? error.message : "Failed to load domains",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, domains: false }));
    }
  };

  const loadDnsRecords = async (domain: string) => {
    setLoading(prev => ({ ...prev, records: true }));
    try {
      const records = await getIonosDnsRecords(domain);
      setDnsRecords(records);
      
      toast({
        title: "DNS records loaded",
        description: `Found ${records.length} DNS records for ${domain}`,
      });
    } catch (error) {
      console.error('Error loading DNS records:', error);
      toast({
        title: "Error loading DNS records",
        description: error instanceof Error ? error.message : "Failed to load DNS records",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, records: false }));
    }
  };

  const handleCreateRecord = async () => {
    if (!selectedDomain) {
      toast({
        title: "No domain selected",
        description: "Please select a domain first",
        variant: "destructive",
      });
      return;
    }

    if (!newRecord.name || !newRecord.content) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (!validateDnsRecordContent(newRecord.type, newRecord.content)) {
      toast({
        title: "Invalid content",
        description: `Invalid content for ${newRecord.type} record`,
        variant: "destructive",
      });
      return;
    }

    setLoading(prev => ({ ...prev, creating: true }));
    try {
      await createIonosDnsRecord({
        domain: selectedDomain,
        recordType: newRecord.type,
        name: newRecord.name,
        content: newRecord.content,
        ttl: newRecord.ttl,
        priority: newRecord.type === 'MX' ? newRecord.priority : undefined
      });

      toast({
        title: "DNS record created",
        description: `${newRecord.type} record created successfully`,
      });

      // Reset form
      setNewRecord({
        type: 'A',
        name: '',
        content: '',
        ttl: 3600,
        priority: 10
      });

      // Reload DNS records
      loadDnsRecords(selectedDomain);
    } catch (error) {
      console.error('Error creating DNS record:', error);
      toast({
        title: "Error creating DNS record",
        description: error instanceof Error ? error.message : "Failed to create DNS record",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, creating: false }));
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3 mb-6">
        <Globe className="h-8 w-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">IONOS Integration</h1>
          <p className="text-gray-600">Manage your IONOS domains and DNS records</p>
        </div>
      </div>

      <Tabs defaultValue="domains" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="domains" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Domain Management
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Deployment Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="domains" className="space-y-6">
          {/* Domains Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    Domains
                  </CardTitle>
                  <CardDescription>Select a domain to manage its DNS records</CardDescription>
                </div>
                <Button onClick={loadDomains} disabled={loading.domains} variant="outline">
                  {loading.domains ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {domains.length > 0 ? (
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.name}>
                        {domain.name} ({domain.status})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-500">
                  {loading.domains ? 'Loading domains...' : 'No domains found'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Create DNS Record Section */}
          {selectedDomain && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create DNS Record for {selectedDomain}
                </CardTitle>
                <CardDescription>Add a new DNS record to your domain</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="record-type">Record Type</Label>
                    <Select value={newRecord.type} onValueChange={(value) => setNewRecord(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="A">A (IPv4 Address)</SelectItem>
                        <SelectItem value="AAAA">AAAA (IPv6 Address)</SelectItem>
                        <SelectItem value="CNAME">CNAME (Canonical Name)</SelectItem>
                        <SelectItem value="MX">MX (Mail Exchange)</SelectItem>
                        <SelectItem value="TXT">TXT (Text Record)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="record-name">Name</Label>
                    <Input
                      id="record-name"
                      value={newRecord.name}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="www, mail, @"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="record-content">Content</Label>
                    <Input
                      id="record-content"
                      value={newRecord.content}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, content: e.target.value }))}
                      placeholder={
                        newRecord.type === 'A' ? '192.168.1.1' :
                        newRecord.type === 'CNAME' ? 'example.com' :
                        newRecord.type === 'MX' ? 'mail.example.com' :
                        newRecord.type === 'TXT' ? 'Text content' :
                        'Record content'
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="record-ttl">TTL (seconds)</Label>
                    <Input
                      id="record-ttl"
                      type="number"
                      value={newRecord.ttl}
                      onChange={(e) => setNewRecord(prev => ({ ...prev, ttl: parseInt(e.target.value) || 3600 }))}
                      min="300"
                      max="86400"
                    />
                  </div>

                  {newRecord.type === 'MX' && (
                    <div className="space-y-2 md:col-span-2">
                      <Label htmlFor="record-priority">Priority</Label>
                      <Input
                        id="record-priority"
                        type="number"
                        value={newRecord.priority}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, priority: parseInt(e.target.value) || 10 }))}
                        min="0"
                        max="65535"
                      />
                    </div>
                  )}
                </div>

                <Button onClick={handleCreateRecord} disabled={loading.creating} className="w-full">
                  {loading.creating ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                  Create DNS Record
                </Button>
              </CardContent>
            </Card>
          )}

          {/* DNS Records List */}
          {selectedDomain && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>DNS Records for {selectedDomain}</CardTitle>
                    <CardDescription>Current DNS configuration</CardDescription>
                  </div>
                  <Button onClick={() => loadDnsRecords(selectedDomain)} disabled={loading.records} variant="outline">
                    {loading.records ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                    Refresh
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                {loading.records ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin mr-2" />
                    Loading DNS records...
                  </div>
                ) : dnsRecords.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-200 rounded-lg">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-200 px-4 py-2 text-left">Type</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Name</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Content</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">TTL</th>
                          <th className="border border-gray-200 px-4 py-2 text-left">Priority</th>
                        </tr>
                      </thead>
                      <tbody>
                        {dnsRecords.map((record) => (
                          <tr key={record.id} className="hover:bg-gray-50">
                            <td className="border border-gray-200 px-4 py-2 font-mono">{record.type}</td>
                            <td className="border border-gray-200 px-4 py-2">{record.name}</td>
                            <td className="border border-gray-200 px-4 py-2 break-all">{record.content}</td>
                            <td className="border border-gray-200 px-4 py-2">{record.ttl}</td>
                            <td className="border border-gray-200 px-4 py-2">{record.priority || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No DNS records found for this domain</p>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="deployment">
          <DeploymentSettings />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default IonosIntegration;
