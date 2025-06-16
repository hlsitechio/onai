
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Activity, Clock, AlertTriangle } from 'lucide-react';

interface DeployHookAnalyticsProps {
  deployHooks: any[];
}

const DeployHookAnalytics: React.FC<DeployHookAnalyticsProps> = ({ deployHooks }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('7d');
  const [analyticsData, setAnalyticsData] = useState<any[]>([]);

  // Generate mock analytics data based on deploy hooks
  useEffect(() => {
    const generateAnalyticsData = () => {
      const days = selectedPeriod === '7d' ? 7 : selectedPeriod === '30d' ? 30 : 1;
      const data = [];
      
      for (let i = days - 1; i >= 0; i--) {
        const date = new Date();
        date.setDate(date.getDate() - i);
        
        data.push({
          date: date.toLocaleDateString(),
          triggers: Math.floor(Math.random() * 10) + 1,
          successRate: Math.floor(Math.random() * 20) + 80,
          avgResponseTime: Math.floor(Math.random() * 1000) + 500,
          failures: Math.floor(Math.random() * 3),
        });
      }
      
      setAnalyticsData(data);
    };

    generateAnalyticsData();
  }, [selectedPeriod, deployHooks]);

  const totalTriggers = analyticsData.reduce((sum, day) => sum + day.triggers, 0);
  const avgSuccessRate = analyticsData.reduce((sum, day) => sum + day.successRate, 0) / analyticsData.length;
  const avgResponseTime = analyticsData.reduce((sum, day) => sum + day.avgResponseTime, 0) / analyticsData.length;
  const totalFailures = analyticsData.reduce((sum, day) => sum + day.failures, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold text-white">Deploy Hook Analytics</h3>
          <p className="text-sm text-gray-400">Performance metrics and usage statistics</p>
        </div>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger className="w-32 bg-white/5 border-white/10 text-white">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1d">Last 24h</SelectItem>
            <SelectItem value="7d">Last 7 days</SelectItem>
            <SelectItem value="30d">Last 30 days</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Total Triggers</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalTriggers}</div>
            <p className="text-xs text-gray-400">+12% from last period</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Success Rate</CardTitle>
            <Activity className="h-4 w-4 text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgSuccessRate.toFixed(1)}%</div>
            <p className="text-xs text-gray-400">+2.1% from last period</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Avg Response</CardTitle>
            <Clock className="h-4 w-4 text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{avgResponseTime.toFixed(0)}ms</div>
            <p className="text-xs text-gray-400">-15ms from last period</p>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-white">Failures</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{totalFailures}</div>
            <p className="text-xs text-gray-400">-3 from last period</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Trigger Frequency</CardTitle>
            <CardDescription className="text-gray-400">Daily webhook triggers</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="triggers" 
                  stroke="#3B82F6" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white">Success Rate</CardTitle>
            <CardDescription className="text-gray-400">Daily success percentage</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={analyticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="date" 
                  stroke="#9CA3AF"
                  fontSize={12}
                />
                <YAxis stroke="#9CA3AF" fontSize={12} />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: '1px solid #374151',
                    borderRadius: '8px'
                  }}
                />
                <Bar 
                  dataKey="successRate" 
                  fill="#10B981"
                />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Hook Performance Table */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Hook Performance</CardTitle>
          <CardDescription className="text-gray-400">Individual hook statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {deployHooks.map((hook) => (
              <div
                key={hook.id}
                className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
              >
                <div>
                  <p className="text-white font-medium">{hook.hook_name}</p>
                  <p className="text-sm text-gray-400">Branch: {hook.branch}</p>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-center">
                    <p className="text-sm text-white">{hook.trigger_count || 0}</p>
                    <p className="text-xs text-gray-400">Triggers</p>
                  </div>
                  <Badge 
                    variant="outline" 
                    className={`${
                      hook.is_active 
                        ? 'text-green-400 border-green-400' 
                        : 'text-red-400 border-red-400'
                    }`}
                  >
                    {hook.is_active ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeployHookAnalytics;
