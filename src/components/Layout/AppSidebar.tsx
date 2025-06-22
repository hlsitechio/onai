
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Book, 
  Edit, 
  Plus,
  Search,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar,
  FolderIcon,
  FileText
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '../../contexts/AuthContext';
import { useNotes } from '../../contexts/NotesContext';
import { useFolders } from '../../contexts/FoldersContext';
import NotesTree from '../Sidebar/NotesTree';

const menuItems = [
  { icon: Book, label: 'Dashboard', path: '/dashboard', color: 'text-blue-500' },
  { icon: Plus, label: 'AI Chat', path: '/chat', color: 'text-green-500' },
  { icon: Edit, label: 'Editor', path: '/editor', color: 'text-purple-500' },
  { icon: Calendar, label: 'Calendar', path: '/calendar', color: 'text-orange-500' },
  { icon: Settings, label: 'Settings', path: '/settings', color: 'text-gray-500' },
];

const sidebarVariants = {
  expanded: {
    width: "var(--sidebar-width)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  },
  collapsed: {
    width: "4rem",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 30,
      duration: 0.3
    }
  }
};

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
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  },
  collapsed: {
    scale: 1.1,
    rotate: 0,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 25
    }
  }
};

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const { notes } = useNotes();
  const { folders } = useFolders();

  const isCollapsed = state === 'collapsed';

  return (
    <TooltipProvider>
      <motion.div
        variants={sidebarVariants}
        animate={isCollapsed ? 'collapsed' : 'expanded'}
        className="glass border-r border-border/50 backdrop-blur-md h-screen overflow-hidden"
      >
        <Sidebar collapsible="icon" className="glass border-r border-border/50 backdrop-blur-md">
          <SidebarHeader className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
                <motion.div 
                  variants={iconVariants}
                  animate={isCollapsed ? 'collapsed' : 'expanded'}
                  className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center"
                >
                  <span className="text-white font-bold text-sm">AI</span>
                </motion.div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      variants={contentVariants}
                      initial="collapsed"
                      animate="expanded"
                      exit="collapsed"
                      className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden"
                    >
                      Online Note AI
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleSidebar}
                  className="h-8 w-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30 group-data-[collapsible=icon]:mx-auto"
                  title={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
                >
                  <motion.div
                    animate={{ rotate: isCollapsed ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    {state === 'expanded' ? (
                      <PanelLeftClose className="w-4 h-4" />
                    ) : (
                      <PanelLeftOpen className="w-4 h-4" />
                    )}
                  </motion.div>
                </Button>
              </motion.div>
            </div>
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
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
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            {/* Collapsed State Summaries */}
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

            {/* Notes Tree Section */}
            <AnimatePresence>
              {!isCollapsed && (
                <motion.div
                  variants={contentVariants}
                  initial="collapsed"
                  animate="expanded"
                  exit="collapsed"
                >
                  <SidebarGroup className="group-data-[collapsible=icon]:hidden">
                    <NotesTree />
                  </SidebarGroup>
                </motion.div>
              )}
            </AnimatePresence>
          </SidebarContent>

          <SidebarSeparator />

          <SidebarFooter className="p-4">
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
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </TooltipProvider>
  );
}
