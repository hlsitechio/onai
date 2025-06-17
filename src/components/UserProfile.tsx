
import React, { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Loader2, User, Mail, AlertCircle } from 'lucide-react';

interface UserProfile {
  id: string;
  email: string;
  display_name: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

const UserProfile: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      loadProfile();
    } else {
      setLoading(false);
      setError('No user session found');
    }
  }, [user]);

  const loadProfile = async () => {
    if (!user) return;

    try {
      setError(null);
      const { data, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }

      if (data) {
        setProfile(data);
        setDisplayName(data.display_name || '');
      } else {
        // Create profile if it doesn't exist
        const newProfile = {
          id: user.id,
          email: user.email || '',
          display_name: user.email?.split('@')[0] || 'User',
        };

        const { data: createdProfile, error: createError } = await supabase
          .from('user_profiles')
          .insert(newProfile)
          .select()
          .single();

        if (createError) throw createError;

        setProfile(createdProfile);
        setDisplayName(createdProfile.display_name || '');
        
        toast({
          title: 'Profile created',
          description: 'Your profile has been created successfully.',
        });
      }
    } catch (error) {
      console.error('Error loading profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: 'Error loading profile',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const saveProfile = async () => {
    if (!user || !profile) return;

    try {
      setSaving(true);
      setError(null);
      
      const { error } = await supabase
        .from('user_profiles')
        .update({
          display_name: displayName.trim(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', user.id);

      if (error) throw error;

      setProfile(prev => prev ? { ...prev, display_name: displayName.trim() } : null);

      toast({
        title: 'Profile updated',
        description: 'Your profile has been updated successfully.',
      });
    } catch (error) {
      console.error('Error saving profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      setError(errorMessage);
      toast({
        title: 'Error saving profile',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-red-400 mx-auto mb-4" />
        <p className="text-red-400 mb-4">{error}</p>
        <Button onClick={loadProfile} variant="outline" className="border-white/10">
          Try Again
        </Button>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="text-center p-8">
        <AlertCircle className="h-12 w-12 text-yellow-400 mx-auto mb-4" />
        <p className="text-gray-400 mb-4">Unable to load profile</p>
        <Button onClick={loadProfile} className="bg-noteflow-500 hover:bg-noteflow-600">
          Retry Loading Profile
        </Button>
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto bg-black/40 border-white/10">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-noteflow-500 text-white text-lg">
              {getInitials(profile.display_name || profile.email)}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-white">User Profile</CardTitle>
        <CardDescription className="text-gray-400">
          Manage your account information
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email" className="text-gray-300 flex items-center">
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Label>
          <Input
            id="email"
            type="email"
            value={profile.email}
            disabled
            className="bg-white/5 border-white/10 text-gray-400"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="displayName" className="text-gray-300 flex items-center">
            <User className="h-4 w-4 mr-2" />
            Display Name
          </Label>
          <Input
            id="displayName"
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            placeholder="Enter your display name"
            className="bg-white/5 border-white/10 text-white"
            maxLength={50}
          />
        </div>

        <Button
          onClick={saveProfile}
          disabled={saving || displayName.trim() === profile.display_name || !displayName.trim()}
          className="w-full bg-noteflow-500 hover:bg-noteflow-600"
        >
          {saving ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>

        <div className="text-xs text-gray-500 text-center">
          Member since {new Date(profile.created_at).toLocaleDateString()}
        </div>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
