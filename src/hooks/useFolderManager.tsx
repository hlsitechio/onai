
import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { v4 as uuidv4 } from 'uuid';
import { getUserFolders, createFolder as createFolderUtil, Folder } from '@/utils/folderUtils';

export function useFolderManager() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);

  // Load folders when user is authenticated
  useEffect(() => {
    if (user) {
      loadFolders();
    } else {
      setLoading(false);
      setFolders([]);
    }
  }, [user]);

  const loadFolders = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const folderData = await getUserFolders(user.id);
      setFolders(folderData);
    } catch (error) {
      console.error('Error loading folders:', error);
      toast({
        title: 'Error loading folders',
        description: 'Failed to load your folders. Please try refreshing.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const createFolder = async (name: string, parentId: string | null = null) => {
    if (!user) {
      toast({
        title: 'Authentication required',
        description: 'Please sign in to create folders.',
        variant: 'destructive',
      });
      return null;
    }

    try {
      const createdFolder = await createFolderUtil(name, user.id, parentId);
      
      if (createdFolder) {
        setFolders(prev => [...prev, createdFolder]);
        
        toast({
          title: 'Folder created',
          description: `Folder "${name}" created successfully.`,
        });
      }

      return createdFolder;
    } catch (error) {
      console.error('Error creating folder:', error);
      toast({
        title: 'Error creating folder',
        description: 'Failed to create folder. Please try again.',
        variant: 'destructive',
      });
      return null;
    }
  };

  const renameFolder = async (folderId: string, newName: string) => {
    if (!user) return false;

    try {
      const { data, error } = await supabase
        .from('folders')
        .update({ 
          name: newName.trim(),
          updated_at: new Date().toISOString()
        })
        .eq('id', folderId)
        .eq('user_id', user.id)
        .select()
        .single();

      if (error) throw error;

      setFolders(prev => 
        prev.map(folder => 
          folder.id === folderId ? { ...folder, name: newName.trim(), updated_at: new Date().toISOString() } : folder
        )
      );

      toast({
        title: 'Folder renamed',
        description: `Folder renamed to "${newName}".`,
      });

      return true;
    } catch (error) {
      console.error('Error renaming folder:', error);
      toast({
        title: 'Error renaming folder',
        description: 'Failed to rename folder. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const deleteFolder = async (folderId: string) => {
    if (!user) return false;

    try {
      // First, move all notes in this folder to root
      await supabase
        .from('notes_v2')
        .update({ parent_id: null })
        .eq('parent_id', folderId)
        .eq('user_id', user.id);

      // Delete the folder
      const { error } = await supabase
        .from('folders')
        .delete()
        .eq('id', folderId)
        .eq('user_id', user.id);

      if (error) throw error;

      setFolders(prev => prev.filter(folder => folder.id !== folderId));

      toast({
        title: 'Folder deleted',
        description: 'Folder deleted and notes moved to root.',
      });

      return true;
    } catch (error) {
      console.error('Error deleting folder:', error);
      toast({
        title: 'Error deleting folder',
        description: 'Failed to delete folder. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const moveNoteToFolder = async (noteId: string, folderId: string | null) => {
    if (!user) return false;

    try {
      const { error } = await supabase
        .from('notes_v2')
        .update({ 
          parent_id: folderId,
          updated_at: new Date().toISOString()
        })
        .eq('id', noteId)
        .eq('user_id', user.id);

      if (error) throw error;

      const folderName = folderId 
        ? folders.find(f => f.id === folderId)?.name || 'Unknown Folder'
        : 'Root';

      toast({
        title: 'Note moved',
        description: `Note moved to ${folderName}.`,
      });

      return true;
    } catch (error) {
      console.error('Error moving note:', error);
      toast({
        title: 'Error moving note',
        description: 'Failed to move note. Please try again.',
        variant: 'destructive',
      });
      return false;
    }
  };

  const getFolderPath = useCallback((folderId: string | null): string => {
    if (!folderId) return '';
    
    const folder = folders.find(f => f.id === folderId);
    if (!folder) return '';
    
    const parentPath = getFolderPath(folder.parent_id);
    return parentPath ? `${parentPath} / ${folder.name}` : folder.name;
  }, [folders]);

  return {
    folders,
    loading,
    createFolder,
    renameFolder,
    deleteFolder,
    moveNoteToFolder,
    getFolderPath,
    loadFolders,
  };
}
