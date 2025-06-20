
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

export type UserRole = 'admin' | 'user' | null;

export const useUserRole = () => {
  const { user } = useAuth();
  const [role, setRole] = useState<UserRole>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserRole = async () => {
      if (!user) {
        console.log('useUserRole: No user found');
        setRole(null);
        setLoading(false);
        return;
      }

      console.log('useUserRole: Fetching role for user:', user.email, user.id);

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .single();

        console.log('useUserRole: Supabase response:', { data, error });

        if (error) {
          console.error('Error fetching user role:', error);
          // Check if it's a "no rows" error
          if (error.code === 'PGRST116') {
            console.log('useUserRole: No role found, defaulting to user');
            setRole('user');
          } else {
            setRole('user'); // Default to user role if error
          }
        } else {
          console.log('useUserRole: Setting role to:', data?.role);
          setRole(data?.role || 'user');
        }
      } catch (error) {
        console.error('Error fetching user role:', error);
        setRole('user');
      } finally {
        setLoading(false);
      }
    };

    fetchUserRole();
  }, [user]);

  const isAdmin = role === 'admin';
  const isUser = role === 'user';

  console.log('useUserRole: Current state:', { role, isAdmin, isUser, loading });

  return {
    role,
    loading,
    isAdmin,
    isUser,
  };
};
