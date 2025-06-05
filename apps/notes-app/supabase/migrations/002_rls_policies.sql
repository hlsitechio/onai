-- OneAI Notes Row Level Security (RLS) Policies
-- Migration: 002_rls_policies.sql

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_versions ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE note_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE encryption_keys ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_settings ENABLE ROW LEVEL SECURITY;

-- Users table policies
CREATE POLICY "Users can view their own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" ON users
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Folders table policies
CREATE POLICY "Users can view their own folders" ON folders
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own folders" ON folders
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own folders" ON folders
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own folders" ON folders
    FOR DELETE USING (auth.uid() = user_id);

-- Notes table policies
CREATE POLICY "Users can view their own notes" ON notes
    FOR SELECT USING (
        auth.uid() = user_id 
        OR is_public = true
        OR id IN (
            SELECT note_id FROM shared_notes 
            WHERE shared_with = auth.uid() 
            AND is_active = true 
            AND (expires_at IS NULL OR expires_at > NOW())
            AND can_read = true
        )
    );

CREATE POLICY "Users can create their own notes" ON notes
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own notes or shared notes with write permission" ON notes
    FOR UPDATE USING (
        auth.uid() = user_id 
        OR id IN (
            SELECT note_id FROM shared_notes 
            WHERE shared_with = auth.uid() 
            AND is_active = true 
            AND (expires_at IS NULL OR expires_at > NOW())
            AND can_write = true
        )
    );

CREATE POLICY "Users can delete their own notes" ON notes
    FOR DELETE USING (auth.uid() = user_id);

-- Note versions table policies
CREATE POLICY "Users can view versions of accessible notes" ON note_versions
    FOR SELECT USING (
        note_id IN (
            SELECT id FROM notes WHERE 
            auth.uid() = user_id 
            OR is_public = true
            OR id IN (
                SELECT note_id FROM shared_notes 
                WHERE shared_with = auth.uid() 
                AND is_active = true 
                AND (expires_at IS NULL OR expires_at > NOW())
                AND can_read = true
            )
        )
    );

CREATE POLICY "Users can create versions for accessible notes" ON note_versions
    FOR INSERT WITH CHECK (
        note_id IN (
            SELECT id FROM notes WHERE 
            auth.uid() = user_id 
            OR id IN (
                SELECT note_id FROM shared_notes 
                WHERE shared_with = auth.uid() 
                AND is_active = true 
                AND (expires_at IS NULL OR expires_at > NOW())
                AND can_write = true
            )
        )
        AND auth.uid() = created_by
    );

-- Shared notes table policies
CREATE POLICY "Users can view shares they created or received" ON shared_notes
    FOR SELECT USING (
        auth.uid() = shared_by 
        OR auth.uid() = shared_with
        OR note_id IN (SELECT id FROM notes WHERE user_id = auth.uid())
    );

CREATE POLICY "Note owners can create shares" ON shared_notes
    FOR INSERT WITH CHECK (
        auth.uid() = shared_by
        AND note_id IN (SELECT id FROM notes WHERE user_id = auth.uid())
    );

CREATE POLICY "Share creators can update their shares" ON shared_notes
    FOR UPDATE USING (auth.uid() = shared_by);

CREATE POLICY "Share creators can delete their shares" ON shared_notes
    FOR DELETE USING (auth.uid() = shared_by);

-- AI requests table policies
CREATE POLICY "Users can view their own AI requests" ON ai_requests
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own AI requests" ON ai_requests
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own AI requests" ON ai_requests
    FOR UPDATE USING (auth.uid() = user_id);

-- Note comments table policies
CREATE POLICY "Users can view comments on accessible notes" ON note_comments
    FOR SELECT USING (
        note_id IN (
            SELECT id FROM notes WHERE 
            auth.uid() = user_id 
            OR is_public = true
            OR id IN (
                SELECT note_id FROM shared_notes 
                WHERE shared_with = auth.uid() 
                AND is_active = true 
                AND (expires_at IS NULL OR expires_at > NOW())
                AND can_read = true
            )
        )
    );

CREATE POLICY "Users can create comments on accessible notes with comment permission" ON note_comments
    FOR INSERT WITH CHECK (
        auth.uid() = user_id
        AND note_id IN (
            SELECT id FROM notes WHERE 
            auth.uid() = user_id 
            OR id IN (
                SELECT note_id FROM shared_notes 
                WHERE shared_with = auth.uid() 
                AND is_active = true 
                AND (expires_at IS NULL OR expires_at > NOW())
                AND can_comment = true
            )
        )
    );

CREATE POLICY "Users can update their own comments" ON note_comments
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own comments" ON note_comments
    FOR DELETE USING (auth.uid() = user_id);

-- User sessions table policies
CREATE POLICY "Users can view their own sessions" ON user_sessions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own sessions" ON user_sessions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own sessions" ON user_sessions
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own sessions" ON user_sessions
    FOR DELETE USING (auth.uid() = user_id);

-- Audit logs table policies (read-only for users, admin access needed for full access)
CREATE POLICY "Users can view their own audit logs" ON audit_logs
    FOR SELECT USING (auth.uid() = user_id);

-- Encryption keys table policies
CREATE POLICY "Users can view their own encryption keys" ON encryption_keys
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own encryption keys" ON encryption_keys
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own encryption keys" ON encryption_keys
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own encryption keys" ON encryption_keys
    FOR DELETE USING (auth.uid() = user_id);

-- User settings table policies
CREATE POLICY "Users can view their own settings" ON user_settings
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own settings" ON user_settings
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own settings" ON user_settings
    FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own settings" ON user_settings
    FOR DELETE USING (auth.uid() = user_id);

-- AI agents table policies (read-only for users, system managed)
CREATE POLICY "Users can view enabled AI agents" ON ai_agents
    FOR SELECT USING (enabled = true);

-- Create functions for secure operations

-- Function to check if user can access note
CREATE OR REPLACE FUNCTION can_access_note(note_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM notes 
        WHERE id = note_uuid 
        AND (
            user_id = user_uuid
            OR is_public = true
            OR id IN (
                SELECT note_id FROM shared_notes 
                WHERE shared_with = user_uuid 
                AND is_active = true 
                AND (expires_at IS NULL OR expires_at > NOW())
                AND can_read = true
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user can edit note
CREATE OR REPLACE FUNCTION can_edit_note(note_uuid UUID, user_uuid UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM notes 
        WHERE id = note_uuid 
        AND (
            user_id = user_uuid
            OR id IN (
                SELECT note_id FROM shared_notes 
                WHERE shared_with = user_uuid 
                AND is_active = true 
                AND (expires_at IS NULL OR expires_at > NOW())
                AND can_write = true
            )
        )
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user's accessible notes
CREATE OR REPLACE FUNCTION get_accessible_notes(user_uuid UUID)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    content TEXT,
    tags TEXT[],
    folder_id UUID,
    user_id UUID,
    is_shared BOOLEAN,
    is_public BOOLEAN,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    word_count INTEGER,
    character_count INTEGER,
    reading_time INTEGER,
    ai_generated BOOLEAN,
    permission_type TEXT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.content,
        n.tags,
        n.folder_id,
        n.user_id,
        n.is_shared,
        n.is_public,
        n.created_at,
        n.updated_at,
        n.word_count,
        n.character_count,
        n.reading_time,
        n.ai_generated,
        CASE 
            WHEN n.user_id = user_uuid THEN 'owner'
            WHEN n.is_public THEN 'public'
            ELSE 'shared'
        END as permission_type
    FROM notes n
    WHERE n.user_id = user_uuid
       OR n.is_public = true
       OR n.id IN (
           SELECT sn.note_id FROM shared_notes sn
           WHERE sn.shared_with = user_uuid 
           AND sn.is_active = true 
           AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
           AND sn.can_read = true
       )
    AND n.is_deleted = false
    ORDER BY n.updated_at DESC;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create audit log entry
CREATE OR REPLACE FUNCTION create_audit_log(
    p_user_id UUID,
    p_action VARCHAR(100),
    p_resource_type VARCHAR(50),
    p_resource_id UUID,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    log_id UUID;
BEGIN
    INSERT INTO audit_logs (
        user_id, action, resource_type, resource_id, 
        details, ip_address, user_agent
    ) VALUES (
        p_user_id, p_action, p_resource_type, p_resource_id,
        p_details, p_ip_address, p_user_agent
    ) RETURNING id INTO log_id;
    
    RETURN log_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

