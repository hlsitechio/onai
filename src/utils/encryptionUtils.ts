/**
 * Utilities for client-side encryption of notes
 */

// Constants
const ENCRYPTION_KEY = 'noteflow-encryption-key';

// Generate a random encryption key if one doesn't exist
export const getOrCreateEncryptionKey = (): string => {
  let key = localStorage.getItem(ENCRYPTION_KEY);
  if (!key) {
    // Generate a random 256-bit key (32 bytes, encoded as base64)
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    key = btoa(String.fromCharCode.apply(null, [...randomBytes]));
    localStorage.setItem(ENCRYPTION_KEY, key);
  }
  return key;
};

// Simple base64 validation
const isValidBase64 = (str: string): boolean => {
  try {
    if (!str || typeof str !== 'string') return false;
    // Check if it contains only valid base64 characters
    if (!/^[A-Za-z0-9+/]*={0,2}$/.test(str)) {
      return false;
    }
    // Try to decode it
    const decoded = atob(str);
    // Check if it can be encoded back to the same string
    return btoa(decoded) === str;
  } catch (e) {
    return false;
  }
};

// Encrypt text using AES-GCM with better error handling
export const encryptContent = async (content: string): Promise<string> => {
  try {
    // Return original content if empty or not a string
    if (!content || typeof content !== 'string') {
      return content || '';
    }
    
    // For very short content, don't encrypt to avoid overhead
    if (content.length < 10) {
      return content;
    }

    const key = getOrCreateEncryptionKey();
    const encodedKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    
    // Import the raw key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['encrypt']
    );
    
    // Create an initialization vector
    const iv = window.crypto.getRandomValues(new Uint8Array(12));
    
    // Encode the content to encrypt
    const encodedContent = new TextEncoder().encode(content);
    
    // Encrypt the content
    const encryptedContent = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      encodedContent
    );
    
    // Combine the IV and encrypted content and encode as base64
    const result = new Uint8Array(iv.length + new Uint8Array(encryptedContent).length);
    result.set(iv);
    result.set(new Uint8Array(encryptedContent), iv.length);
    
    // Add a prefix to identify encrypted content
    const encrypted = 'ENC:' + btoa(String.fromCharCode.apply(null, [...result]));
    return encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    return content; // Fallback to unencrypted content
  }
};

// Decrypt text using AES-GCM with better error handling
export const decryptContent = async (encryptedContent: string): Promise<string> => {
  try {
    // Return original data if it's empty or null
    if (!encryptedContent || typeof encryptedContent !== 'string') {
      return encryptedContent || '';
    }
    
    // Check if content is actually encrypted (has our prefix)
    if (!encryptedContent.startsWith('ENC:')) {
      // If it looks like old base64 encrypted content, try to decrypt it
      if (isValidBase64(encryptedContent) && encryptedContent.length > 50) {
        return await tryLegacyDecryption(encryptedContent);
      }
      // Otherwise return as plain text
      return encryptedContent;
    }
    
    // Remove the ENC: prefix
    const base64Data = encryptedContent.substring(4);
    
    // Validate base64
    if (!isValidBase64(base64Data)) {
      console.warn('Invalid base64 in encrypted content');
      return encryptedContent;
    }
    
    const key = getOrCreateEncryptionKey();
    const encodedKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    
    // Import the raw key
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    // Decode the base64 content
    const encryptedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    // Extract the IV (first 12 bytes) and encrypted content
    if (encryptedData.length < 12) {
      throw new Error('Encrypted data too short');
    }
    
    const iv = encryptedData.slice(0, 12);
    const actualContent = encryptedData.slice(12);
    
    // Decrypt the content
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      actualContent
    );
    
    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error('Decryption error:', error);
    // Try legacy decryption for old encrypted content
    if (encryptedContent.startsWith('ENC:')) {
      const base64Data = encryptedContent.substring(4);
      return await tryLegacyDecryption(base64Data);
    }
    return encryptedContent; // Return original content if decryption fails
  }
};

// Try to decrypt content that was encrypted with the old method
const tryLegacyDecryption = async (base64Data: string): Promise<string> => {
  try {
    const key = getOrCreateEncryptionKey();
    const encodedKey = Uint8Array.from(atob(key), c => c.charCodeAt(0));
    
    const cryptoKey = await window.crypto.subtle.importKey(
      'raw',
      encodedKey,
      { name: 'AES-GCM' },
      false,
      ['decrypt']
    );
    
    const encryptedData = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
    
    if (encryptedData.length < 12) {
      throw new Error('Data too short for legacy decryption');
    }
    
    const iv = encryptedData.slice(0, 12);
    const actualContent = encryptedData.slice(12);
    
    const decryptedContent = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv
      },
      cryptoKey,
      actualContent
    );
    
    return new TextDecoder().decode(decryptedContent);
  } catch (error) {
    console.error('Legacy decryption failed:', error);
    // If all else fails, return the original base64 data as plain text
    return base64Data;
  }
};

// Sanitize HTML content to prevent XSS attacks
export const sanitizeContent = (content: string): string => {
  // This is a simple implementation - for production, use a library like DOMPurify
  const tempDiv = document.createElement('div');
  tempDiv.textContent = content;
  return tempDiv.innerHTML;
};
