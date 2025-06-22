
import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Settings, 
  Book, 
  Edit, 
  Plus,
  Search,
  Github,
  PanelLeftClose,
  PanelLeftOpen,
  Calendar
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
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { useAuth } from '../../contexts/AuthContext';

const menuItems = [
  { icon: Book, label: 'Dashboard', path: '/dashboard' },
  { icon: Plus, label: 'AI Chat', path: '/chat' },
  { icon: Edit, label: 'Editor', path: '/editor' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: Search, label: 'Notes', path: '/notes' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export function AppSidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { state, toggleSidebar } = useSidebar();

  return (
    <Sidebar collapsible="icon" className="glass border-r border-border/50 backdrop-blur-md">
      <SidebarHeader className="p-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 group-data-[collapsible=icon]:justify-center">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
              <Github className="text-white w-5 h-5" />
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
                    <item.icon className="w-5 h-5 flex-shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
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
