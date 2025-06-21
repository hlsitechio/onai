
import React from 'react';
import { useOthers } from '@/lib/liveblocks';
import type { Editor } from '@tiptap/react';
import type { UserInfo } from '@/lib/liveblocks';

interface LiveCursorsProps {
  editor: Editor;
}

const LiveCursors: React.FC<LiveCursorsProps> = ({ editor }) => {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence }) => {
        if (!presence.cursor || !presence.user) return null;

        const user = presence.user as UserInfo;

        return (
          <div
            key={connectionId}
            className="absolute pointer-events-none z-50"
            style={{
              left: presence.cursor.x,
              top: presence.cursor.y,
            }}
          >
            {/* Cursor */}
            <div
              className="w-0.5 h-5 rounded-full"
              style={{ backgroundColor: user.color || '#000' }}
            />
            
            {/* User label */}
            <div
              className="absolute top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: user.color || '#000' }}
            >
              {user.name || 'Anonymous'}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LiveCursors;
