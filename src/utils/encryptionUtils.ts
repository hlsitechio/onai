
/**
 * Utilities for client-side encryption of notes
 */

// Generate a random encryption key if one doesn't exist
export const getOrCreateEncryptionKey = (): string => {
  let key = localStorage.getItem('onlinenote-encryption-key');
  if (!key) {
    // Generate a random 256-bit key (32 bytes, encoded as base64)
    const randomBytes = new Uint8Array(32);
    window.crypto.getRandomValues(randomBytes);
    key = btoa(String.fromCharCode.apply(null, [...randomBytes]));
    localStorage.setItem('onlinenote-encryption-key', key);
  }
  return key;
};

// Encrypt text using AES-GCM
export const encryptContent = async (content: string): Promise<string> => {
  try {
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
    
    return btoa(String.fromCharCode.apply(null, [...result]));
  } catch (error) {
    console.error('Encryption error:', error);
    return content; // Fallback to unencrypted content in case of error
  }
};

// Decrypt text using AES-GCM
export const decryptContent = async (encryptedContent: string): Promise<string> => {
  try {
    // If the content doesn't appear to be encrypted, return it as is
    if (!encryptedContent || encryptedContent.length < 16) {
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
    const encryptedData = Uint8Array.from(atob(encryptedContent), c => c.charCodeAt(0));
    
    // Extract the IV (first 12 bytes) and encrypted content
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
    return encryptedContent; // Return encrypted content as fallback
  }
};

// Sanitize HTML content to prevent XSS attacks
export const sanitizeContent = (content: string): string => {
  // This is a simple implementation - for production, use a library like DOMPurify
  const tempDiv = document.createElement('div');
  tempDiv.textContent = content;
  return tempDiv.innerHTML;
};
