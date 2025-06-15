
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getSharedNoteById } from '@/utils/supabaseStorage';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, AlertCircle } from 'lucide-react';

const SharedNoteViewer = () => {
  const { shareId } = useParams<{ shareId: string }>();
  const [content, setContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSharedNote = async () => {
      if (!shareId) {
        setError('Invalid share ID');
        setLoading(false);
        return;
      }

      try {
        const noteContent = await getSharedNoteById(shareId);
        if (noteContent) {
          setContent(noteContent);
        } else {
          setError('Shared note not found or has expired');
        }
      } catch (err) {
        console.error('Error loading shared note:', err);
        setError('Failed to load shared note');
      } finally {
        setLoading(false);
      }
    };

    loadSharedNote();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-noteflow-400 mx-auto mb-4" />
          <p className="text-gray-300">Loading shared note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] flex items-center justify-center p-4">
        <Card className="max-w-md w-full bg-black/60 border-red-500/20">
          <CardHeader>
            <CardTitle className="flex items-center text-red-400">
              <AlertCircle className="w-5 h-5 mr-2" />
              Error
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-300">{error}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#050510] to-[#0a0518] p-4">
      <div className="container mx-auto max-w-4xl">
        <Card className="bg-black/60 border-white/10">
          <CardHeader>
            <CardTitle className="text-white">Shared Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="prose prose-invert max-w-none">
              <pre className="whitespace-pre-wrap text-gray-300 font-mono text-sm">
                {content}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SharedNoteViewer;
