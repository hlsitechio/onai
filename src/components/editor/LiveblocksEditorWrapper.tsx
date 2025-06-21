
import React from 'react';
import { RoomProvider } from '@/lib/liveblocks';
import CollaborativeTiptapEditor from './CollaborativeTiptapEditor';
import { ClientSideSuspense } from '@liveblocks/react';

interface LiveblocksEditorWrapperProps {
  content: string;
  setContent: (content: string) => void;
  isFocusMode?: boolean;
  roomId?: string;
}

const LiveblocksEditorWrapper: React.FC<LiveblocksEditorWrapperProps> = ({
  content,
  setContent,
  isFocusMode = false,
  roomId = 'default-room'
}) => {
  return (
    <RoomProvider id={roomId} initialPresence={{ cursor: null }}>
      <ClientSideSuspense fallback={
        <div className="h-full flex items-center justify-center bg-black/20 rounded-lg">
          <div className="text-center space-y-4">
            <div className="w-6 h-6 border-2 border-noteflow-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-gray-400 text-sm">Connecting to collaboration room...</p>
          </div>
        </div>
      }>
        <CollaborativeTiptapEditor
          content={content}
          setContent={setContent}
          isFocusMode={isFocusMode}
          roomId={roomId}
        />
      </ClientSideSuspense>
    </RoomProvider>
  );
};

export default LiveblocksEditorWrapper;
