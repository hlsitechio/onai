
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FolderIcon, FileText } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { useNotes } from '../../../contexts/NotesContext';
import { useFolders } from '../../../contexts/FoldersContext';

export function CollapsedSummary() {
  const { state } = useSidebar();
  const { notes } = useNotes();
  const { folders } = useFolders();
  const isCollapsed = state === 'collapsed';

  return (
    <AnimatePresence>
      {isCollapsed && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ delay: 0.2 }}
          className="p-3 space-y-3"
        >
          {folders.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center mx-auto"
                >
                  <FolderIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                  <Badge className="text-xs bg-blue-100/20 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1 py-0 min-w-0 h-3">
                    {folders.length}
                  </Badge>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{folders.length} Folders</p>
              </TooltipContent>
            </Tooltip>
          )}

          {notes.length > 0 && (
            <Tooltip>
              <TooltipTrigger asChild>
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center mx-auto"
                >
                  <FileText className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
                  <Badge className="text-xs bg-green-100/20 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-1 py-0 min-w-0 h-3">
                    {notes.length}
                  </Badge>
                </motion.div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{notes.length} Notes</p>
              </TooltipContent>
            </Tooltip>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
