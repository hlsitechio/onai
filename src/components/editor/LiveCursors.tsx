
import React from 'react';
import { useOthers } from '@/lib/liveblocks';
import type { Editor } from '@tiptap/react';

interface LiveCursorsProps {
  editor: Editor;
}

const LiveCursors: React.FC<LiveCursorsProps> = ({ editor }) => {
  const others = useOthers();

  return (
    <>
      {others.map(({ connectionId, presence, info }) => {
        if (!presence.cursor || !info) return null;

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
              style={{ backgroundColor: info.user?.color || '#000' }}
            />
            
            {/* User label */}
            <div
              className="absolute top-6 left-0 px-2 py-1 text-xs text-white rounded whitespace-nowrap"
              style={{ backgroundColor: info.user?.color || '#000' }}
            >
              {info.user?.name || 'Anonymous'}
            </div>
          </div>
        );
      })}
    </>
  );
};

export default LiveCursors;
