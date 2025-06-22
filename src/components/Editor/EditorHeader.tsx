
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { Crown, Focus, Heart, Save, ChevronUp, ChevronDown, PanelLeftClose } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useSidebar } from '@/components/ui/sidebar';

interface EditorHeaderProps {
  isNewNote: boolean;
  isFavorite: boolean;
  isSaving: boolean;
  canSave: boolean;
  isCollapsed?: boolean;
  isHeaderCollapsed?: boolean;
  onFavoriteToggle: () => void;
  onFocusModeToggle: () => void;
  onHeaderCollapseToggle?: () => void;
  onSave: () => void;
  onCollapseAllBars?: () => void;
}

const headerVariants: Variants = {
  expanded: {
    height: "auto",
    padding: "1.5rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  collapsed: {
    height: "auto",
    padding: "1rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  focus: {
    height: "auto",
    padding: "0.75rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  }
};

const contentVariants: Variants = {
  expanded: {
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    y: -10,
    transition: {
      duration: 0.15
    }
  }
};

const buttonVariants: Variants = {
  hover: {
    scale: 1.05,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  tap: {
    scale: 0.95
  }
};

const EditorHeader: React.FC<EditorHeaderProps> = ({
  isNewNote,
  isFavorite,
  isSaving,
  canSave,
  isCollapsed = false,
  isHeaderCollapsed = false,
  onFavoriteToggle,
  onFocusModeToggle,
  onHeaderCollapseToggle,
  onSave,
  onCollapseAllBars,
}) => {
  const { state, setOpen } = useSidebar();

  const handleCollapseAll = () => {
    // Collapse the sidebar
    setOpen(false);
    // Trigger the AI assistant collapse
    onCollapseAllBars?.();
  };

  if (isCollapsed) {
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
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleCollapseAll}
              className="text-gray-600 bg-gray-50/20 dark:bg-gray-800/20 dark:text-gray-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
            >
              <PanelLeftClose className="w-4 h-4 mr-1" />
              Collapse All
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="sm"
              onClick={onFocusModeToggle}
              className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
            >
              <Focus className="w-4 h-4 mr-1" />
              Focus
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button
              variant="ghost"
              size="sm"
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
            </Button>
          </motion.div>
          <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
            <Button 
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
            </Button>
          </motion.div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={headerVariants}
      animate={isHeaderCollapsed ? 'collapsed' : 'expanded'}
      className="flex justify-between items-start glass rounded-2xl shadow-large"
    >
      <div className="flex items-center gap-4">
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={onHeaderCollapseToggle}
            className="w-8 h-8 text-gray-500 hover:text-foreground transition-colors self-start mt-1"
          >
            <motion.div
              animate={{ rotate: isHeaderCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isHeaderCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
            </motion.div>
          </Button>
        </motion.div>
        <AnimatePresence>
          {!isHeaderCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <motion.h1 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center gap-3 dark:from-blue-400 dark:to-purple-400"
              >
                {isNewNote ? 'Create New Note' : 'Edit Note'}
                <motion.div
                  animate={{ 
                    rotate: [0, 10, -10, 0],
                    scale: [1, 1.1, 1]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: 'reverse'
                  }}
                >
                  <Crown className="w-8 h-8 text-yellow-500" />
                </motion.div>
              </motion.h1>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="text-gray-600 text-lg font-medium mt-1 dark:text-slate-300"
              >
                {isNewNote ? 'Create with the most advanced AI writing tools available' : 'Edit with world-class AI writing assistance'}
              </motion.p>
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="flex items-center gap-2 mt-2"
              >
                <motion.div
                  animate={{ 
                    boxShadow: [
                      "0 0 0 0 rgba(59, 130, 246, 0.7)",
                      "0 0 0 10px rgba(59, 130, 246, 0)",
                      "0 0 0 0 rgba(59, 130, 246, 0)"
                    ]
                  }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-0 backdrop-blur-md">
                    ⚡ AI-Powered
                  </Badge>
                </motion.div>
                <Badge variant="outline" className="border-0 bg-yellow-100/20 backdrop-blur-sm text-yellow-700 dark:bg-yellow-400/10 dark:text-yellow-300">
                  🏆 Better than Notion AI
                </Badge>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <div className="flex gap-3">
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleCollapseAll}
            className="text-gray-600 bg-gray-50/20 dark:bg-gray-800/20 dark:text-gray-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
          >
            <PanelLeftClose className="w-4 h-4 mr-2" />
            Collapse All Bars
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFocusModeToggle}
            className="text-purple-600 bg-purple-50/20 dark:bg-purple-900/20 dark:text-purple-400 hover:scale-105 transition-all backdrop-blur-sm border-0"
          >
            <Focus className="w-4 h-4 mr-2" />
            Focus Mode
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button
            variant="ghost"
            size="sm"
            onClick={onFavoriteToggle}
            className={`${isFavorite ? 'text-red-500 bg-red-50/20 dark:bg-red-900/20' : 'text-gray-400 dark:text-slate-400'} hover:scale-105 transition-all backdrop-blur-sm border-0`}
          >
            <motion.div
              animate={isFavorite ? { scale: [1, 1.2, 1] } : {}}
              transition={{ duration: 0.3 }}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current' : ''}`} />
            </motion.div>
            {isFavorite ? 'Favorited' : 'Add to Favorites'}
          </Button>
        </motion.div>
        <motion.div variants={buttonVariants} whileHover="hover" whileTap="tap">
          <Button 
            onClick={onSave} 
            disabled={!canSave || isSaving} 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-0 backdrop-blur-md"
          >
            <motion.div
              animate={isSaving ? { rotate: 360 } : {}}
              transition={{ duration: 1, repeat: isSaving ? Infinity : 0 }}
            >
              <Save className="w-4 h-4 mr-2" />
            </motion.div>
            {isSaving ? 'Saving...' : 'Save Note'}
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default EditorHeader;
