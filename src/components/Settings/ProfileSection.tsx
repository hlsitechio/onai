
import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

const ProfileSection: React.FC = () => {
  const { user } = useAuth();

  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Profile</h3>
          
          <div className="flex gap-6">
            <Avatar className="w-16 h-16">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="space-y-3 flex-1">
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Full Name</label>
                <Input defaultValue={user?.name} className="rounded-lg" />
              </div>
              <div>
                <label className="text-sm text-gray-600 dark:text-gray-400 mb-1 block">Email</label>
                <Input defaultValue={user?.email} className="rounded-lg" />
              </div>
            </div>
          </div>

          <Button size="sm" className="self-start">
            Update Profile
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProfileSection;
