/**
 * Enhanced Encryption Utilities for OneAI
 * 
 * Provides robust client-side encryption mechanisms for securing notes
 * without requiring server-side authentication.
 */

import CryptoJS from 'crypto-js';
import { safeExecute, ErrorCode, ErrorSeverity } from '../errorHandling';

// Length of derived key (in bytes) for AES encryption
const KEY_SIZE = 256 / 8;

// Number of iterations for key derivation
const ITERATIONS = 10000;

// Salt size in bytes
const SALT_SIZE = 16;

// Current encryption schema version for future migration support
const ENCRYPTION_VERSION = 'v1';

// Data structure for encrypted content
interface EncryptedData {
  version: string;
  salt: string;
  iv: string;
  ciphertext: string;
  hmac: string;
}

/**
 * Derives a key from a password using PBKDF2
 */
const deriveKey = (password: string, salt: string): CryptoJS.lib.WordArray => {
  return CryptoJS.PBKDF2(password, salt, {
    keySize: KEY_SIZE,
    iterations: ITERATIONS
  });
};

/**
 * Generates a cryptographically secure random string
 */
export const generateSecureRandomString = (length: number): string => {
  const randomValues = new Uint8Array(length);
  window.crypto.getRandomValues(randomValues);
  return Array.from(randomValues)
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
};

/**
 * Encrypts data with enhanced security
 * - Uses PBKDF2 for key derivation
 * - Includes HMAC verification
 * - Supports structured metadata
 */
export const encryptData = async <T>(
  data: T,
  password: string = generateSecureRandomString(16)
): Promise<{ encryptedData: string; password: string }> => {
  const result = await safeExecute(
    async () => {
      // Generate a random salt
      const salt = CryptoJS.lib.WordArray.random(SALT_SIZE);
      
      // Derive encryption key
      const key = deriveKey(password, salt.toString());
      
      // Generate random IV
      const iv = CryptoJS.lib.WordArray.random(16);
      
      // Convert data to string
      const jsonData = JSON.stringify(data);
      
      // Encrypt the data
      const encrypted = CryptoJS.AES.encrypt(jsonData, key, {
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7
      });
      
      // Generate HMAC for integrity verification
      const hmac = CryptoJS.HmacSHA256(
        salt.toString() + iv.toString() + encrypted.toString(),
        key
      ).toString();
      
      // Create the encrypted data structure
      const encryptedData: EncryptedData = {
        version: ENCRYPTION_VERSION,
        salt: salt.toString(),
        iv: iv.toString(),
        ciphertext: encrypted.toString(),
        hmac: hmac
      };
      
      return {
        encryptedData: JSON.stringify(encryptedData),
        password
      };
    },
    ErrorCode.ENCRYPTION_FAILED,
    'Failed to encrypt data',
    ErrorSeverity.ERROR
  );
  
  if (!result.success || !result.data) {
    throw new Error('Encryption failed');
  }
  
  return result.data;
};

/**
 * Decrypts data with integrity verification
 */
export const decryptData = async <T>(
  encryptedDataStr: string,
  password: string
): Promise<T> => {
  const result = await safeExecute(
    async () => {
      // Parse the encrypted data
      const encryptedData: EncryptedData = JSON.parse(encryptedDataStr);
      
      // Check version for compatibility
      if (encryptedData.version !== ENCRYPTION_VERSION) {
        throw new Error(`Unsupported encryption version: ${encryptedData.version}`);
      }
      
      // Derive key from password and salt
      const key = deriveKey(password, encryptedData.salt);
      
      // Verify HMAC for data integrity
      const computedHmac = CryptoJS.HmacSHA256(
        encryptedData.salt + encryptedData.iv + encryptedData.ciphertext,
        key
      ).toString();
      
      if (computedHmac !== encryptedData.hmac) {
        throw new Error('HMAC verification failed. Data may have been tampered with.');
      }
      
      // Decrypt the data
      const decrypted = CryptoJS.AES.decrypt(
        encryptedData.ciphertext,
        key,
        {
          iv: CryptoJS.enc.Hex.parse(encryptedData.iv),
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7
        }
      );
      
      // Convert to UTF-8 string and parse
      const jsonData = decrypted.toString(CryptoJS.enc.Utf8);
      if (!jsonData) {
        throw new Error('Decryption resulted in empty data');
      }
      
      return JSON.parse(jsonData) as T;
    },
    ErrorCode.DECRYPTION_FAILED,
    'Failed to decrypt data',
    ErrorSeverity.ERROR
  );
  
  if (!result.success || !result.data) {
    throw new Error('Decryption failed');
  }
  
  return result.data;
};

/**
 * Encrypts a note with metadata
 */
export const encryptNote = async (
  content: string,
  metadata: Record<string, any> = {},
  password?: string
): Promise<{ encryptedData: string; password: string }> => {
  return encryptData(
    {
      content,
      metadata: {
        ...metadata,
        timestamp: Date.now(),
        version: ENCRYPTION_VERSION
      }
    },
    password
  );
};

/**
 * Decrypts a note and extracts content and metadata
 */
export const decryptNote = async (
  encryptedData: string,
  password: string
): Promise<{ content: string; metadata: Record<string, any> }> => {
  return decryptData(encryptedData, password);
};

/**
 * Creates a hash of content for integrity checking
 */
export const createContentHash = (content: string): string => {
  return CryptoJS.SHA256(content).toString();
};

/**
 * Verifies content integrity by comparing hashes
 */
export const verifyContentIntegrity = (content: string, hash: string): boolean => {
  const computedHash = createContentHash(content);
  return computedHash === hash;
};
