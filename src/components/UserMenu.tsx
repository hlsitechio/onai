
import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useUserRole } from '@/hooks/useUserRole';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { LogOut, Settings, Shield, BarChart3 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import SettingsDialog from './settings/OptimizedSettingsDialog';

const UserMenu = () => {
  const { user, signOut } = useAuth();
  const { isAdmin, role, loading } = useUserRole();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Debug logging
  console.log('UserMenu Debug:', {
    user: user?.email,
    role,
    isAdmin,
    loading,
    userId: user?.id
  });

  const handleSignOut = async () => {
    try {
      await signOut();
      toast({
        title: 'Signed out',
        description: 'You have been signed out successfully.',
      });
    } catch (error) {
      toast({
        title: 'Sign out failed',
        description: 'An error occurred while signing out.',
        variant: 'destructive',
      });
    }
  };

  const handleErrorDashboard = () => {
    console.log('Navigating to error dashboard');
    navigate('/error-dashboard');
  };

  if (!user) return null;

  const getInitials = (email: string) => {
    return email.charAt(0).toUpperCase();
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarFallback className="bg-noteflow-500 text-white">
                {getInitials(user.email || 'U')}
              </AvatarFallback>
            </Avatar>
            {isAdmin && (
              <Badge 
                variant="secondary" 
                className="absolute -top-1 -right-1 h-4 w-4 p-0 bg-yellow-500 text-yellow-900"
              >
                <Shield className="h-2 w-2" />
              </Badge>
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 bg-black/90 border-white/10" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <div className="flex items-center space-x-2">
                <p className="text-sm font-medium leading-none text-white">Account</p>
                {isAdmin && (
                  <Badge variant="secondary" className="bg-yellow-500/20 text-yellow-400 text-xs">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-xs leading-none text-gray-400">
                {user.email}
              </p>
              {/* Debug info - remove this after testing */}
              <p className="text-xs leading-none text-gray-500">
                Role: {role || 'loading...'} | Admin: {isAdmin ? 'Yes' : 'No'}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="text-gray-300 hover:text-white hover:bg-white/10"
            onClick={() => setIsSettingsOpen(true)}
          >
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          {/* Show Error Dashboard for admin users */}
          {isAdmin && (
            <DropdownMenuItem 
              className="text-gray-300 hover:text-white hover:bg-white/10"
              onClick={handleErrorDashboard}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Error Dashboard</span>
            </DropdownMenuItem>
          )}
          {/* Debug: Always show dashboard for testing - remove this after confirming it works */}
          {user.email === 'hlarosesurprenant@gmail.com' && !isAdmin && (
            <DropdownMenuItem 
              className="text-orange-300 hover:text-orange-200 hover:bg-orange-500/10"
              onClick={handleErrorDashboard}
            >
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Error Dashboard (Debug)</span>
            </DropdownMenuItem>
          )}
          <DropdownMenuSeparator className="bg-white/10" />
          <DropdownMenuItem 
            className="text-red-400 hover:text-red-300 hover:bg-red-500/10"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            <span>Sign out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <SettingsDialog 
        open={isSettingsOpen} 
        onOpenChange={setIsSettingsOpen} 
      />
    </>
  );
};

export default UserMenu;
