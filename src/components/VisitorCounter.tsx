
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';

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
        }
        // Removed console.log for successful tracking
      } catch (error) {
        console.error('Error calling track-visit function:', error);
      }
    };

    // Get visitor stats (for internal tracking only)
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
          // Removed console.log for visitor stats
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

  // Return null to completely hide the widget from users
  return null;
};

export default VisitorCounter;
