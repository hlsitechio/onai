
import React from 'react';
import { RoomProvider } from '@/lib/liveblocks';
import CollaborativeTiptapEditor from './CollaborativeTiptapEditor';
import EnhancedTiptapEditor from './EnhancedTiptapEditor';
import { ClientSideSuspense } from '@liveblocks/react';

interface LiveblocksEditorWrapperProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  roomId?: string;
  enhanced?: boolean; // New prop for enhanced features without full collaboration
}

const LiveblocksEditorWrapper: React.FC<LiveblocksEditorWrapperProps> = ({
  content,
  setContent,
  isFocusMode = false,
  roomId = 'default-room',
  enhanced = false
}) => {
  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={
        <div className="h-full flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-6 h-6 border-2 border-noteflow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm">
              {enhanced ? 'Loading enhanced editor...' : 'Connecting to collaboration room...'}
            </p>
          </div>
        </div>
      }>
        {enhanced ? (
          <EnhancedTiptapEditor
            content={content}
            setContent={setContent}
            isFocusMode={isFocusMode}
            roomId={roomId}
          />
        ) : (
          <CollaborativeTiptapEditor
            content={content}
            setContent={setContent}
            isFocusMode={isFocusMode}
            roomId={roomId}
          />
        )}
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default LiveblocksEditorWrapper;
