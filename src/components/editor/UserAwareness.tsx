
import React from 'react';
import { useOthers, useSelf } from '@/lib/liveblocks';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const UserAwareness: React.FC = () => {
  const others = useOthers();
  const currentUser = useSelf();

  const allUsers = [
    ...(currentUser ? [{ ...currentUser, isCurrentUser: true }] : []),
    ...others.map(user => ({ ...user, isCurrentUser: false }))
  ];

  if (allUsers.length <= 1) return null;

  return (
    <div className="absolute top-4 right-4 z-50 flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full p-2">
      <div className="flex -space-x-2">
        {allUsers.slice(0, 5).map((user, index) => {
          const userInfo = user.info?.user;
          const initials = userInfo?.name ? userInfo.name.slice(0, 2).toUpperCase() : 'U';
          
          return (
            <Avatar
              key={user.isCurrentUser ? 'current' : user.connectionId}
              className="w-8 h-8 border-2 border-white"
              style={{ borderColor: userInfo?.color || '#ccc' }}
            >
              <AvatarFallback
                className="text-xs font-medium text-white"
                style={{ backgroundColor: userInfo?.color || '#666' }}
              >
                {initials}
              </AvatarFallback>
            </Avatar>
          );
        })}
      </div>
      
      {allUsers.length > 5 && (
        <span className="text-xs text-gray-300 ml-2">
          +{allUsers.length - 5} more
        </span>
      )}
      
      <div className="flex items-center gap-1 ml-2">
        <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        <span className="text-xs text-gray-300">Live</span>
      </div>
    </div>
  );
};

export default UserAwareness;
