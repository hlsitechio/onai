import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();
  const { notes } = useNotes();
  const { folders } = useFolders();

  const isCollapsed = state === 'collapsed';

  if (isCollapsed) {
    return (
      <TooltipProvider>
        <Sidebar collapsible="icon" className="glass border-r border-border/50 backdrop-blur-md">
          <SidebarHeader className="p-3">
            <div className="flex flex-col items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">AI</span>
              </div>
              
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={toggleSidebar}
                    className="h-8 w-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30"
                  >
                    <PanelLeftOpen className="w-4 h-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>Expand sidebar</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </SidebarHeader>

          <SidebarContent className="p-3">
            {/* Menu Items */}
            <div className="space-y-2 mb-4">
              {menuItems.map((item) => (
                <Tooltip key={item.path}>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => navigate(item.path)}
                      className={`w-10 h-10 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30 ${
                        location.pathname === item.path 
                          ? 'bg-primary/20 text-primary' 
                          : ''
                      }`}
                    >
                      <item.icon className={`w-5 h-5 ${location.pathname === item.path ? '' : item.color}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              ))}
            </div>

            {/* Folders Summary */}
            {folders.length > 0 && (
              <div className="mb-2">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center">
                      <FolderIcon className="w-4 h-4 text-blue-600 dark:text-blue-400 mb-1" />
                      <Badge className="text-xs bg-blue-100/20 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 px-1 py-0 min-w-0 h-3">
                        {folders.length}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{folders.length} Folders</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}

            {/* Notes Summary */}
            {notes.length > 0 && (
              <div className="mb-4">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-10 h-10 glass shadow-medium rounded-lg flex flex-col items-center justify-center">
                      <FileText className="w-4 h-4 text-green-600 dark:text-green-400 mb-1" />
                      <Badge className="text-xs bg-green-100/20 text-green-700 dark:bg-green-900/30 dark:text-green-300 px-1 py-0 min-w-0 h-3">
                        {notes.length}
                      </Badge>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{notes.length} Notes</p>
                  </TooltipContent>
                </Tooltip>
              </div>
            )}
          </SidebarContent>

          <SidebarFooter className="p-3">
            <Tooltip>
              <TooltipTrigger asChild>
                <Avatar className="w-10 h-10 mx-auto">
                  <AvatarImage src={user?.avatar} />
                  <AvatarFallback>{user?.name?.[0]}</AvatarFallback>
                </Avatar>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{user?.name}</p>
              </TooltipContent>
            </Tooltip>
          </SidebarFooter>
        </Sidebar>
      </TooltipProvider>
    );
  }

  return (
    <Sidebar collapsible="icon" className="glass border-r border-border/50 backdrop-blur-md">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">AI</span>
            </div>
            <span className="text-xl font-bold text-foreground group-data-[collapsible=icon]:hidden">
              Online Note AI
            </span>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleSidebar}
            className="h-8 w-8 glass shadow-medium hover:bg-white/20 dark:hover:bg-slate-700/30 group-data-[collapsible=icon]:mx-auto"
            title={state === 'expanded' ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {state === 'expanded' ? (
              <PanelLeftClose className="w-4 h-4" />
            ) : (
              <PanelLeftOpen className="w-4 h-4" />
            )}
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.path}>
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
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator />

        {/* Notes Tree Section */}
        <SidebarGroup className="group-data-[collapsible=icon]:hidden">
          <NotesTree />
        </SidebarGroup>
      </SidebarContent>

      <SidebarSeparator />

      <SidebarFooter className="p-4">
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
        <Button
          variant="ghost"
          size="sm"
          className="w-full hover:bg-destructive/10 hover:text-destructive group-data-[collapsible=icon]:p-0 group-data-[collapsible=icon]:w-12 group-data-[collapsible=icon]:h-12"
          onClick={logout}
        >
          <span className="group-data-[collapsible=icon]:hidden">Sign Out</span>
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
