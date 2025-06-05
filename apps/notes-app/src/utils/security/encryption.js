// Advanced Encryption Service for ONAI
// File: src/utils/security/encryption.js
// Implements AES-256-GCM client-side encryption with zero-knowledge architecture

class EncryptionService {
  constructor() {
    this.algorithm = 'AES-GCM'
    this.keyLength = 256
    this.ivLength = 12 // 96 bits for GCM
    this.tagLength = 16 // 128 bits for GCM
    this.saltLength = 32 // 256 bits
    this.iterations = 100000 // PBKDF2 iterations
  }

  // Generate a cryptographically secure random key
  async generateKey() {
    try {
      const key = await window.crypto.subtle.generateKey(
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true, // extractable
        ['encrypt', 'decrypt']
      )
      return key
    } catch (error) {
      console.error('Failed to generate encryption key:', error)
      throw new Error('Key generation failed')
    }
  }

  // Derive key from password using PBKDF2
  async deriveKeyFromPassword(password, salt) {
    try {
      const encoder = new TextEncoder()
      const passwordBuffer = encoder.encode(password)

      // Import password as key material
      const keyMaterial = await window.crypto.subtle.importKey(
        'raw',
        passwordBuffer,
        'PBKDF2',
        false,
        ['deriveBits', 'deriveKey']
      )

      // Derive the actual encryption key
      const key = await window.crypto.subtle.deriveKey(
        {
          name: 'PBKDF2',
          salt: salt,
          iterations: this.iterations,
          hash: 'SHA-256'
        },
        keyMaterial,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true, // extractable
        ['encrypt', 'decrypt']
      )

      return key
    } catch (error) {
      console.error('Failed to derive key from password:', error)
      throw new Error('Key derivation failed')
    }
  }

  // Generate random salt
  generateSalt() {
    return window.crypto.getRandomValues(new Uint8Array(this.saltLength))
  }

  // Generate random IV
  generateIV() {
    return window.crypto.getRandomValues(new Uint8Array(this.ivLength))
  }

  // Encrypt data with AES-256-GCM
  async encrypt(data, key, additionalData = null) {
    try {
      const encoder = new TextEncoder()
      const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data
      const iv = this.generateIV()

      const encryptOptions = {
        name: this.algorithm,
        iv: iv
      }

      // Add additional authenticated data if provided
      if (additionalData) {
        encryptOptions.additionalData = typeof additionalData === 'string' 
          ? encoder.encode(additionalData) 
          : additionalData
      }

      const encryptedBuffer = await window.crypto.subtle.encrypt(
        encryptOptions,
        key,
        dataBuffer
      )

      // Combine IV and encrypted data
      const result = new Uint8Array(iv.length + encryptedBuffer.byteLength)
      result.set(iv, 0)
      result.set(new Uint8Array(encryptedBuffer), iv.length)

      return {
        data: result,
        iv: iv,
        base64: this.arrayBufferToBase64(result)
      }
    } catch (error) {
      console.error('Encryption failed:', error)
      throw new Error('Encryption failed')
    }
  }

  // Decrypt data with AES-256-GCM
  async decrypt(encryptedData, key, additionalData = null) {
    try {
      const dataBuffer = typeof encryptedData === 'string' 
        ? this.base64ToArrayBuffer(encryptedData)
        : encryptedData

      // Extract IV and encrypted content
      const iv = dataBuffer.slice(0, this.ivLength)
      const encrypted = dataBuffer.slice(this.ivLength)

      const decryptOptions = {
        name: this.algorithm,
        iv: iv
      }

      // Add additional authenticated data if provided
      if (additionalData) {
        const encoder = new TextEncoder()
        decryptOptions.additionalData = typeof additionalData === 'string' 
          ? encoder.encode(additionalData) 
          : additionalData
      }

      const decryptedBuffer = await window.crypto.subtle.decrypt(
        decryptOptions,
        key,
        encrypted
      )

      const decoder = new TextDecoder()
      return decoder.decode(decryptedBuffer)
    } catch (error) {
      console.error('Decryption failed:', error)
      throw new Error('Decryption failed - data may be corrupted or key is incorrect')
    }
  }

  // Export key to raw format
  async exportKey(key) {
    try {
      const exported = await window.crypto.subtle.exportKey('raw', key)
      return new Uint8Array(exported)
    } catch (error) {
      console.error('Key export failed:', error)
      throw new Error('Key export failed')
    }
  }

  // Import key from raw format
  async importKey(keyData) {
    try {
      const key = await window.crypto.subtle.importKey(
        'raw',
        keyData,
        {
          name: this.algorithm,
          length: this.keyLength
        },
        true,
        ['encrypt', 'decrypt']
      )
      return key
    } catch (error) {
      console.error('Key import failed:', error)
      throw new Error('Key import failed')
    }
  }

  // Secure key storage in browser
  async storeKey(keyId, key, password = null) {
    try {
      const keyData = await this.exportKey(key)
      
      if (password) {
        // Encrypt the key with password before storing
        const salt = this.generateSalt()
        const derivedKey = await this.deriveKeyFromPassword(password, salt)
        const encryptedKey = await this.encrypt(keyData, derivedKey)
        
        const storageData = {
          encryptedKey: encryptedKey.base64,
          salt: this.arrayBufferToBase64(salt),
          timestamp: Date.now(),
          algorithm: this.algorithm
        }
        
        localStorage.setItem(`onai_key_${keyId}`, JSON.stringify(storageData))
      } else {
        // Store key directly (less secure)
        const storageData = {
          key: this.arrayBufferToBase64(keyData),
          timestamp: Date.now(),
          algorithm: this.algorithm
        }
        
        localStorage.setItem(`onai_key_${keyId}`, JSON.stringify(storageData))
      }
      
      return true
    } catch (error) {
      console.error('Key storage failed:', error)
      throw new Error('Key storage failed')
    }
  }

  // Retrieve key from browser storage
  async retrieveKey(keyId, password = null) {
    try {
      const storedData = localStorage.getItem(`onai_key_${keyId}`)
      if (!storedData) {
        throw new Error('Key not found')
      }

      const data = JSON.parse(storedData)
      
      if (data.encryptedKey && password) {
        // Decrypt the stored key
        const salt = this.base64ToArrayBuffer(data.salt)
        const derivedKey = await this.deriveKeyFromPassword(password, salt)
        const decryptedKeyData = await this.decrypt(data.encryptedKey, derivedKey)
        const keyBuffer = this.base64ToArrayBuffer(decryptedKeyData)
        return await this.importKey(keyBuffer)
      } else if (data.key) {
        // Import directly stored key
        const keyBuffer = this.base64ToArrayBuffer(data.key)
        return await this.importKey(keyBuffer)
      } else {
        throw new Error('Invalid key format')
      }
    } catch (error) {
      console.error('Key retrieval failed:', error)
      throw new Error('Key retrieval failed')
    }
  }

  // Hash data using SHA-256
  async hash(data) {
    try {
      const encoder = new TextEncoder()
      const dataBuffer = typeof data === 'string' ? encoder.encode(data) : data
      const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer)
      return this.arrayBufferToBase64(hashBuffer)
    } catch (error) {
      console.error('Hashing failed:', error)
      throw new Error('Hashing failed')
    }
  }

  // Generate secure random password
  generateSecurePassword(length = 32) {
    const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*'
    const randomValues = new Uint8Array(length)
    window.crypto.getRandomValues(randomValues)
    
    return Array.from(randomValues, byte => charset[byte % charset.length]).join('')
  }

  // Utility: Convert ArrayBuffer to Base64
  arrayBufferToBase64(buffer) {
    const bytes = new Uint8Array(buffer)
    let binary = ''
    for (let i = 0; i < bytes.byteLength; i++) {
      binary += String.fromCharCode(bytes[i])
    }
    return window.btoa(binary)
  }

  // Utility: Convert Base64 to ArrayBuffer
  base64ToArrayBuffer(base64) {
    const binary = window.atob(base64)
    const bytes = new Uint8Array(binary.length)
    for (let i = 0; i < binary.length; i++) {
      bytes[i] = binary.charCodeAt(i)
    }
    return bytes.buffer
  }

  // Secure memory cleanup (best effort)
  secureCleanup(sensitiveData) {
    if (sensitiveData && typeof sensitiveData === 'object') {
      // Overwrite object properties
      Object.keys(sensitiveData).forEach(key => {
        if (typeof sensitiveData[key] === 'string') {
          sensitiveData[key] = '0'.repeat(sensitiveData[key].length)
        }
        delete sensitiveData[key]
      })
    }
  }

  // Check if Web Crypto API is available
  isSupported() {
    return !!(window.crypto && window.crypto.subtle)
  }

  // Get encryption info
  getInfo() {
    return {
      algorithm: this.algorithm,
      keyLength: this.keyLength,
      ivLength: this.ivLength,
      tagLength: this.tagLength,
      saltLength: this.saltLength,
      iterations: this.iterations,
      supported: this.isSupported()
    }
  }
}

// Create singleton instance
const encryptionService = new EncryptionService()

export default encryptionService

// High-level encryption utilities for ONAI
export class ONAIEncryption {
  constructor() {
    this.service = encryptionService
    this.userKey = null
    this.isInitialized = false
  }

  // Initialize encryption with user password
  async initialize(password, userId) {
    try {
      if (!this.service.isSupported()) {
        throw new Error('Web Crypto API not supported in this browser')
      }

      // Try to retrieve existing key
      try {
        this.userKey = await this.service.retrieveKey(userId, password)
        this.isInitialized = true
        console.log('✅ Encryption initialized with existing key')
        return { success: true, isNewKey: false }
      } catch (error) {
        // Generate new key if retrieval fails
        const salt = this.service.generateSalt()
        this.userKey = await this.service.deriveKeyFromPassword(password, salt)
        await this.service.storeKey(userId, this.userKey, password)
        this.isInitialized = true
        console.log('✅ Encryption initialized with new key')
        return { success: true, isNewKey: true }
      }
    } catch (error) {
      console.error('❌ Encryption initialization failed:', error)
      throw error
    }
  }

  // Encrypt note content
  async encryptNote(note) {
    if (!this.isInitialized || !this.userKey) {
      throw new Error('Encryption not initialized')
    }

    try {
      const noteData = {
        title: note.title,
        content: note.content,
        tags: note.tags,
        metadata: note.metadata
      }

      const serializedData = JSON.stringify(noteData)
      const additionalData = `note_${note.id}_${note.updated_at}`
      
      const encrypted = await this.service.encrypt(
        serializedData, 
        this.userKey, 
        additionalData
      )

      return {
        id: note.id,
        encrypted_content: encrypted.base64,
        content_hash: await this.service.hash(serializedData),
        encryption_version: '1.0',
        encrypted_at: new Date().toISOString(),
        // Keep non-sensitive metadata unencrypted for indexing
        folder_id: note.folder_id,
        is_starred: note.is_starred,
        is_shared: note.is_shared,
        created_at: note.created_at,
        updated_at: note.updated_at
      }
    } catch (error) {
      console.error('❌ Note encryption failed:', error)
      throw error
    }
  }

  // Decrypt note content
  async decryptNote(encryptedNote) {
    if (!this.isInitialized || !this.userKey) {
      throw new Error('Encryption not initialized')
    }

    try {
      const additionalData = `note_${encryptedNote.id}_${encryptedNote.updated_at}`
      
      const decryptedData = await this.service.decrypt(
        encryptedNote.encrypted_content,
        this.userKey,
        additionalData
      )

      const noteData = JSON.parse(decryptedData)
      
      // Verify content integrity
      const currentHash = await this.service.hash(decryptedData)
      if (currentHash !== encryptedNote.content_hash) {
        console.warn('⚠️ Content hash mismatch - data may be corrupted')
      }

      return {
        ...encryptedNote,
        ...noteData,
        is_encrypted: true,
        decrypted_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Note decryption failed:', error)
      throw error
    }
  }

  // Encrypt search index
  async encryptSearchIndex(searchData) {
    if (!this.isInitialized || !this.userKey) {
      throw new Error('Encryption not initialized')
    }

    try {
      const serializedData = JSON.stringify(searchData)
      const encrypted = await this.service.encrypt(serializedData, this.userKey)
      
      return {
        encrypted_index: encrypted.base64,
        index_hash: await this.service.hash(serializedData),
        encrypted_at: new Date().toISOString()
      }
    } catch (error) {
      console.error('❌ Search index encryption failed:', error)
      throw error
    }
  }

  // Get encryption status
  getStatus() {
    return {
      isInitialized: this.isInitialized,
      hasKey: !!this.userKey,
      isSupported: this.service.isSupported(),
      info: this.service.getInfo()
    }
  }

  // Cleanup sensitive data
  cleanup() {
    if (this.userKey) {
      this.service.secureCleanup(this.userKey)
      this.userKey = null
    }
    this.isInitialized = false
  }
}

// Export utilities
export { encryptionService }

