
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, Users, Calendar, Globe } from 'lucide-react';

interface DailyVisit {
  visit_date: string;
  page_path: string;
  visit_count: number;
}

interface VisitorStats {
  total_visits: number;
  unique_visitors: number;
  last_visit_date: string;
}

interface RecentVisit {
  id: string;
  ip_address: string;
  page_path: string;
  referrer: string;
  visited_at: string;
  country: string;
  city: string;
}

const VisitorDashboard = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [dailyVisits, setDailyVisits] = useState<DailyVisit[]>([]);
  const [recentVisits, setRecentVisits] = useState<RecentVisit[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get overall stats
        const { data: statsData, error: statsError } = await supabase
          .from('visitor_stats')
          .select('*')
          .single();

        if (!statsError) {
          setStats(statsData);
        }

        // Get daily visit counts (last 7 days)
        const { data: dailyData, error: dailyError } = await supabase
          .from('daily_visit_counts')
          .select('*')
          .limit(7);

        if (!dailyError) {
          setDailyVisits(dailyData || []);
        }

        // Get recent visits (last 10)
        const { data: recentData, error: recentError } = await supabase
          .from('page_visits')
          .select('*')
          .order('visited_at', { ascending: false })
          .limit(10);

        if (!recentError) {
          setRecentVisits(recentData || []);
        }
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="p-6 space-y-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold">Visitor Dashboard</h1>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.total_visits || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.unique_visitors || 0}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Last Visit</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats?.last_visit_date ? new Date(stats.last_visit_date).toLocaleDateString() : 'N/A'}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Daily Visits Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Daily Visits (Last 7 Days)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {dailyVisits.map((day) => (
              <div key={`${day.visit_date}-${day.page_path}`} className="flex justify-between items-center">
                <span className="text-sm text-gray-600">
                  {new Date(day.visit_date).toLocaleDateString()} - {day.page_path}
                </span>
                <span className="font-medium">{day.visit_count} visits</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Visits */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Visits</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {recentVisits.map((visit) => (
              <div key={visit.id} className="flex justify-between items-center border-b pb-2">
                <div className="flex items-center gap-2">
                  <Globe className="h-4 w-4 text-gray-400" />
                  <span className="text-sm">
                    {visit.ip_address} - {visit.page_path}
                  </span>
                </div>
                <span className="text-xs text-gray-500">
                  {new Date(visit.visited_at).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default VisitorDashboard;
