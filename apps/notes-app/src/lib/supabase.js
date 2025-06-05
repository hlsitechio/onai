// Supabase client configuration for OneAI Notes
// File: src/lib/supabase.js

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'placeholder-key'

// For development, create a mock client if environment variables are not set
const isProduction = import.meta.env.PROD
const hasMissingEnvVars = !import.meta.env.VITE_SUPABASE_URL || !import.meta.env.VITE_SUPABASE_ANON_KEY

if (isProduction && hasMissingEnvVars) {
  throw new Error('Missing Supabase environment variables in production')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
})

// Database type definitions
export const TABLES = {
  USERS: 'users',
  NOTES: 'notes',
  FOLDERS: 'folders',
  SHARED_NOTES: 'shared_notes',
  AI_REQUESTS: 'ai_requests',
  NOTE_COMMENTS: 'note_comments',
  NOTE_VERSIONS: 'note_versions',
  AI_AGENTS: 'ai_agents',
  USER_SESSIONS: 'user_sessions',
  AUDIT_LOGS: 'audit_logs',
  ENCRYPTION_KEYS: 'encryption_keys',
  USER_SETTINGS: 'user_settings'
}

// Real-time channels
export const CHANNELS = {
  NOTES: 'notes_channel',
  COLLABORATION: 'collaboration_channel',
  PRESENCE: 'presence_channel'
}

// Helper functions for common operations
export const supabaseHelpers = {
  // Authentication helpers
  async signUp(email, password, metadata = {}) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata
      }
    })
    return { data, error }
  },

  async signIn(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })
    return { data, error }
  },

  async signInWithOAuth(provider) {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback`
      }
    })
    return { data, error }
  },

  async signOut() {
    const { error } = await supabase.auth.signOut()
    return { error }
  },

  async getCurrentUser() {
    const { data: { user }, error } = await supabase.auth.getUser()
    return { user, error }
  },

  // Notes helpers
  async getNotes(userId) {
    const { data, error } = await supabase
      .rpc('get_accessible_notes', { user_uuid: userId })
    return { data, error }
  },

  async createNote(note) {
    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .insert(note)
      .select()
      .single()
    return { data, error }
  },

  async updateNote(noteId, updates) {
    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .update(updates)
      .eq('id', noteId)
      .select()
      .single()
    return { data, error }
  },

  async deleteNote(noteId) {
    const { data, error } = await supabase
      .from(TABLES.NOTES)
      .update({ is_deleted: true, deleted_at: new Date().toISOString() })
      .eq('id', noteId)
    return { data, error }
  },

  async searchNotes(userId, query, limit = 20, offset = 0) {
    const { data, error } = await supabase
      .rpc('search_notes', {
        user_uuid: userId,
        search_query: query,
        limit_count: limit,
        offset_count: offset
      })
    return { data, error }
  },

  // Folders helpers
  async getFolders(userId) {
    const { data, error } = await supabase
      .from(TABLES.FOLDERS)
      .select('*')
      .eq('user_id', userId)
      .order('name')
    return { data, error }
  },

  async createFolder(folder) {
    const { data, error } = await supabase
      .from(TABLES.FOLDERS)
      .insert(folder)
      .select()
      .single()
    return { data, error }
  },

  // AI helpers
  async getAIAgents() {
    const { data, error } = await supabase
      .from(TABLES.AI_AGENTS)
      .select('*')
      .eq('enabled', true)
      .order('name')
    return { data, error }
  },

  async callGeminiAI(prompt, action = 'generate', options = {}) {
    const { data, error } = await supabase.functions.invoke('gemini-ai', {
      body: {
        prompt,
        action,
        ...options
      }
    })
    return { data, error }
  },

  // Sharing helpers
  async shareNote(noteId, shareData) {
    const { data, error } = await supabase
      .from(TABLES.SHARED_NOTES)
      .insert({
        note_id: noteId,
        ...shareData
      })
      .select()
      .single()
    return { data, error }
  },

  async getSharedNotes(userId) {
    const { data, error } = await supabase
      .from(TABLES.SHARED_NOTES)
      .select(`
        *,
        notes:note_id (
          id,
          title,
          content,
          created_at,
          updated_at
        )
      `)
      .eq('shared_with', userId)
      .eq('is_active', true)
    return { data, error }
  },

  // User stats
  async getUserStats(userId) {
    const { data, error } = await supabase
      .rpc('get_user_stats', { user_uuid: userId })
    return { data: data?.[0], error }
  },

  // Real-time subscriptions
  subscribeToNotes(userId, callback) {
    return supabase
      .channel(CHANNELS.NOTES)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.NOTES,
          filter: `user_id=eq.${userId}`
        },
        callback
      )
      .subscribe()
  },

  subscribeToCollaboration(noteId, callback) {
    return supabase
      .channel(`${CHANNELS.COLLABORATION}_${noteId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: TABLES.NOTE_COMMENTS,
          filter: `note_id=eq.${noteId}`
        },
        callback
      )
      .subscribe()
  },

  // Presence tracking
  trackPresence(noteId, userInfo) {
    return supabase
      .channel(`${CHANNELS.PRESENCE}_${noteId}`)
      .on('presence', { event: 'sync' }, () => {
        const newState = supabase.getChannels()[0].presenceState()
        // Handle presence updates
      })
      .on('presence', { event: 'join' }, ({ key, newPresences }) => {
        // Handle user join
      })
      .on('presence', { event: 'leave' }, ({ key, leftPresences }) => {
        // Handle user leave
      })
      .subscribe(async (status) => {
        if (status !== 'SUBSCRIBED') return
        
        await supabase.channel(`${CHANNELS.PRESENCE}_${noteId}`).track({
          user_id: userInfo.id,
          name: userInfo.name,
          avatar_url: userInfo.avatar_url,
          online_at: new Date().toISOString()
        })
      })
  }
}

export default supabase

