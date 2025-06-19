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
  getIonosZones, 
  getIonosDnsRecords, 
  createIonosDnsRecord, 
  isValidDomain, 
  validateDnsRecordContent,
  type IonosZone, 
  type IonosDnsRecord 
} from '@/utils/ionosService';
import DeploymentSettings from './DeploymentSettings';
import QuickSetup from './QuickSetup';

const IonosIntegration = () => {
  const [zones, setZones] = useState<IonosZone[]>([]);
  const [selectedZone, setSelectedZone] = useState<string>('');
  const [dnsRecords, setDnsRecords] = useState<IonosDnsRecord[]>([]);
  const [loading, setLoading] = useState({
    zones: false,
    records: false,
    creating: false
  });
  
  // Form state for creating new DNS record
  const [newRecord, setNewRecord] = useState({
    type: 'A',
    name: '',
    content: '',
    ttl: 3600,
    prio: 10
  });

  const { toast } = useToast();

  useEffect(() => {
    loadZones();
  }, []);

  useEffect(() => {
    if (selectedZone) {
      loadDnsRecords(selectedZone);
    }
  }, [selectedZone]);

  const loadZones = async () => {
    setLoading(prev => ({ ...prev, zones: true }));
    try {
      const fetchedZones = await getIonosZones();
      setZones(fetchedZones);
      
      if (fetchedZones.length > 0 && !selectedZone) {
        setSelectedZone(fetchedZones[0].id);
      }
      
      toast({
        title: "Zones loaded",
        description: `Found ${fetchedZones.length} zones`,
      });
    } catch (error) {
      console.error('Error loading zones:', error);
      toast({
        title: "Error loading zones",
        description: error instanceof Error ? error.message : "Failed to load zones",
        variant: "destructive",
      });
    } finally {
      setLoading(prev => ({ ...prev, zones: false }));
    }
  };

  const loadDnsRecords = async (zoneId: string) => {
    setLoading(prev => ({ ...prev, records: true }));
    try {
      const records = await getIonosDnsRecords(zoneId);
      setDnsRecords(records);
      
      const zoneName = zones.find(z => z.id === zoneId)?.name || zoneId;
      toast({
        title: "DNS records loaded",
        description: `Found ${records.length} DNS records for ${zoneName}`,
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
    if (!selectedZone) {
      toast({
        title: "No zone selected",
        description: "Please select a zone first",
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
        zoneId: selectedZone,
        recordType: newRecord.type,
        name: newRecord.name,
        content: newRecord.content,
        ttl: newRecord.ttl,
        prio: newRecord.type === 'MX' ? newRecord.prio : undefined
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
        prio: 10
      });

      // Reload DNS records
      loadDnsRecords(selectedZone);
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
          <p className="text-gray-600">Manage your IONOS DNS zones and records</p>
        </div>
      </div>

      {/* Quick Setup Section */}
      <QuickSetup />

      <Tabs defaultValue="zones" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="zones" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Zone Management
          </TabsTrigger>
          <TabsTrigger value="deployment" className="flex items-center gap-2">
            <Zap className="h-4 w-4" />
            Deployment Automation
          </TabsTrigger>
        </TabsList>

        <TabsContent value="zones" className="space-y-6">
          {/* Zones Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="h-5 w-5" />
                    DNS Zones
                  </CardTitle>
                  <CardDescription>Select a zone to manage its DNS records</CardDescription>
                </div>
                <Button onClick={loadZones} disabled={loading.zones} variant="outline">
                  {loading.zones ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                  Refresh
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {zones.length > 0 ? (
                <Select value={selectedZone} onValueChange={setSelectedZone}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a zone" />
                  </SelectTrigger>
                  <SelectContent>
                    {zones.map((zone) => (
                      <SelectItem key={zone.id} value={zone.id}>
                        {zone.name} ({zone.type})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <p className="text-gray-500">
                  {loading.zones ? 'Loading zones...' : 'No zones found'}
                </p>
              )}
            </CardContent>
          </Card>

          {/* Create DNS Record Section */}
          {selectedZone && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Create DNS Record for {zones.find(z => z.id === selectedZone)?.name}
                </CardTitle>
                <CardDescription>Add a new DNS record to your zone</CardDescription>
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
                      placeholder="www, mail, or full domain name"
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
                        value={newRecord.prio}
                        onChange={(e) => setNewRecord(prev => ({ ...prev, prio: parseInt(e.target.value) || 10 }))}
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
          {selectedZone && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>DNS Records for {zones.find(z => z.id === selectedZone)?.name}</CardTitle>
                    <CardDescription>Current DNS configuration</CardDescription>
                  </div>
                  <Button onClick={() => loadDnsRecords(selectedZone)} disabled={loading.records} variant="outline">
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
                            <td className="border border-gray-200 px-4 py-2">{record.prio || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="text-gray-500 text-center py-8">No DNS records found for this zone</p>
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
