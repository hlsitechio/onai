
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Book, 
  Edit, 
  Plus,
  Calendar
} from 'lucide-react';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const menuItems = [
  { icon: Book, label: 'Dashboard', path: '/dashboard', color: 'text-blue-500' },
  { icon: Plus, label: 'AI Chat', path: '/chat', color: 'text-green-500' },
  { icon: Edit, label: 'Editor', path: '/editor', color: 'text-purple-500' },
  { icon: Calendar, label: 'Calendar', path: '/calendar', color: 'text-orange-500' },
  { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500' },
];

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

const iconVariants = {
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

export function NavigationMenu() {
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <SidebarMenu className="space-y-2">
      {menuItems.map((item, index) => (
        <SidebarMenuItem key={item.path}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ x: isCollapsed ? 0 : 4 }}
            whileTap={{ scale: 0.95 }}
          >
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <SidebarMenuButton
                    onClick={() => navigate(item.path)}
                    isActive={location.pathname === item.path}
                    className={`h-12 rounded-xl transition-all duration-200 relative isolate border-0 justify-center ${
                      location.pathname === item.path 
                        ? 'bg-primary/10 text-primary' 
                        : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground'
                    }`}
                  >
                    <motion.div
                      variants={iconVariants}
                      animate={isCollapsed ? 'collapsed' : 'expanded'}
                    >
                      <item.icon className={`w-5 h-5 ${location.pathname === item.path ? '' : item.color}`} />
                    </motion.div>
                  </SidebarMenuButton>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{item.label}</p>
                </TooltipContent>
              </Tooltip>
            ) : (
              <SidebarMenuButton
                onClick={() => navigate(item.path)}
                isActive={location.pathname === item.path}
                tooltip={item.label}
                className={`h-12 rounded-xl transition-all duration-200 relative isolate border-0 ${
                  location.pathname === item.path 
                    ? 'bg-primary/10 text-primary' 
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground hover:translate-x-1'
                }`}
              >
                <item.icon className={`w-5 h-5 flex-shrink-0 ${location.pathname === item.path ? '' : item.color}`} />
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="truncate"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </SidebarMenuButton>
            )}
          </motion.div>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
