
import React from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarSeparator,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  TooltipProvider,
} from '@/components/ui/tooltip';
import { SidebarHeader as CustomSidebarHeader } from './Sidebar/SidebarHeader';
import { NavigationMenu } from './Sidebar/NavigationMenu';
import { CollapsedSummary } from './Sidebar/CollapsedSummary';
import { SidebarFooter as CustomSidebarFooter } from './Sidebar/SidebarFooter';
import NotesTree from '../Sidebar/NotesTree';

const sidebarVariants: Variants = {
  expanded: {
    width: "var(--sidebar-width)",
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
    x: -20,
    transition: {
      duration: 0.15
    }
  }
};

export function AppSidebar() {
  const { state } = useSidebar();
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
            <CustomSidebarHeader />
          </SidebarHeader>

          <SidebarContent>
            <SidebarGroup>
              <SidebarGroupContent>
                <NavigationMenu />
              </SidebarGroupContent>
            </SidebarGroup>

            <SidebarSeparator />

            <CollapsedSummary />

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
            <CustomSidebarFooter />
          </SidebarFooter>
        </Sidebar>
      </motion.div>
    </TooltipProvider>
  );
}
