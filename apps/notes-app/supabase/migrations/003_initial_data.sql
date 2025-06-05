-- OneAI Notes Initial Data
-- Migration: 003_initial_data.sql

-- Insert default AI agents
INSERT INTO ai_agents (id, name, description, capabilities, model, system_prompt, temperature, max_tokens) VALUES
(
    uuid_generate_v4(),
    'Writing Assistant',
    'Helps improve grammar, style, and structure of your writing',
    ARRAY['grammar_check', 'style_improvement', 'structure_enhancement', 'clarity_improvement'],
    'gemini-2.5-flash',
    'You are a professional writing assistant. Help users improve their writing by correcting grammar, enhancing style, improving structure, and making the text clearer and more engaging. Always maintain the original meaning and tone while making improvements.',
    0.3,
    2000
),
(
    uuid_generate_v4(),
    'Research Assistant',
    'Helps with research, fact-checking, and information gathering',
    ARRAY['research', 'fact_checking', 'information_gathering', 'source_verification'],
    'gemini-2.5-flash',
    'You are a research assistant. Help users with research tasks, fact-checking, and gathering relevant information. Provide accurate, well-sourced information and suggest reliable sources for further reading.',
    0.2,
    3000
),
(
    uuid_generate_v4(),
    'Creative Assistant',
    'Helps with brainstorming, idea generation, and creative writing',
    ARRAY['brainstorming', 'idea_generation', 'creative_writing', 'storytelling'],
    'gemini-2.5-flash',
    'You are a creative assistant. Help users with brainstorming, generating new ideas, creative writing, and storytelling. Be imaginative, inspiring, and help users think outside the box while providing practical suggestions.',
    0.8,
    2500
),
(
    uuid_generate_v4(),
    'Code Assistant',
    'Helps with programming, code review, and technical documentation',
    ARRAY['code_generation', 'code_review', 'debugging', 'documentation'],
    'gemini-2.5-flash',
    'You are a programming assistant. Help users with code generation, code review, debugging, and technical documentation. Provide clean, efficient, and well-commented code following best practices.',
    0.1,
    4000
),
(
    uuid_generate_v4(),
    'Summarizer',
    'Creates concise summaries and extracts key points from text',
    ARRAY['summarization', 'key_points_extraction', 'content_condensation'],
    'gemini-2.5-flash',
    'You are a summarization specialist. Create concise, accurate summaries that capture the main points and key information from the provided text. Focus on the most important concepts and maintain clarity.',
    0.2,
    1500
),
(
    uuid_generate_v4(),
    'Translator',
    'Translates text between different languages while preserving meaning',
    ARRAY['translation', 'language_detection', 'cultural_adaptation'],
    'gemini-2.5-flash',
    'You are a professional translator. Translate text accurately between languages while preserving the original meaning, tone, and context. Consider cultural nuances and provide natural-sounding translations.',
    0.1,
    2000
);

-- Create default system folders function
CREATE OR REPLACE FUNCTION create_default_folders(user_uuid UUID)
RETURNS VOID AS $$
BEGIN
    -- Create default folders for new users
    INSERT INTO folders (name, color, icon, user_id, is_system) VALUES
    ('Quick Notes', '#3B82F6', 'zap', user_uuid, true),
    ('Personal', '#10B981', 'user', user_uuid, true),
    ('Work', '#F59E0B', 'briefcase', user_uuid, true),
    ('Ideas', '#8B5CF6', 'lightbulb', user_uuid, true),
    ('Archive', '#6B7280', 'archive', user_uuid, true),
    ('Trash', '#EF4444', 'trash-2', user_uuid, true);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create welcome note function
CREATE OR REPLACE FUNCTION create_welcome_note(user_uuid UUID)
RETURNS UUID AS $$
DECLARE
    note_id UUID;
    quick_notes_folder_id UUID;
BEGIN
    -- Get the Quick Notes folder ID
    SELECT id INTO quick_notes_folder_id 
    FROM folders 
    WHERE user_id = user_uuid AND name = 'Quick Notes' AND is_system = true;
    
    -- Create welcome note
    INSERT INTO notes (
        title, 
        content, 
        folder_id, 
        user_id, 
        word_count, 
        character_count, 
        reading_time,
        tags
    ) VALUES (
        'Welcome to OneAI Notes! 🎉',
        E'# Welcome to OneAI Notes!\n\nCongratulations on joining OneAI Notes - your AI-powered note-taking companion! Here\'s what makes us special:\n\n## 🧠 AI-Powered Features\n- **Smart Writing Assistant**: Get help with grammar, style, and clarity\n- **Content Generation**: Create summaries, expand ideas, and generate content\n- **Multi-language Support**: Translate and work in 100+ languages\n- **Research Assistant**: Get help with fact-checking and research\n\n## 📝 Powerful Editor\n- **Rich Text Editing**: Format your notes with ease\n- **Focus Mode**: Distraction-free writing environment\n- **Auto-save**: Never lose your work\n- **Markdown Support**: Write in markdown if you prefer\n\n## 🔒 Security & Privacy\n- **End-to-end Encryption**: Your data is always secure\n- **Zero-knowledge Architecture**: We can\'t read your notes\n- **Local Storage**: Works offline with sync when online\n\n## 🤝 Collaboration\n- **Real-time Sharing**: Collaborate with others in real-time\n- **Comments & Feedback**: Add comments and suggestions\n- **Version History**: Track changes over time\n\n## 🚀 Getting Started\n1. **Create your first note** by clicking the + button in the sidebar\n2. **Try the AI assistant** by clicking the brain icon in the top bar\n3. **Organize with folders** by creating custom folders for your notes\n4. **Enable focus mode** for distraction-free writing\n5. **Share your notes** with others when you\'re ready to collaborate\n\n## 💡 Pro Tips\n- Use **Ctrl/Cmd + /** to quickly search your notes\n- Try **focus mode** (pen icon) for distraction-free writing\n- Use the **AI assistant** to enhance your writing\n- Organize notes with **tags** and **folders**\n- Enable **dark mode** for comfortable night writing\n\n---\n\n**Need help?** Check out our documentation or contact support at info@onlinenote.ai\n\n**Happy note-taking!** 📚✨',
        quick_notes_folder_id,
        user_uuid,
        156,
        1247,
        1,
        ARRAY['welcome', 'getting-started', 'tutorial']
    ) RETURNING id INTO note_id;
    
    RETURN note_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create default folders and welcome note for new users
CREATE OR REPLACE FUNCTION setup_new_user()
RETURNS TRIGGER AS $$
BEGIN
    -- Create default folders
    PERFORM create_default_folders(NEW.id);
    
    -- Create welcome note
    PERFORM create_welcome_note(NEW.id);
    
    -- Create audit log
    PERFORM create_audit_log(
        NEW.id,
        'user_created',
        'user',
        NEW.id,
        jsonb_build_object('email', NEW.email, 'name', NEW.name)
    );
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER setup_new_user_trigger
    AFTER INSERT ON users
    FOR EACH ROW EXECUTE FUNCTION setup_new_user();

-- Function to clean up expired shares
CREATE OR REPLACE FUNCTION cleanup_expired_shares()
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    UPDATE shared_notes 
    SET is_active = false 
    WHERE expires_at IS NOT NULL 
    AND expires_at < NOW() 
    AND is_active = true;
    
    GET DIAGNOSTICS deleted_count = ROW_COUNT;
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to get user statistics
CREATE OR REPLACE FUNCTION get_user_stats(user_uuid UUID)
RETURNS TABLE (
    total_notes INTEGER,
    total_words INTEGER,
    total_characters INTEGER,
    ai_requests_today INTEGER,
    shared_notes INTEGER,
    folders_count INTEGER,
    last_activity TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*)::INTEGER FROM notes WHERE user_id = user_uuid AND is_deleted = false),
        (SELECT COALESCE(SUM(word_count), 0)::INTEGER FROM notes WHERE user_id = user_uuid AND is_deleted = false),
        (SELECT COALESCE(SUM(character_count), 0)::INTEGER FROM notes WHERE user_id = user_uuid AND is_deleted = false),
        (SELECT COUNT(*)::INTEGER FROM ai_requests WHERE user_id = user_uuid AND created_at >= CURRENT_DATE),
        (SELECT COUNT(*)::INTEGER FROM shared_notes WHERE shared_by = user_uuid AND is_active = true),
        (SELECT COUNT(*)::INTEGER FROM folders WHERE user_id = user_uuid),
        (SELECT MAX(updated_at) FROM notes WHERE user_id = user_uuid);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to search notes with full-text search
CREATE OR REPLACE FUNCTION search_notes(
    user_uuid UUID,
    search_query TEXT,
    limit_count INTEGER DEFAULT 20,
    offset_count INTEGER DEFAULT 0
)
RETURNS TABLE (
    id UUID,
    title VARCHAR(500),
    content TEXT,
    tags TEXT[],
    folder_id UUID,
    created_at TIMESTAMP WITH TIME ZONE,
    updated_at TIMESTAMP WITH TIME ZONE,
    word_count INTEGER,
    rank REAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        n.id,
        n.title,
        n.content,
        n.tags,
        n.folder_id,
        n.created_at,
        n.updated_at,
        n.word_count,
        ts_rank(to_tsvector('english', n.title || ' ' || n.content), plainto_tsquery('english', search_query)) as rank
    FROM notes n
    WHERE (
        n.user_id = user_uuid
        OR n.is_public = true
        OR n.id IN (
            SELECT sn.note_id FROM shared_notes sn
            WHERE sn.shared_with = user_uuid 
            AND sn.is_active = true 
            AND (sn.expires_at IS NULL OR sn.expires_at > NOW())
            AND sn.can_read = true
        )
    )
    AND n.is_deleted = false
    AND (
        to_tsvector('english', n.title || ' ' || n.content) @@ plainto_tsquery('english', search_query)
        OR n.tags && string_to_array(lower(search_query), ' ')
    )
    ORDER BY rank DESC, n.updated_at DESC
    LIMIT limit_count OFFSET offset_count;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

