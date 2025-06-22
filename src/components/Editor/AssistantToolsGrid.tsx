
import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Search, Settings, Sparkles, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface AssistantToolsGridProps {
  content: string;
}

const AssistantToolsGrid: React.FC<AssistantToolsGridProps> = ({ content }) => {
  const tools = [
    { icon: Sparkles, label: 'Writing Suggestions', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Bot, label: 'Generate Ideas', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Search, label: 'Research Topic', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Settings, label: 'Tone Adjustment', color: 'text-pink-600 dark:text-pink-400' },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ delay: 0.2 }}
      className="space-y-3"
    >
      {tools.map((tool, index) => (
        <Tooltip key={tool.label}>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Button
                variant="ghost"
                size="icon"
                className="w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
              >
                <tool.icon className={`w-5 h-5 ${tool.color}`} />
              </Button>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>{tool.label}</p>
          </TooltipContent>
        </Tooltip>
      ))}

      {content.length > 0 && (
        <Tooltip>
          <TooltipTrigger asChild>
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
              className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center"
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
              <div className="text-xs text-blue-700 dark:text-blue-300 font-medium">
                {content.split(' ').filter(w => w.length > 0).length}
              </div>
            </motion.div>
          </TooltipTrigger>
          <TooltipContent side="left">
            <p>Word count: {content.split(' ').filter(w => w.length > 0).length}</p>
          </TooltipContent>
        </Tooltip>
      )}
    </motion.div>
  );
};

export default AssistantToolsGrid;
