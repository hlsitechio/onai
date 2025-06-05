// Advanced Authentication Service for ONAI
// File: src/utils/security/auth.js
// Implements secure authentication with Supabase Auth and session management

import { supabase } from '../../lib/supabase'
import { ONAIEncryption } from './encryption'

class AuthService {
  constructor() {
    this.currentUser = null
    this.session = null
    this.encryption = new ONAIEncryption()
    this.authListeners = []
    this.sessionTimeout = 24 * 60 * 60 * 1000 // 24 hours
    this.refreshThreshold = 5 * 60 * 1000 // 5 minutes before expiry
    this.maxLoginAttempts = 5
    this.lockoutDuration = 15 * 60 * 1000 // 15 minutes
    
    // Initialize auth state
    this.initializeAuth()
  }

  // Initialize authentication state
  async initializeAuth() {
    try {
      // Get current session from Supabase
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) {
        console.error('Failed to get session:', error)
        return
      }

      if (session) {
        await this.handleSessionUpdate(session)
      }

      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (event, session) => {
        console.log('Auth state changed:', event)
        
        switch (event) {
          case 'SIGNED_IN':
            await this.handleSessionUpdate(session)
            break
          case 'SIGNED_OUT':
            await this.handleSignOut()
            break
          case 'TOKEN_REFRESHED':
            await this.handleSessionUpdate(session)
            break
          case 'USER_UPDATED':
            await this.handleUserUpdate(session)
            break
          default:
            break
        }

        // Notify listeners
        this.notifyAuthListeners(event, session)
      })

      // Set up automatic token refresh
      this.setupTokenRefresh()
      
      console.log('✅ Auth service initialized')
    } catch (error) {
      console.error('❌ Auth initialization failed:', error)
    }
  }

  // Handle session updates
  async handleSessionUpdate(session) {
    try {
      this.session = session
      this.currentUser = session?.user || null

      if (this.currentUser) {
        // Store session info securely
        this.storeSessionInfo(session)
        
        // Update user profile
        await this.updateUserProfile()
        
        // Initialize encryption for user
        await this.initializeUserEncryption()
        
        console.log('✅ User session updated:', this.currentUser.email)
      }
    } catch (error) {
      console.error('❌ Session update failed:', error)
    }
  }

  // Handle user sign out
  async handleSignOut() {
    try {
      // Cleanup encryption
      this.encryption.cleanup()
      
      // Clear session data
      this.clearSessionInfo()
      
      // Reset state
      this.currentUser = null
      this.session = null
      
      console.log('✅ User signed out')
    } catch (error) {
      console.error('❌ Sign out cleanup failed:', error)
    }
  }

  // Handle user profile updates
  async handleUserUpdate(session) {
    try {
      this.session = session
      this.currentUser = session?.user || null
      
      if (this.currentUser) {
        await this.updateUserProfile()
      }
      
      console.log('✅ User profile updated')
    } catch (error) {
      console.error('❌ User update failed:', error)
    }
  }

  // Sign up new user
  async signUp(email, password, userData = {}) {
    try {
      // Check if user is locked out
      if (this.isLockedOut(email)) {
        throw new Error('Account temporarily locked due to too many failed attempts')
      }

      // Validate password strength
      this.validatePassword(password)

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: userData.fullName || '',
            avatar_url: userData.avatarUrl || '',
            preferences: {
              theme: 'dark',
              editor_type: 'rich',
              auto_save: true,
              encryption_enabled: true
            }
          }
        }
      })

      if (error) {
        this.recordFailedAttempt(email)
        throw error
      }

      console.log('✅ User signed up successfully')
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('❌ Sign up failed:', error)
      throw error
    }
  }

  // Sign in user
  async signIn(email, password) {
    try {
      // Check if user is locked out
      if (this.isLockedOut(email)) {
        throw new Error('Account temporarily locked due to too many failed attempts')
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password
      })

      if (error) {
        this.recordFailedAttempt(email)
        throw error
      }

      // Clear failed attempts on successful login
      this.clearFailedAttempts(email)

      console.log('✅ User signed in successfully')
      return { success: true, user: data.user, session: data.session }
    } catch (error) {
      console.error('❌ Sign in failed:', error)
      throw error
    }
  }

  // Sign in with OAuth provider
  async signInWithProvider(provider) {
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      })

      if (error) throw error

      console.log('✅ OAuth sign in initiated')
      return { success: true, data }
    } catch (error) {
      console.error('❌ OAuth sign in failed:', error)
      throw error
    }
  }

  // Sign out user
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut()
      
      if (error) throw error

      console.log('✅ User signed out successfully')
      return { success: true }
    } catch (error) {
      console.error('❌ Sign out failed:', error)
      throw error
    }
  }

  // Reset password
  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`
      })

      if (error) throw error

      console.log('✅ Password reset email sent')
      return { success: true }
    } catch (error) {
      console.error('❌ Password reset failed:', error)
      throw error
    }
  }

  // Update password
  async updatePassword(newPassword) {
    try {
      this.validatePassword(newPassword)

      const { error } = await supabase.auth.updateUser({
        password: newPassword
      })

      if (error) throw error

      console.log('✅ Password updated successfully')
      return { success: true }
    } catch (error) {
      console.error('❌ Password update failed:', error)
      throw error
    }
  }

  // Update user profile
  async updateUserProfile(updates = {}) {
    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user')
      }

      const { error } = await supabase.auth.updateUser({
        data: updates
      })

      if (error) throw error

      // Update local user data
      if (this.currentUser) {
        this.currentUser.user_metadata = {
          ...this.currentUser.user_metadata,
          ...updates
        }
      }

      console.log('✅ User profile updated')
      return { success: true }
    } catch (error) {
      console.error('❌ Profile update failed:', error)
      throw error
    }
  }

  // Initialize user encryption
  async initializeUserEncryption() {
    try {
      if (!this.currentUser) {
        throw new Error('No authenticated user')
      }

      // Use user's email as encryption password base
      // In production, this should be a user-provided master password
      const encryptionPassword = await this.deriveEncryptionPassword()
      
      await this.encryption.initialize(encryptionPassword, this.currentUser.id)
      
      console.log('✅ User encryption initialized')
      return { success: true }
    } catch (error) {
      console.error('❌ Encryption initialization failed:', error)
      throw error
    }
  }

  // Derive encryption password (placeholder - should be user-provided in production)
  async deriveEncryptionPassword() {
    // This is a simplified version - in production, users should provide a master password
    const baseString = `${this.currentUser.email}_${this.currentUser.id}_onai_encryption`
    const encoder = new TextEncoder()
    const data = encoder.encode(baseString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('')
  }

  // Validate password strength
  validatePassword(password) {
    const minLength = 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    if (password.length < minLength) {
      throw new Error(`Password must be at least ${minLength} characters long`)
    }

    if (!hasUpperCase) {
      throw new Error('Password must contain at least one uppercase letter')
    }

    if (!hasLowerCase) {
      throw new Error('Password must contain at least one lowercase letter')
    }

    if (!hasNumbers) {
      throw new Error('Password must contain at least one number')
    }

    if (!hasSpecialChar) {
      throw new Error('Password must contain at least one special character')
    }

    return true
  }

  // Record failed login attempt
  recordFailedAttempt(email) {
    const attempts = this.getFailedAttempts(email)
    attempts.push(Date.now())
    localStorage.setItem(`onai_failed_attempts_${email}`, JSON.stringify(attempts))
  }

  // Get failed login attempts
  getFailedAttempts(email) {
    try {
      const stored = localStorage.getItem(`onai_failed_attempts_${email}`)
      return stored ? JSON.parse(stored) : []
    } catch {
      return []
    }
  }

  // Clear failed login attempts
  clearFailedAttempts(email) {
    localStorage.removeItem(`onai_failed_attempts_${email}`)
  }

  // Check if user is locked out
  isLockedOut(email) {
    const attempts = this.getFailedAttempts(email)
    const recentAttempts = attempts.filter(
      timestamp => Date.now() - timestamp < this.lockoutDuration
    )

    return recentAttempts.length >= this.maxLoginAttempts
  }

  // Store session info securely
  storeSessionInfo(session) {
    try {
      const sessionData = {
        access_token: session.access_token,
        refresh_token: session.refresh_token,
        expires_at: session.expires_at,
        user_id: session.user.id,
        stored_at: Date.now()
      }

      // Store in sessionStorage (more secure than localStorage for session data)
      sessionStorage.setItem('onai_session', JSON.stringify(sessionData))
    } catch (error) {
      console.error('Failed to store session info:', error)
    }
  }

  // Clear session info
  clearSessionInfo() {
    try {
      sessionStorage.removeItem('onai_session')
      localStorage.removeItem('onai_user_preferences')
    } catch (error) {
      console.error('Failed to clear session info:', error)
    }
  }

  // Setup automatic token refresh
  setupTokenRefresh() {
    setInterval(async () => {
      if (this.session && this.session.expires_at) {
        const expiresAt = this.session.expires_at * 1000
        const now = Date.now()
        
        // Refresh token if it expires within the threshold
        if (expiresAt - now < this.refreshThreshold) {
          try {
            const { data, error } = await supabase.auth.refreshSession()
            if (error) {
              console.error('Token refresh failed:', error)
            } else {
              console.log('✅ Token refreshed automatically')
            }
          } catch (error) {
            console.error('Token refresh error:', error)
          }
        }
      }
    }, 60000) // Check every minute
  }

  // Add auth state listener
  addAuthListener(callback) {
    this.authListeners.push(callback)
    
    // Return unsubscribe function
    return () => {
      const index = this.authListeners.indexOf(callback)
      if (index > -1) {
        this.authListeners.splice(index, 1)
      }
    }
  }

  // Notify auth listeners
  notifyAuthListeners(event, session) {
    this.authListeners.forEach(callback => {
      try {
        callback(event, session, this.currentUser)
      } catch (error) {
        console.error('Auth listener error:', error)
      }
    })
  }

  // Get current user
  getCurrentUser() {
    return this.currentUser
  }

  // Get current session
  getCurrentSession() {
    return this.session
  }

  // Check if user is authenticated
  isAuthenticated() {
    return !!(this.currentUser && this.session)
  }

  // Get user preferences
  getUserPreferences() {
    try {
      const stored = localStorage.getItem('onai_user_preferences')
      return stored ? JSON.parse(stored) : {}
    } catch {
      return {}
    }
  }

  // Update user preferences
  updateUserPreferences(preferences) {
    try {
      const current = this.getUserPreferences()
      const updated = { ...current, ...preferences }
      localStorage.setItem('onai_user_preferences', JSON.stringify(updated))
      return updated
    } catch (error) {
      console.error('Failed to update preferences:', error)
      return {}
    }
  }

  // Get auth status
  getAuthStatus() {
    return {
      isAuthenticated: this.isAuthenticated(),
      user: this.currentUser,
      session: this.session,
      encryptionStatus: this.encryption.getStatus(),
      preferences: this.getUserPreferences()
    }
  }

  // Cleanup auth service
  cleanup() {
    this.encryption.cleanup()
    this.clearSessionInfo()
    this.authListeners = []
    this.currentUser = null
    this.session = null
  }
}

// Create singleton instance
const authService = new AuthService()

export default authService

// Auth utilities and hooks
export const useAuth = () => {
  return {
    user: authService.getCurrentUser(),
    session: authService.getCurrentSession(),
    isAuthenticated: authService.isAuthenticated(),
    signIn: authService.signIn.bind(authService),
    signUp: authService.signUp.bind(authService),
    signOut: authService.signOut.bind(authService),
    signInWithProvider: authService.signInWithProvider.bind(authService),
    resetPassword: authService.resetPassword.bind(authService),
    updatePassword: authService.updatePassword.bind(authService),
    updateProfile: authService.updateUserProfile.bind(authService),
    getStatus: authService.getAuthStatus.bind(authService),
    addListener: authService.addAuthListener.bind(authService)
  }
}

// Auth context for React components
export const AuthContext = {
  service: authService,
  useAuth
}

