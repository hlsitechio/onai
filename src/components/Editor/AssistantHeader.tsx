
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelRightClose, PanelRightOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface AssistantHeaderProps {
  isCollapsed: boolean;
  onToggle: (collapsed: boolean) => void;
}

const contentVariants = {
  expanded: {
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.1,
      duration: 0.2
    }
  },
  collapsed: {
    opacity: 0,
    x: 20,
    transition: {
      duration: 0.15
    }
  }
};

const AssistantHeader: React.FC<AssistantHeaderProps> = ({ isCollapsed, onToggle }) => {
  return (
    <div className="p-4 border-b border-border/50">
      <div className="flex items-center justify-between">
        <AnimatePresence>
          {!isCollapsed && (
            <motion.div
              variants={contentVariants}
              initial="collapsed"
              animate="expanded"
              exit="collapsed"
            >
              <h3 className="font-bold text-purple-800 dark:text-purple-300">AI Power Tools</h3>
              <p className="text-xs text-purple-600 dark:text-purple-400 mt-1">Next-generation features</p>
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onToggle(!isCollapsed)}
            className="w-8 h-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
          >
            <motion.div
              animate={{ rotate: isCollapsed ? 180 : 0 }}
              transition={{ duration: 0.2 }}
            >
              {isCollapsed ? (
                <PanelRightOpen className="w-4 h-4" />
              ) : (
                <PanelRightClose className="w-4 h-4" />
              )}
            </motion.div>
          </Button>
        </motion.div>
      </div>
    </div>
  );
};

export default AssistantHeader;
