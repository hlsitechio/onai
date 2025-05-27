import express from 'express';
import cors from 'cors';
import { Low } from 'lowdb';
import { JSONFile } from 'lowdb/node';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { v4 as uuidv4 } from 'uuid';
import crypto from 'crypto';

// Configure __dirname equivalent for ES modules
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configure LowDB with a JSON file adapter
const dbFile = join(__dirname, 'db.json');
const adapter = new JSONFile(dbFile);
const db = new Low(adapter);

// Initialize database with default structure
await db.read();
db.data ||= { 
  notes: [], 
  sharedNotes: [], 
  statistics: { 
    totalNotes: 0, 
    totalShares: 0 
  } 
};
await db.write();

// Create Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Rate limiting middleware
const requestCounts = {};
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour window
const MAX_REQUESTS_PER_WINDOW = 100;

function rateLimiter(req, res, next) {
  const ip = req.ip || req.headers['x-forwarded-for'] || 'unknown';
  const now = Date.now();
  
  // Initialize or clean up old timestamps
  if (!requestCounts[ip]) {
    requestCounts[ip] = [];
  }
  
  // Remove timestamps outside the current window
  requestCounts[ip] = requestCounts[ip].filter(timestamp => {
    return now - timestamp < RATE_LIMIT_WINDOW;
  });
  
  // Check if the number of requests in the window exceeds the limit
  if (requestCounts[ip].length >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({ 
      error: 'Too many requests, please try again later',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW / 1000)
    });
  }
  
  // Add current timestamp to the list
  requestCounts[ip].push(now);
  next();
}

// Apply rate limiter to all routes
app.use(rateLimiter);

// Utility to generate a content hash for conflict detection
function generateContentHash(content) {
  return crypto.createHash('sha256').update(content).digest('hex');
}

// Routes

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Get all notes for a device (anonymous sync)
app.get('/api/notes/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    
    // Validate device ID
    if (!deviceId || deviceId.length < 8) {
      return res.status(400).json({ error: 'Invalid device ID' });
    }
    
    await db.read();
    
    // Filter notes for the specific device
    const deviceNotes = db.data.notes.filter(note => note.device_id === deviceId);
    
    return res.status(200).json({ 
      notes: deviceNotes,
      count: deviceNotes.length 
    });
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
});

// Save a note (create or update)
app.post('/api/notes', async (req, res) => {
  try {
    const { id, content, title, device_id, created_at, updated_at, is_encrypted } = req.body;
    
    // Validate required fields
    if (!id || !content || !device_id) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    await db.read();
    
    // Generate content hash for conflict detection
    const contentHash = generateContentHash(content);
    
    // Check if note exists
    const existingNoteIndex = db.data.notes.findIndex(note => 
      note.id === id && note.device_id === device_id
    );
    
    if (existingNoteIndex >= 0) {
      // Update existing note
      db.data.notes[existingNoteIndex] = {
        ...db.data.notes[existingNoteIndex],
        content,
        title: title || db.data.notes[existingNoteIndex].title,
        updated_at: updated_at || new Date().toISOString(),
        is_encrypted: is_encrypted !== undefined ? is_encrypted : db.data.notes[existingNoteIndex].is_encrypted,
        content_hash: contentHash
      };
    } else {
      // Create new note
      db.data.notes.push({
        id,
        content,
        title: title || 'Untitled Note',
        device_id,
        created_at: created_at || new Date().toISOString(),
        updated_at: updated_at || new Date().toISOString(),
        is_encrypted: is_encrypted || false,
        content_hash: contentHash
      });
      
      // Update statistics
      db.data.statistics.totalNotes += 1;
    }
    
    await db.write();
    
    return res.status(200).json({ 
      success: true, 
      content_hash: contentHash 
    });
  } catch (error) {
    console.error('Error saving note:', error);
    res.status(500).json({ error: 'Failed to save note' });
  }
});

// Delete a note
app.delete('/api/notes/:deviceId/:noteId', async (req, res) => {
  try {
    const { deviceId, noteId } = req.params;
    
    // Validate parameters
    if (!deviceId || !noteId) {
      return res.status(400).json({ error: 'Missing required parameters' });
    }
    
    await db.read();
    
    // Find the note index
    const noteIndex = db.data.notes.findIndex(note => 
      note.id === noteId && note.device_id === deviceId
    );
    
    if (noteIndex === -1) {
      return res.status(404).json({ error: 'Note not found' });
    }
    
    // Remove the note
    db.data.notes.splice(noteIndex, 1);
    await db.write();
    
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error deleting note:', error);
    res.status(500).json({ error: 'Failed to delete note' });
  }
});

// Share a note publicly
app.post('/api/share', async (req, res) => {
  try {
    const { content, title, expires_in } = req.body;
    
    // Validate content
    if (!content) {
      return res.status(400).json({ error: 'Content is required' });
    }
    
    await db.read();
    
    // Generate a unique share ID
    const shareId = uuidv4().substring(0, 8);
    
    // Calculate expiration time (default: 7 days)
    const expiresInDays = expires_in || 7;
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + expiresInDays);
    
    // Create shared note record
    const sharedNote = {
      id: shareId,
      content,
      title: title || 'Shared Note',
      created_at: new Date().toISOString(),
      expires_at: expirationDate.toISOString(),
      views: 0
    };
    
    db.data.sharedNotes.push(sharedNote);
    db.data.statistics.totalShares += 1;
    
    await db.write();
    
    return res.status(200).json({ 
      success: true, 
      share_id: shareId, 
      expires_at: expirationDate.toISOString() 
    });
  } catch (error) {
    console.error('Error sharing note:', error);
    res.status(500).json({ error: 'Failed to share note' });
  }
});

// Get a shared note by ID
app.get('/api/share/:shareId', async (req, res) => {
  try {
    const { shareId } = req.params;
    
    await db.read();
    
    // Find the shared note
    const sharedNote = db.data.sharedNotes.find(note => note.id === shareId);
    
    if (!sharedNote) {
      return res.status(404).json({ error: 'Shared note not found' });
    }
    
    // Check if note has expired
    if (new Date(sharedNote.expires_at) < new Date()) {
      return res.status(410).json({ error: 'This shared note has expired' });
    }
    
    // Increment view count
    sharedNote.views += 1;
    await db.write();
    
    return res.status(200).json({
      id: sharedNote.id,
      title: sharedNote.title,
      content: sharedNote.content,
      created_at: sharedNote.created_at,
      expires_at: sharedNote.expires_at,
      views: sharedNote.views
    });
  } catch (error) {
    console.error('Error fetching shared note:', error);
    res.status(500).json({ error: 'Failed to fetch shared note' });
  }
});

// Sync endpoint for conflict resolution
app.post('/api/sync/:deviceId', async (req, res) => {
  try {
    const { deviceId } = req.params;
    const { notes, last_sync } = req.body;
    
    // Validate parameters
    if (!deviceId || !Array.isArray(notes)) {
      return res.status(400).json({ error: 'Invalid sync request' });
    }
    
    await db.read();
    
    const serverNotes = db.data.notes.filter(note => note.device_id === deviceId);
    const conflicts = [];
    const updates = [];
    
    // Process each client note
    for (const clientNote of notes) {
      const serverNote = serverNotes.find(note => note.id === clientNote.id);
      
      if (!serverNote) {
        // Note doesn't exist on server, add it
        updates.push({
          action: 'create',
          note: clientNote
        });
      } else if (clientNote.content_hash !== serverNote.content_hash) {
        // Content hash mismatch - potential conflict
        if (new Date(serverNote.updated_at) > new Date(clientNote.updated_at)) {
          // Server note is newer
          conflicts.push({
            id: clientNote.id,
            server_version: serverNote,
            client_version: clientNote
          });
        } else {
          // Client note is newer
          updates.push({
            action: 'update',
            note: clientNote
          });
        }
      }
    }
    
    // Apply updates to server
    for (const update of updates) {
      if (update.action === 'create') {
        db.data.notes.push({
          ...update.note,
          device_id: deviceId,
          content_hash: generateContentHash(update.note.content)
        });
        db.data.statistics.totalNotes += 1;
      } else if (update.action === 'update') {
        const noteIndex = db.data.notes.findIndex(note => 
          note.id === update.note.id && note.device_id === deviceId
        );
        
        if (noteIndex !== -1) {
          db.data.notes[noteIndex] = {
            ...update.note,
            device_id: deviceId,
            content_hash: generateContentHash(update.note.content)
          };
        }
      }
    }
    
    await db.write();
    
    return res.status(200).json({
      success: true,
      conflicts,
      updates: updates.length,
      server_notes: serverNotes.length
    });
  } catch (error) {
    console.error('Error syncing notes:', error);
    res.status(500).json({ error: 'Failed to sync notes' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Database initialized at ${dbFile}`);
});

export default app;
