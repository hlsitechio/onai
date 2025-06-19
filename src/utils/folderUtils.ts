
import { supabase } from '@/integrations/supabase/client';

export interface Folder {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export const getUserFolders = async (userId: string): Promise<Folder[]> => {
  try {
    // Direct query to folders table
    const { data, error } = await supabase
      .from('folders' as any)
      .select('*')
      .eq('user_id', userId)
      .order('name', { ascending: true });

    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching folders:', error);
    return [];
  }
};

export const createFolder = async (
  name: string, 
  userId: string, 
  parentId: string | null = null
): Promise<Folder | null> => {
  try {
    const { data, error } = await supabase
      .from('folders' as any)
      .insert({
        name: name.trim(),
        parent_id: parentId,
        user_id: userId,
      })
      .select()
      .single();

    if (error) throw error;
    return data as Folder;
  } catch (error) {
    console.error('Error creating folder:', error);
    return null;
  }
};
