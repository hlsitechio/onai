import React, { useState, useEffect, useImperativeHandle } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { 
  ChevronLeft, 
  ChevronRight, 
  Bot, 
  Search, 
  Settings, 
  Sparkles,
  Zap,
  PanelRightClose,
  PanelRightOpen
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import WritingSuggestions from './WritingSuggestions';

interface CollapsibleAssistantProps {
  content: string;
  onSuggestionApply: (original: string, suggestion: string) => void;
  onCollapseChange?: (isCollapsed: boolean) => void;
  collapseRef?: React.MutableRefObject<(() => void) | undefined>;
}

const sidebarVariants: Variants = {
  expanded: {
    width: "20rem",
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  collapsed: {
    width: "4rem",
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

const iconVariants: Variants = {
  expanded: {
    scale: 1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  },
  collapsed: {
    scale: 1.1,
    rotate: 0,
    transition: {
      type: "spring" as const,
      stiffness: 400,
      damping: 25
    }
  }
};

const CollapsibleAssistant: React.FC<CollapsibleAssistantProps> = ({
  content,
  onSuggestionApply,
  onCollapseChange,
  collapseRef
}) => {
  const [isCollapsed, setIsCollapsed] = useState(false);

  useEffect(() => {
    onCollapseChange?.(isCollapsed);
  }, [isCollapsed, onCollapseChange]);

  // Expose collapse function via ref
  useImperativeHandle(collapseRef, () => ({
    collapse: () => setIsCollapsed(true)
  }), []);

  // Update the ref whenever it changes
  useEffect(() => {
    if (collapseRef) {
      collapseRef.current = () => setIsCollapsed(true);
    }
  }, [collapseRef]);

  const handleToggle = (collapsed: boolean) => {
    setIsCollapsed(collapsed);
  };

  const tools = [
    { icon: Sparkles, label: 'Writing Suggestions', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Bot, label: 'Generate Ideas', color: 'text-purple-600 dark:text-purple-400' },
    { icon: Search, label: 'Research Topic', color: 'text-blue-600 dark:text-blue-400' },
    { icon: Settings, label: 'Tone Adjustment', color: 'text-pink-600 dark:text-pink-400' },
  ];

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="h-full flex flex-col bg-sidebar border-l border-border/50 backdrop-blur-md overflow-hidden"
      >
        {/* Header with Toggle */}
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
                onClick={() => handleToggle(!isCollapsed)}
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

        {/* Content */}
        <div className="flex-1 p-4 space-y-4 overflow-auto">
          {/* ... keep existing code (AnimatePresence with collapsed and expanded content) */}
          <AnimatePresence>
            {isCollapsed ? (
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
            ) : (
              <motion.div
                variants={contentVariants}
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                className="space-y-4"
              >
                <WritingSuggestions
                  content={content}
                  onSuggestionApply={onSuggestionApply}
                />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Card className="glass shadow-large">
                    <CardContent className="p-5">
                      <div className="flex items-center gap-3 mb-4">
                        <motion.div 
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.5 }}
                          className="p-2 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg"
                        >
                          <Sparkles className="w-5 h-5 text-white" />
                        </motion.div>
                        <div>
                          <h3 className="font-bold text-purple-800 dark:text-purple-300">AI Power Tools</h3>
                          <p className="text-xs text-purple-600 dark:text-purple-400">Next-generation features</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        {[
                          { icon: Bot, label: 'Generate Ideas', badge: 'NEW', badgeColor: 'purple' },
                          { icon: Search, label: 'Research Topic', badge: 'PRO', badgeColor: 'blue' },
                          { icon: Settings, label: 'Tone Adjustment', badge: 'AI', badgeColor: 'pink' }
                        ].map((item, index) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.1 }}
                            whileHover={{ x: 4 }}
                            whileTap={{ scale: 0.98 }}
                          >
                            <Button variant="outline" size="sm" className="w-full justify-start border-0 bg-white/10 backdrop-blur-sm hover:bg-white/20 dark:bg-slate-600/20 dark:hover:bg-slate-600/30 dark:text-slate-200">
                              <item.icon className={`w-4 h-4 mr-2 ${item.badgeColor === 'purple' ? 'text-purple-600 dark:text-purple-400' : item.badgeColor === 'blue' ? 'text-blue-600 dark:text-blue-400' : 'text-pink-600 dark:text-pink-400'}`} />
                              {item.label}
                              <Badge className={`ml-auto bg-${item.badgeColor}-100/20 backdrop-blur-sm text-${item.badgeColor}-700 border-0 dark:bg-${item.badgeColor}-900/30 dark:text-${item.badgeColor}-300`}>
                                {item.badge}
                              </Badge>
                            </Button>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>

                {content.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <Card className="glass shadow-medium">
                      <CardContent className="p-5">
                        <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2 dark:text-slate-200">
                          <motion.div
                            animate={{ 
                              scale: [1, 1.1, 1],
                              rotate: [0, 5, -5, 0] 
                            }}
                            transition={{ 
                              duration: 2,
                              repeat: Infinity,
                              repeatType: 'reverse'
                            }}
                          >
                            <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                          </motion.div>
                          Writing Analytics
                        </h3>
                        <div className="space-y-3 text-sm">
                          {[
                            { label: 'Words', value: content.split(' ').filter(w => w.length > 0).length, color: 'blue' },
                            { label: 'Characters', value: content.length, color: 'purple' },
                            { label: 'Reading time', value: `~${Math.ceil(content.split(' ').length / 200)} min`, color: 'green' }
                          ].map((stat, index) => (
                            <motion.div
                              key={stat.label}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.5 + index * 0.1 }}
                              className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg border-0 dark:bg-slate-700/30"
                            >
                              <span className="font-medium dark:text-slate-300">{stat.label}:</span>
                              <Badge variant="secondary" className={`bg-${stat.color}-100/20 backdrop-blur-sm text-${stat.color}-700 border-0 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-300`}>
                                {stat.value}
                              </Badge>
                            </motion.div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </TooltipProvider>
  );
};

export default CollapsibleAssistant;
