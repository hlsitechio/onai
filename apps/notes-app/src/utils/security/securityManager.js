// Security Manager for ONAI
// File: src/utils/security/securityManager.js
// Coordinates all security features and provides unified security interface

import { useState, useEffect } from 'react'
import authService from './auth'
import encryptionService, { ONAIEncryption } from './encryption'
import browserDetection from '../browserDetection'

class SecurityManager {
  constructor() {
    this.auth = authService
    this.encryption = new ONAIEncryption()
    this.securityPolicies = {
      passwordPolicy: {
        minLength: 8,
        requireUppercase: true,
        requireLowercase: true,
        requireNumbers: true,
        requireSpecialChars: true,
        maxAge: 90 * 24 * 60 * 60 * 1000, // 90 days
        preventReuse: 5 // Last 5 passwords
      },
      sessionPolicy: {
        maxDuration: 24 * 60 * 60 * 1000, // 24 hours
        idleTimeout: 30 * 60 * 1000, // 30 minutes
        requireReauth: 60 * 60 * 1000, // 1 hour for sensitive operations
        maxConcurrentSessions: 3
      },
      dataPolicy: {
        encryptionRequired: true,
        backupEncryption: true,
        auditLogging: true,
        dataRetention: 365 * 24 * 60 * 60 * 1000 // 1 year
      },
      accessPolicy: {
        maxFailedAttempts: 5,
        lockoutDuration: 15 * 60 * 1000, // 15 minutes
        rateLimiting: true,
        ipWhitelist: false
      }
    }
    
    this.securityEvents = []
    this.threatDetection = {
      suspiciousActivity: [],
      blockedIPs: new Set(),
      rateLimits: new Map()
    }

    this.initialize()
  }

  // Initialize security manager
  async initialize() {
    try {
      // Set up security event listeners
      this.setupSecurityListeners()
      
      // Initialize threat detection
      this.initializeThreatDetection()
      
      // Start security monitoring
      this.startSecurityMonitoring()
      
      console.log('✅ Security Manager initialized')
    } catch (error) {
      console.error('❌ Security Manager initialization failed:', error)
    }
  }

  // Setup security event listeners
  setupSecurityListeners() {
    // Listen for auth events
    this.auth.addAuthListener(async (event, session, user) => {
      // Get modern browser info for security logging
      const browserInfo = await browserDetection.getMinimalBrowserInfo()
      
      this.logSecurityEvent({
        type: 'AUTH_EVENT',
        event,
        userId: user?.id,
        timestamp: new Date().toISOString(),
        metadata: {
          browserInfo, // Use modern browser info instead of userAgent
          ip: this.getClientIP(),
          sessionId: session?.access_token?.substring(0, 10)
        }
      })

      // Handle specific security events
      switch (event) {
        case 'SIGNED_IN':
          this.handleSuccessfulLogin(user)
          break
        case 'SIGNED_OUT':
          this.handleLogout(user)
          break
        case 'TOKEN_REFRESHED':
          this.handleTokenRefresh(session)
          break
        default:
          break
      }
    })

    // Listen for encryption events
    window.addEventListener('beforeunload', () => {
      this.handlePageUnload()
    })

    // Listen for security violations
    window.addEventListener('securitypolicyviolation', (event) => {
      this.handleSecurityViolation(event)
    })
  }

  // Initialize threat detection
  initializeThreatDetection() {
    // Monitor for suspicious patterns
    this.threatPatterns = [
      {
        name: 'RAPID_LOGIN_ATTEMPTS',
        threshold: 10,
        timeWindow: 5 * 60 * 1000, // 5 minutes
        action: 'BLOCK_IP'
      },
      {
        name: 'UNUSUAL_ACCESS_PATTERN',
        threshold: 50,
        timeWindow: 60 * 60 * 1000, // 1 hour
        action: 'FLAG_USER'
      },
      {
        name: 'MULTIPLE_FAILED_DECRYPTION',
        threshold: 5,
        timeWindow: 10 * 60 * 1000, // 10 minutes
        action: 'LOCK_ACCOUNT'
      }
    ]
  }

  // Start security monitoring
  startSecurityMonitoring() {
    // Monitor session activity
    setInterval(() => {
      this.checkSessionSecurity()
    }, 60000) // Check every minute

    // Monitor for threats
    setInterval(() => {
      this.analyzeThreatPatterns()
    }, 5 * 60 * 1000) // Check every 5 minutes

    // Cleanup old security events
    setInterval(() => {
      this.cleanupSecurityEvents()
    }, 60 * 60 * 1000) // Cleanup every hour
  }

  // Secure note operations
  async secureNoteOperation(operation, noteData, options = {}) {
    try {
      // Check authentication
      if (!this.auth.isAuthenticated()) {
        throw new Error('Authentication required')
      }

      // Check encryption status
      if (!this.encryption.getStatus().isInitialized) {
        throw new Error('Encryption not initialized')
      }

      // Log security event
      this.logSecurityEvent({
        type: 'NOTE_OPERATION',
        operation,
        noteId: noteData.id,
        userId: this.auth.getCurrentUser()?.id,
        timestamp: new Date().toISOString()
      })

      let result
      switch (operation) {
        case 'ENCRYPT':
          result = await this.encryption.encryptNote(noteData)
          break
        case 'DECRYPT':
          result = await this.encryption.decryptNote(noteData)
          break
        case 'SEARCH_ENCRYPT':
          result = await this.encryption.encryptSearchIndex(noteData)
          break
        default:
          throw new Error(`Unknown operation: ${operation}`)
      }

      return { success: true, data: result }
    } catch (error) {
      this.logSecurityEvent({
        type: 'SECURITY_ERROR',
        operation,
        error: error.message,
        userId: this.auth.getCurrentUser()?.id,
        timestamp: new Date().toISOString()
      })
      throw error
    }
  }

  // Validate security requirements
  validateSecurityRequirements(requirements = {}) {
    const results = {
      passed: true,
      checks: {}
    }

    // Check authentication
    results.checks.authentication = this.auth.isAuthenticated()
    if (!results.checks.authentication) results.passed = false

    // Check encryption
    results.checks.encryption = this.encryption.getStatus().isInitialized
    if (!results.checks.encryption) results.passed = false

    // Check session validity
    results.checks.sessionValid = this.isSessionValid()
    if (!results.checks.sessionValid) results.passed = false

    // Check for suspicious activity
    results.checks.noSuspiciousActivity = !this.hasSuspiciousActivity()
    if (!results.checks.noSuspiciousActivity) results.passed = false

    // Custom requirements
    if (requirements.requireRecentAuth) {
      results.checks.recentAuth = this.isRecentAuth(requirements.authWindow || 60 * 60 * 1000)
      if (!results.checks.recentAuth) results.passed = false
    }

    return results
  }

  // Handle successful login
  handleSuccessfulLogin(user) {
    // Clear failed attempts
    this.clearFailedAttempts(user.email)
    
    // Initialize user security context
    this.initializeUserSecurity(user)
    
    // Check for concurrent sessions
    this.checkConcurrentSessions(user)
  }

  // Handle logout
  handleLogout(user) {
    // Cleanup security context
    this.cleanupUserSecurity(user)
    
    // Clear sensitive data
    this.clearSensitiveData()
  }

  // Handle token refresh
  handleTokenRefresh(session) {
    // Validate token integrity
    this.validateTokenIntegrity(session)
    
    // Update security context
    this.updateSecurityContext(session)
  }

  // Handle page unload
  handlePageUnload() {
    // Cleanup sensitive data from memory
    this.clearSensitiveData()
    
    // Log security event
    this.logSecurityEvent({
      type: 'PAGE_UNLOAD',
      userId: this.auth.getCurrentUser()?.id,
      timestamp: new Date().toISOString()
    })
  }

  // Handle security violations
  handleSecurityViolation(event) {
    this.logSecurityEvent({
      type: 'SECURITY_VIOLATION',
      violation: event.violatedDirective,
      blockedURI: event.blockedURI,
      timestamp: new Date().toISOString(),
      severity: 'HIGH'
    })

    // Take immediate action for critical violations
    if (this.isCriticalViolation(event)) {
      this.handleCriticalSecurityEvent(event)
    }
  }

  // Check session security
  checkSessionSecurity() {
    const session = this.auth.getCurrentSession()
    if (!session) return

    // Check session expiry
    if (this.isSessionExpired(session)) {
      this.handleSessionExpiry()
      return
    }

    // Check for idle timeout
    if (this.isSessionIdle()) {
      this.handleIdleTimeout()
      return
    }

    // Check for suspicious activity
    if (this.detectSuspiciousActivity()) {
      this.handleSuspiciousActivity()
    }
  }

  // Analyze threat patterns
  analyzeThreatPatterns() {
    this.threatPatterns.forEach(pattern => {
      const events = this.getRecentEvents(pattern.name, pattern.timeWindow)
      
      if (events.length >= pattern.threshold) {
        this.handleThreatDetection(pattern, events)
      }
    })
  }

  // Handle threat detection
  handleThreatDetection(pattern, events) {
    this.logSecurityEvent({
      type: 'THREAT_DETECTED',
      pattern: pattern.name,
      eventCount: events.length,
      action: pattern.action,
      timestamp: new Date().toISOString(),
      severity: 'CRITICAL'
    })

    // Take action based on pattern
    switch (pattern.action) {
      case 'BLOCK_IP':
        this.blockIP(this.getClientIP())
        break
      case 'FLAG_USER':
        this.flagUser(this.auth.getCurrentUser()?.id)
        break
      case 'LOCK_ACCOUNT':
        this.lockAccount(this.auth.getCurrentUser()?.id)
        break
      default:
        break
    }
  }

  // Security utility methods
  isSessionValid() {
    const session = this.auth.getCurrentSession()
    return session && !this.isSessionExpired(session)
  }

  isSessionExpired(session) {
    if (!session || !session.expires_at) return true
    return Date.now() > session.expires_at * 1000
  }

  isSessionIdle() {
    const lastActivity = this.getLastActivity()
    const idleTimeout = this.securityPolicies.sessionPolicy.idleTimeout
    return Date.now() - lastActivity > idleTimeout
  }

  isRecentAuth(window = 60 * 60 * 1000) {
    const lastAuth = this.getLastAuthTime()
    return Date.now() - lastAuth < window
  }

  hasSuspiciousActivity() {
    return this.threatDetection.suspiciousActivity.length > 0
  }

  detectSuspiciousActivity() {
    // Implement suspicious activity detection logic
    const recentEvents = this.getRecentSecurityEvents(10 * 60 * 1000) // Last 10 minutes
    
    // Check for rapid successive operations
    const rapidOperations = recentEvents.filter(event => 
      event.type === 'NOTE_OPERATION'
    ).length > 20

    // Check for multiple failed decryptions
    const failedDecryptions = recentEvents.filter(event => 
      event.type === 'SECURITY_ERROR' && event.operation === 'DECRYPT'
    ).length > 3

    return rapidOperations || failedDecryptions
  }

  // Security event logging
  async logSecurityEvent(event) {
    // Get modern browser info for comprehensive security logging
    const browserInfo = await browserDetection.getMinimalBrowserInfo()
    
    const securityEvent = {
      id: this.generateEventId(),
      ...event,
      clientInfo: {
        browserInfo, // Use modern browser info instead of deprecated properties
        language: navigator.language,
        cookieEnabled: navigator.cookieEnabled,
        onLine: navigator.onLine
      }
    }

    this.securityEvents.push(securityEvent)
    
    // Send to server for centralized logging (if configured)
    this.sendSecurityEventToServer(securityEvent)
  }

  // Get recent security events
  getRecentSecurityEvents(timeWindow) {
    const cutoff = Date.now() - timeWindow
    return this.securityEvents.filter(event => 
      new Date(event.timestamp).getTime() > cutoff
    )
  }

  // Get recent events by type
  getRecentEvents(type, timeWindow) {
    const cutoff = Date.now() - timeWindow
    return this.securityEvents.filter(event => 
      event.type === type && new Date(event.timestamp).getTime() > cutoff
    )
  }

  // Cleanup old security events
  cleanupSecurityEvents() {
    const retention = this.securityPolicies.dataPolicy.dataRetention
    const cutoff = Date.now() - retention
    
    this.securityEvents = this.securityEvents.filter(event => 
      new Date(event.timestamp).getTime() > cutoff
    )
  }

  // Security action methods
  blockIP(ip) {
    this.threatDetection.blockedIPs.add(ip)
    console.warn(`🚫 IP blocked: ${ip}`)
  }

  flagUser(userId) {
    this.threatDetection.suspiciousActivity.push({
      userId,
      type: 'FLAGGED_USER',
      timestamp: Date.now()
    })
    console.warn(`🚩 User flagged: ${userId}`)
  }

  lockAccount(userId) {
    // In a real implementation, this would call the backend
    console.warn(`🔒 Account locked: ${userId}`)
    this.auth.signOut()
  }

  // Utility methods
  generateEventId() {
    return `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getClientIP() {
    // This is a placeholder - in production, IP would come from server
    return 'client_ip_placeholder'
  }

  getLastActivity() {
    return parseInt(sessionStorage.getItem('onai_last_activity') || Date.now())
  }

  updateLastActivity() {
    sessionStorage.setItem('onai_last_activity', Date.now().toString())
  }

  getLastAuthTime() {
    return parseInt(sessionStorage.getItem('onai_last_auth') || Date.now())
  }

  clearSensitiveData() {
    // Clear encryption keys
    this.encryption.cleanup()
    
    // Clear sensitive session data
    const sensitiveKeys = ['onai_session', 'onai_encryption_key']
    sensitiveKeys.forEach(key => {
      sessionStorage.removeItem(key)
      localStorage.removeItem(key)
    })
  }

  clearFailedAttempts(email) {
    localStorage.removeItem(`onai_failed_attempts_${email}`)
  }

  isCriticalViolation(event) {
    const criticalDirectives = ['script-src', 'object-src', 'base-uri']
    return criticalDirectives.some(directive => 
      event.violatedDirective.includes(directive)
    )
  }

  handleCriticalSecurityEvent(event) {
    // Immediate logout for critical security events
    this.auth.signOut()
    
    // Clear all data
    this.clearSensitiveData()
    
    // Show security alert
    alert('Critical security violation detected. You have been logged out for your safety.')
  }

  // Send security event to server
  async sendSecurityEventToServer(event) {
    try {
      // Only send high-severity events to reduce noise
      if (event.severity === 'HIGH' || event.severity === 'CRITICAL') {
        // In production, this would send to your security monitoring service
        console.log('🔒 Security event logged:', event)
      }
    } catch (error) {
      console.error('Failed to send security event:', error)
    }
  }

  // Get security status
  getSecurityStatus() {
    return {
      authentication: this.auth.getAuthStatus(),
      encryption: this.encryption.getStatus(),
      session: {
        valid: this.isSessionValid(),
        idle: this.isSessionIdle(),
        recentAuth: this.isRecentAuth()
      },
      threats: {
        suspiciousActivity: this.hasSuspiciousActivity(),
        blockedIPs: Array.from(this.threatDetection.blockedIPs),
        recentEvents: this.getRecentSecurityEvents(60 * 60 * 1000).length
      },
      policies: this.securityPolicies
    }
  }

  // Initialize user security context
  initializeUserSecurity(user) {
    sessionStorage.setItem('onai_last_auth', Date.now().toString())
    this.updateLastActivity()
  }

  // Cleanup user security context
  cleanupUserSecurity(user) {
    sessionStorage.removeItem('onai_last_auth')
    sessionStorage.removeItem('onai_last_activity')
  }

  // Update security context
  updateSecurityContext(session) {
    this.updateLastActivity()
  }

  // Validate token integrity
  validateTokenIntegrity(session) {
    // Basic token validation
    if (!session.access_token || !session.refresh_token) {
      throw new Error('Invalid token structure')
    }
    
    // Check token expiry
    if (this.isSessionExpired(session)) {
      throw new Error('Token expired')
    }
  }

  // Check concurrent sessions
  checkConcurrentSessions(user) {
    // This would be implemented with server-side session tracking
    console.log('Checking concurrent sessions for user:', user.id)
  }

  // Handle session expiry
  handleSessionExpiry() {
    console.warn('🕐 Session expired')
    this.auth.signOut()
  }

  // Handle idle timeout
  handleIdleTimeout() {
    console.warn('😴 Session idle timeout')
    this.auth.signOut()
  }

  // Handle suspicious activity
  handleSuspiciousActivity() {
    console.warn('🚨 Suspicious activity detected')
    // Could implement additional security measures here
  }
}

// Export singleton instance
const securityManager = new SecurityManager()
export default securityManager



// React hook for using security manager in components
export const useSecurity = () => {
  const [securityStatus, setSecurityStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const updateSecurityStatus = () => {
      try {
        const status = securityManager.getSecurityStatus()
        setSecurityStatus(status)
        setIsLoading(false)
      } catch (error) {
        console.error('Failed to get security status:', error)
        setIsLoading(false)
      }
    }

    // Initial load
    updateSecurityStatus()

    // Update every 30 seconds
    const interval = setInterval(updateSecurityStatus, 30000)

    return () => clearInterval(interval)
  }, [])

  return {
    securityStatus,
    isLoading,
    securityManager,
    refreshStatus: () => {
      const status = securityManager.getSecurityStatus()
      setSecurityStatus(status)
    }
  }
}

