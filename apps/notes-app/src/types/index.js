// Core type definitions for OneAI Notes

export interface User {
  id: string;
  email: string;
  name?: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
  preferences: UserPreferences;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  editor_type: 'tiptap' | 'textarea';
  auto_save: boolean;
  focus_mode: boolean;
  ai_enabled: boolean;
  language: string;
  font_size: 'small' | 'medium' | 'large';
  line_height: 'compact' | 'normal' | 'relaxed';
}

export interface Note {
  id: string;
  title: string;
  content: string;
  content_encrypted?: string;
  tags: string[];
  folder_id?: string;
  user_id: string;
  is_shared: boolean;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  last_edited_by?: string;
  version: number;
  metadata: NoteMetadata;
}

export interface NoteMetadata {
  word_count: number;
  character_count: number;
  reading_time: number;
  ai_generated: boolean;
  ai_model?: string;
  language?: string;
  sentiment?: 'positive' | 'negative' | 'neutral';
  topics?: string[];
}

export interface Folder {
  id: string;
  name: string;
  color?: string;
  icon?: string;
  parent_id?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  note_count: number;
}

export interface SharedNote {
  id: string;
  note_id: string;
  shared_by: string;
  shared_with?: string;
  share_token: string;
  permissions: SharePermissions;
  expires_at?: string;
  created_at: string;
}

export interface SharePermissions {
  can_read: boolean;
  can_write: boolean;
  can_comment: boolean;
  can_share: boolean;
}

export interface AIAgent {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  model: 'gemini-2.5-flash' | 'gpt-4' | 'claude-3';
  system_prompt: string;
  temperature: number;
  max_tokens: number;
  enabled: boolean;
}

export interface AIRequest {
  id: string;
  user_id: string;
  agent_id: string;
  prompt: string;
  response?: string;
  tokens_used: number;
  processing_time: number;
  created_at: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
}

export interface EditorState {
  content: string;
  selection?: {
    from: number;
    to: number;
  };
  focus: boolean;
  mode: 'edit' | 'preview' | 'focus';
  dirty: boolean;
  last_saved: string;
}

export interface StorageConfig {
  type: 'indexeddb' | 'chrome' | 'localstorage';
  encryption_enabled: boolean;
  auto_backup: boolean;
  sync_enabled: boolean;
}

export interface EncryptionKey {
  id: string;
  key: CryptoKey;
  algorithm: string;
  created_at: string;
  last_used: string;
}

export interface SyncStatus {
  last_sync: string;
  pending_changes: number;
  sync_in_progress: boolean;
  conflicts: SyncConflict[];
}

export interface SyncConflict {
  note_id: string;
  local_version: number;
  remote_version: number;
  conflict_type: 'content' | 'metadata' | 'deletion';
  resolved: boolean;
}

export interface AppConfig {
  app_name: string;
  version: string;
  api_base_url: string;
  features: FeatureFlags;
  limits: AppLimits;
}

export interface FeatureFlags {
  ai_enabled: boolean;
  collaboration: boolean;
  offline_mode: boolean;
  pwa: boolean;
  encryption: boolean;
  real_time_sync: boolean;
}

export interface AppLimits {
  max_notes: number;
  max_note_size: number;
  max_ai_requests_per_day: number;
  max_shared_notes: number;
  max_file_upload_size: number;
}

export interface ErrorInfo {
  code: string;
  message: string;
  details?: any;
  timestamp: string;
  user_id?: string;
  context?: string;
}

export interface PerformanceMetrics {
  page_load_time: number;
  editor_init_time: number;
  save_time: number;
  sync_time: number;
  ai_response_time: number;
  memory_usage: number;
}

// Event types for real-time collaboration
export interface CollaborationEvent {
  type: 'cursor' | 'selection' | 'content' | 'presence';
  user_id: string;
  note_id: string;
  data: any;
  timestamp: string;
}

export interface UserPresence {
  user_id: string;
  name: string;
  avatar_url?: string;
  cursor_position?: number;
  selection?: { from: number; to: number };
  last_seen: string;
  color: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: ErrorInfo;
  meta?: {
    total?: number;
    page?: number;
    limit?: number;
  };
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  meta: {
    total: number;
    page: number;
    limit: number;
    has_more: boolean;
  };
}

// Component prop types
export interface EditorProps {
  note: Note;
  onSave: (content: string) => void;
  onContentChange: (content: string) => void;
  readOnly?: boolean;
  focusMode?: boolean;
  className?: string;
}

export interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  className?: string;
}

export interface AIAssistantProps {
  note: Note;
  onContentGenerated: (content: string) => void;
  onError: (error: ErrorInfo) => void;
}

// Utility types
export type Theme = 'light' | 'dark' | 'system';
export type EditorType = 'tiptap' | 'textarea';
export type StorageType = 'indexeddb' | 'chrome' | 'localstorage';
export type SyncState = 'idle' | 'syncing' | 'error' | 'offline';
export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

// Hook return types
export interface UseNotesReturn {
  notes: Note[];
  loading: boolean;
  error: ErrorInfo | null;
  createNote: (title: string, content?: string) => Promise<Note>;
  updateNote: (id: string, updates: Partial<Note>) => Promise<Note>;
  deleteNote: (id: string) => Promise<void>;
  searchNotes: (query: string) => Note[];
}

export interface UseAIReturn {
  generateContent: (prompt: string, options?: any) => Promise<string>;
  enhanceText: (text: string) => Promise<string>;
  summarize: (text: string) => Promise<string>;
  translate: (text: string, targetLang: string) => Promise<string>;
  loading: boolean;
  error: ErrorInfo | null;
}

export interface UseStorageReturn {
  save: (key: string, data: any) => Promise<void>;
  load: (key: string) => Promise<any>;
  remove: (key: string) => Promise<void>;
  clear: () => Promise<void>;
  available: boolean;
  type: StorageType;
}

