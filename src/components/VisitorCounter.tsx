
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Users } from 'lucide-react';

interface VisitorStats {
  total_visits: number;
  unique_visitors: number;
  last_visit_date: string;
}

const VisitorCounter = () => {
  const [stats, setStats] = useState<VisitorStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Track this visit
    const trackVisit = async () => {
      try {
        const { data, error } = await supabase.functions.invoke('track-visit', {
          body: {
            page_path: window.location.pathname,
            referrer: document.referrer || undefined,
            user_agent: navigator.userAgent
          }
        });

        if (error) {
          console.error('Error tracking visit:', error);
        } else {
          console.log('Visit tracked successfully:', data);
        }
      } catch (error) {
        console.error('Error calling track-visit function:', error);
      }
    };

    // Get visitor stats
    const getStats = async () => {
      try {
        const { data, error } = await supabase
          .from('visitor_stats')
          .select('*')
          .single();

        if (error) {
          console.error('Error fetching stats:', error);
        } else {
          setStats(data);
        }
      } catch (error) {
        console.error('Error getting visitor stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    trackVisit();
    getStats();

    // Set up real-time subscription for stats updates
    const channel = supabase
      .channel('visitor-stats-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'page_visits'
        },
        () => {
          // Refresh stats when new visit is recorded
          getStats();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (isLoading) {
    return (
      <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/10 shadow-lg">
        <div className="flex items-center gap-2">
          <div className="animate-pulse w-4 h-4 bg-gray-400 rounded"></div>
          <span className="text-sm">Loading stats...</span>
        </div>
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 bg-black/80 backdrop-blur-sm text-white px-4 py-2 rounded-lg border border-white/10 shadow-lg z-50">
      <div className="flex items-center gap-4 text-sm">
        <div className="flex items-center gap-1">
          <Eye className="w-4 h-4 text-green-400" />
          <span>{stats.total_visits} visits</span>
        </div>
        <div className="flex items-center gap-1">
          <Users className="w-4 h-4 text-blue-400" />
          <span>{stats.unique_visitors} unique</span>
        </div>
      </div>
    </div>
  );
};

export default VisitorCounter;
