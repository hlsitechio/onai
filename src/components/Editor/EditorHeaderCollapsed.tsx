
import React from 'react';
import { motion } from 'framer-motion';
import { Crown, Focus, Heart, Save, PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { useSidebar } from '@/components/ui/sidebar';
import { headerVariants } from './EditorHeaderTypes';
import EditorHeaderButton from './EditorHeaderButton';

interface EditorHeaderCollapsedProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onSave: () => void;
  onCollapseAllBars?: () => void;
}

const EditorHeaderCollapsed: React.FC<EditorHeaderCollapsedProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  onFavoriteToggle,
  onFocusModeToggle,
  onSave,
  onCollapseAllBars,
}) => {
  const { state, setOpen } = useSidebar();

  const handleCollapseAll = () => {
    if (state === 'collapsed') {
      setOpen(true);
    } else {
      setOpen(false);
    }
    onCollapseAllBars?.();
  };

  return (
    <motion.div
      variants={headerVariants}
      animate="focus"
      className="flex justify-between items-center glass rounded-xl shadow-large"
    >
      <div className="flex items-center gap-3">
        <motion.div 
          whileHover={{ rotate: 360 }}
          transition={{ duration: 0.5 }}
          className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center"
        >
          <Crown className="w-4 h-4 text-white" />
        </motion.div>
        <motion.span
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-lg font-semibold text-foreground"
        >
          {isNewNote ? 'Creating...' : 'Editing...'}
        </motion.span>
      </div>
      <div className="flex gap-2">
        <EditorHeaderButton
          onClick={handleCollapseAll}
          className="text-gray-600 bg-gray-50/20 dark:bg-gray-800/20 dark:text-gray-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
        >
          {state === 'collapsed' ? (
            <PanelLeftOpen className="w-4 h-4 mr-1" />
          ) : (
            <PanelLeftClose className="w-4 h-4 mr-1" />
          )}
          {state === 'collapsed' ? 'Expand All' : 'Collapse All'}
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onFocusModeToggle}
          className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
        >
          <Focus className="w-4 h-4 mr-1" />
          Focus
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onFavoriteToggle}
          className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all backdrop-blur-sm border-0`}
        >
          <motion.div
            animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
            transition={{ duration: 0.3 }}
          >
            <Heart className={`w-4 h-4 mr-1 ${isFavorite ? 'fill-current' : ''}`} />
          </motion.div>
          {isFavorite ? 'Favorited' : 'Favorite'}
        </EditorHeaderButton>
        <EditorHeaderButton
          onClick={onSave}
          disabled={!canSave || isSaving}
          className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md"
        >
          <motion.div
            animate={isSaving ? { rotate: 360 } : {}}
            transition={{ duration: 1, repeat: isSaving ? Infinity : 0 }}
          >
            <Save className="w-4 h-4 mr-1" />
          </motion.div>
          {isSaving ? 'Saving...' : 'Save'}
        </EditorHeaderButton>
      </div>
    </motion.div>
  );
};

export default EditorHeaderCollapsed;
