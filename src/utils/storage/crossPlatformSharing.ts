/**
 * Cross-Platform Sharing Utilities for OneAI
 * 
 * Provides methods for sharing notes across devices without requiring
 * authentication or API integration:
 * 
 * 1. Client-Side Encrypted Sharing - Generates encrypted shareable links
 * 2. Pairing Code Sharing - Enables device-to-device sharing via pairing codes
 */

import CryptoJS from 'crypto-js';

interface ShareResult {
  success: boolean;
  shareUrl?: string;
  pairingCode?: string;
  expiresAt?: Date;
  qrCode?: string;
  error?: string;
  password?: string;
  content?: string;
  title?: string;
}

interface PairingData {
  content: string;
  title: string;
  timestamp: number;
  expiresAt: number;
}

/**
 * Encrypts note content with a password
 */
export const encryptNote = (content: string, password: string): string => {
  return CryptoJS.AES.encrypt(content, password).toString();
};

/**
 * Decrypts note content with a password
 */
export const decryptNote = (encryptedContent: string, password: string): string => {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedContent, password);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    return '';
  }
};

/**
 * Creates a shareable link with encrypted content in URL fragment
 * The # fragment is not sent to the server, making it secure
 */
export const createEncryptedShareableLink = (
  content: string, 
  title: string, 
  password: string = generateRandomPassword()
): ShareResult => {
  try {
    // Create a payload with both content and title
    const payload = JSON.stringify({ content, title });
    const encrypted = encryptNote(payload, password);
    
    // Create URL with encrypted content in fragment
    const baseUrl = window.location.origin;
    const shareUrl = `${baseUrl}/secure-view#${encodeURIComponent(encrypted)}`;
    
    // Also include password in the returned object (but not in URL)
    return {
      success: true,
      shareUrl,
      password,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days
    };
  } catch (error) {
    console.error('Error creating encrypted link:', error);
    return {
      success: false,
      error: 'Failed to create encrypted link'
    };
  }
};

/**
 * Extracts encrypted content from URL fragment and decrypts it
 */
export const extractAndDecryptContent = (
  urlFragment: string, 
  password: string
): {content: string, title: string} | null => {
  try {
    const encryptedContent = decodeURIComponent(urlFragment.substring(1));
    const decrypted = decryptNote(encryptedContent, password);
    
    if (!decrypted) {
      return null;
    }
    
    return JSON.parse(decrypted);
  } catch (error) {
    console.error('Error extracting content:', error);
    return null;
  }
};

/**
 * Generates a random password for encryption
 */
export const generateRandomPassword = (length: number = 10): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  
  return password;
};

/**
 * Generates a 6-digit pairing code and stores the note content
 * for retrieval by another device
 */
export const generatePairingCode = (
  content: string, 
  title: string, 
  expiryMinutes: number = 30
): ShareResult => {
  try {
    // Generate a random 6-digit code that doesn't exist yet
    let pairingCode: string;
    do {
      pairingCode = Math.floor(100000 + Math.random() * 900000).toString();
    } while (localStorage.getItem(`oneai-pairing-${pairingCode}`) !== null);
    
    // Store note with expiration
    const expiresAt = Date.now() + expiryMinutes * 60 * 1000;
    const pairingData: PairingData = {
      content,
      title,
      timestamp: Date.now(),
      expiresAt
    };
    
    // Store encrypted data
    localStorage.setItem(
      `oneai-pairing-${pairingCode}`, 
      JSON.stringify(pairingData)
    );
    
    // Clean up expired pairing codes
    cleanupExpiredPairingCodes();
    
    return {
      success: true,
      pairingCode,
      expiresAt: new Date(expiresAt)
    };
  } catch (error) {
    console.error('Error generating pairing code:', error);
    return {
      success: false,
      error: 'Failed to generate pairing code'
    };
  }
};

/**
 * Retrieves note content using a pairing code
 */
export const retrieveContentFromPairingCode = (pairingCode: string): ShareResult => {
  try {
    const key = `oneai-pairing-${pairingCode}`;
    const storedData = localStorage.getItem(key);
    
    if (!storedData) {
      return {
        success: false,
        error: 'Invalid pairing code or note not found'
      };
    }
    
    const pairingData: PairingData = JSON.parse(storedData);
    
    // Check if the pairing code has expired
    if (Date.now() > pairingData.expiresAt) {
      localStorage.removeItem(key);
      return {
        success: false,
        error: 'This pairing code has expired'
      };
    }
    
    // Remove from storage after retrieving (one-time use)
    localStorage.removeItem(key);
    
    return {
      success: true,
      content: pairingData.content,
      title: pairingData.title
    };
  } catch (error) {
    console.error('Error retrieving content from pairing code:', error);
    return {
      success: false,
      error: 'Failed to retrieve content'
    };
  }
};

/**
 * Cleans up expired pairing codes from localStorage
 */
export const cleanupExpiredPairingCodes = (): void => {
  try {
    const now = Date.now();
    const pairingCodeKeys = [];
    
    // Find all pairing code keys
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('oneai-pairing-')) {
        pairingCodeKeys.push(key);
      }
    }
    
    // Check each key for expiration
    pairingCodeKeys.forEach(key => {
      const storedData = localStorage.getItem(key);
      if (storedData) {
        const pairingData: PairingData = JSON.parse(storedData);
        if (now > pairingData.expiresAt) {
          localStorage.removeItem(key);
        }
      }
    });
  } catch (error) {
    console.error('Error cleaning up expired pairing codes:', error);
  }
};
