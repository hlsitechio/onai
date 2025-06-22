
import React from 'react';
import { Crown, Focus, Heart, Save } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

interface EditorHeaderProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  isCollapsed?: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onSave: () => void;
}

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  isCollapsed = false,
  onFavoriteToggle,
  onFocusModeToggle,
  onSave,
}) => {
  if (isCollapsed) {
    return (
      <div className="flex justify-between items-center glass p-3 rounded-xl shadow-large">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
            <Crown className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-foreground">
            {isNewNote ? 'Creating...' : 'Editing...'}
          </span>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFocusModeToggle}
            className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
          >
            <Focus className="w-4 h-4 mr-1" />
            Focus
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onFavoriteToggle}
            className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all backdrop-blur-sm border-0`}
          >
            <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
            {isFavorite ? 'Favorited' : 'Favorite'}
          </Button>
          <Button onClick={onSave} disabled={!canSave || isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md">
            <Save className="w-4 h-4 mr-1" />
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-between items-start glass p-6 rounded-2xl shadow-large">
      <div className="flex items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 dark:from-blue-400 dark:to-purple-400">
            {isNewNote ? 'Create New Note' : 'Edit Note'}
            <Crown className="w-8 h-8 text-yellow-500" />
          </h1>
          <p className="text-gray-600 text-lg font-medium mt-1 dark:text-slate-300">
            {isNewNote ? 'Create with the most advanced AI writing tools available' : 'Edit with world-class AI writing assistance'}
          </p>
          <div className="flex items-center gap-2 mt-2">
            <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 backdrop-blur-md">
              ⚡ AI-Powered
            </Badge>
            <Badge variant="outline" className="border-0 bg-yellow-100/20 backdrop-blur-sm text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300">
              🏆 Better than Notion AI
            </Badge>
          </div>
        </div>
      </div>
      <div className="flex gap-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={onFocusModeToggle}
          className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
        >
          <Focus className="w-4 h-4 mr-2" />
          Focus Mode
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={onFavoriteToggle}
          className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all backdrop-blur-sm border-0`}
        >
          <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
          {isFavorite ? 'Favorited' : 'Add to Favorites'}
        </Button>
        <Button onClick={onSave} disabled={!canSave || isSaving} className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md">
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? 'Saving...' : 'Save Note'}
        </Button>
      </div>
    </div>
  );
};

export default EditorHeader;
