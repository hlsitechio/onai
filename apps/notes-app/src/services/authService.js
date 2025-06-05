// Authentication Service - Secure User Management
// File: src/services/authService.js

import { createHash } from 'crypto';

// Simulated backend - In production, this would be a real backend service
class AuthService {
  constructor() {
    this.users = JSON.parse(localStorage.getItem('onai_users') || '[]');
    this.currentUser = JSON.parse(localStorage.getItem('onai_current_user') || 'null');
    this.sessions = JSON.parse(localStorage.getItem('onai_sessions') || '{}');
  }

  // Hash password for security
  hashPassword(password) {
    // In production, use bcrypt or similar
    return btoa(password + 'onai_salt_2025');
  }

  // Generate secure session token
  generateSessionToken() {
    return btoa(Date.now() + Math.random().toString(36).substr(2, 9));
  }

  // Validate email format
  validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  // Validate password strength
  validatePassword(password) {
    return {
      isValid: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasLowercase: /[a-z]/.test(password),
      hasNumbers: /\d/.test(password),
      hasSpecialChars: /[!@#$%^&*(),.?":{}|<>]/.test(password),
      length: password.length
    };
  }

  // Register new user
  async register(email, password, firstName, lastName) {
    try {
      // Validate input
      if (!this.validateEmail(email)) {
        throw new Error('Invalid email format');
      }

      const passwordValidation = this.validatePassword(password);
      if (!passwordValidation.isValid) {
        throw new Error('Password must be at least 8 characters long');
      }

      // Check if user already exists
      const existingUser = this.users.find(user => user.email === email);
      if (existingUser) {
        throw new Error('User already exists with this email');
      }

      // Create new user
      const newUser = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        passwordHash: this.hashPassword(password),
        createdAt: new Date().toISOString(),
        lastLogin: null,
        isVerified: true, // In production, implement email verification
        preferences: {
          theme: 'dark',
          language: 'en',
          notifications: true
        }
      };

      // Save user
      this.users.push(newUser);
      localStorage.setItem('onai_users', JSON.stringify(this.users));

      // Auto-login after registration
      return this.login(email, password);
    } catch (error) {
      throw error;
    }
  }

  // Login user
  async login(email, password) {
    try {
      // Find user
      const user = this.users.find(user => user.email === email);
      if (!user) {
        throw new Error('Invalid email or password');
      }

      // Verify password
      const hashedPassword = this.hashPassword(password);
      if (user.passwordHash !== hashedPassword) {
        throw new Error('Invalid email or password');
      }

      // Generate session
      const sessionToken = this.generateSessionToken();
      const session = {
        userId: user.id,
        token: sessionToken,
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days
        isActive: true
      };

      // Save session
      this.sessions[sessionToken] = session;
      localStorage.setItem('onai_sessions', JSON.stringify(this.sessions));

      // Update user last login
      user.lastLogin = new Date().toISOString();
      localStorage.setItem('onai_users', JSON.stringify(this.users));

      // Set current user
      const userSession = {
        ...user,
        sessionToken,
        passwordHash: undefined // Don't store password hash in session
      };
      this.currentUser = userSession;
      localStorage.setItem('onai_current_user', JSON.stringify(userSession));

      return {
        success: true,
        user: userSession,
        message: 'Login successful'
      };
    } catch (error) {
      throw error;
    }
  }

  // Logout user
  async logout() {
    try {
      if (this.currentUser && this.currentUser.sessionToken) {
        // Invalidate session
        if (this.sessions[this.currentUser.sessionToken]) {
          this.sessions[this.currentUser.sessionToken].isActive = false;
          localStorage.setItem('onai_sessions', JSON.stringify(this.sessions));
        }
      }

      // Clear current user
      this.currentUser = null;
      localStorage.removeItem('onai_current_user');

      return {
        success: true,
        message: 'Logout successful'
      };
    } catch (error) {
      throw error;
    }
  }

  // Check if user is authenticated
  isAuthenticated() {
    if (!this.currentUser || !this.currentUser.sessionToken) {
      return false;
    }

    const session = this.sessions[this.currentUser.sessionToken];
    if (!session || !session.isActive) {
      return false;
    }

    // Check if session is expired
    if (new Date() > new Date(session.expiresAt)) {
      this.logout();
      return false;
    }

    return true;
  }

  // Get current user
  getCurrentUser() {
    if (this.isAuthenticated()) {
      return this.currentUser;
    }
    return null;
  }

  // Update user profile
  async updateProfile(updates) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const userIndex = this.users.findIndex(user => user.id === this.currentUser.id);
      if (userIndex === -1) {
        throw new Error('User not found');
      }

      // Update user data
      this.users[userIndex] = {
        ...this.users[userIndex],
        ...updates,
        updatedAt: new Date().toISOString()
      };

      // Update current user session
      this.currentUser = {
        ...this.currentUser,
        ...updates
      };

      // Save changes
      localStorage.setItem('onai_users', JSON.stringify(this.users));
      localStorage.setItem('onai_current_user', JSON.stringify(this.currentUser));

      return {
        success: true,
        user: this.currentUser,
        message: 'Profile updated successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Change password
  async changePassword(currentPassword, newPassword) {
    try {
      if (!this.isAuthenticated()) {
        throw new Error('User not authenticated');
      }

      const user = this.users.find(user => user.id === this.currentUser.id);
      if (!user) {
        throw new Error('User not found');
      }

      // Verify current password
      const currentHashedPassword = this.hashPassword(currentPassword);
      if (user.passwordHash !== currentHashedPassword) {
        throw new Error('Current password is incorrect');
      }

      // Validate new password
      const passwordValidation = this.validatePassword(newPassword);
      if (!passwordValidation.isValid) {
        throw new Error('New password must be at least 8 characters long');
      }

      // Update password
      user.passwordHash = this.hashPassword(newPassword);
      user.updatedAt = new Date().toISOString();

      // Save changes
      localStorage.setItem('onai_users', JSON.stringify(this.users));

      return {
        success: true,
        message: 'Password changed successfully'
      };
    } catch (error) {
      throw error;
    }
  }

  // Reset password (simplified - in production, use email verification)
  async resetPassword(email) {
    try {
      const user = this.users.find(user => user.email === email);
      if (!user) {
        // Don't reveal if email exists for security
        return {
          success: true,
          message: 'If an account with this email exists, a reset link has been sent'
        };
      }

      // In production, send email with reset token
      // For demo, we'll just return success
      return {
        success: true,
        message: 'Password reset instructions have been sent to your email'
      };
    } catch (error) {
      throw error;
    }
  }

  // Get user statistics
  getUserStats() {
    if (!this.isAuthenticated()) {
      return null;
    }

    return {
      totalUsers: this.users.length,
      userSince: this.currentUser.createdAt,
      lastLogin: this.currentUser.lastLogin,
      sessionsCount: Object.keys(this.sessions).filter(token => 
        this.sessions[token].userId === this.currentUser.id
      ).length
    };
  }
}

// Create singleton instance
const authService = new AuthService();

export default authService;

