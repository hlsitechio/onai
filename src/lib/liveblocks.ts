
import { createClient } from "@liveblocks/client";
import { createRoomContext } from "@liveblocks/react";

// Create the Liveblocks client
const client = createClient({
  // For development, you can use the public key
  // In production, you'll need to implement authentication
  publicApiKey: "pk_dev_your-public-key-here", // Replace with your actual key
  
  // Optional: Add throttle to reduce network requests
  throttle: 16,
});

// Define user info interface that's JSON serializable
export interface UserInfo {
  name: string;
  avatar?: string;
  color: string;
  [key: string]: string | undefined; // Index signature for JSON compatibility
}

// Define presence and storage types for TypeScript
type Presence = {
  cursor: { x: number; y: number } | null;
  user?: UserInfo;
  [key: string]: any; // Index signature for JSON compatibility
};

type Storage = {
  // We'll use this for non-collaborative features
  userPreferences?: {
    theme?: string;
    fontSize?: number;
    [key: string]: any;
  };
};

// Create the room context
export const {
  suspense: {
    RoomProvider,
    useRoom,
    useMyPresence,
    useOthers,
    useSelf,
    useStorage,
    useMutation,
  },
} = createRoomContext<Presence, Storage>(client);

// Export the client for direct use if needed
export { client };

// Helper function to generate random colors for users
export const generateUserColor = () => {
  const colors = [
    "#FF6B6B", "#4ECDC4", "#45B7D1", "#96CEB4", "#FFEAA7",
    "#DDA0DD", "#98D8C8", "#F7DC6F", "#BB8FCE", "#85C1E9"
  ];
  return colors[Math.floor(Math.random() * colors.length)];
};

// Helper function to generate user info
export const generateUserInfo = (): UserInfo => ({
  name: `User ${Math.floor(Math.random() * 1000)}`,
  color: generateUserColor(),
});
