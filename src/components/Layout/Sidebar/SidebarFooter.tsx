
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useSidebar } from '@/components/ui/sidebar';
import { useAuth } from '../../../contexts/AuthContext';

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
    x: -20,
    transition: {
      duration: 0.15
    }
  }
};

export function SidebarFooter() {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const isCollapsed = state === 'collapsed';

  return (
    <AnimatePresence>
      {!isCollapsed ? (
        <motion.div
          variants={contentVariants}
          initial="collapsed"
          animate="expanded"
          exit="collapsed"
        >
          <div className="flex items-center gap-3 mb-4 group-data-[collapsible=icon]:justify-center">
            <Avatar className="w-12 h-12 flex-shrink-0">
              <AvatarImage src={user?.avatar} />
              <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
            </Avatar>
            <div className="flex-1 group-data-[collapsible=icon]:hidden min-w-0">
              <p className="font-semibold text-sm text-foreground truncate">
                {user?.name}
              </p>
              <p className="text-xs text-muted-foreground truncate">
                {user?.email}
              </p>
            </div>
          </div>
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <Button
              variant="ghost"
              size="sm"
              className="w-full hover:bg-destructive/10 hover:text-destructive"
              onClick={logout}
            >
              Sign Out
            </Button>
          </motion.div>
        </motion.div>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Tooltip>
            <TooltipTrigger asChild>
              <motion.div whileHover={{ scale: 1.05 }}>
                <Avatar className="w-10 h-10 mx-auto">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </motion.div>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>{user?.name}</p>
            </TooltipContent>
          </Tooltip>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
