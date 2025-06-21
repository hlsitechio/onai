
import React from 'react';
import FormatControls from '../controls/FormatControls';
import HeadingControls from '../controls/HeadingControls';
import ListControls from '../controls/ListControls';
import AlignmentControls from '../controls/AlignmentControls';
import ColorControls from '../controls/ColorControls';
import LinkControls from '../controls/LinkControls';
import ImageControls from '../controls/ImageControls';
import CodeBlockControls from '../controls/CodeBlockControls';
import QuoteControls from '../controls/QuoteControls';
import DividerControls from '../controls/DividerControls';
import TableControls from '../controls/TableControls';
import InsertControls from '../controls/InsertControls';
import HistoryControls from '../controls/HistoryControls';
import FontControls from '../controls/FontControls';
import FontSizeControls from '../controls/FontSizeControls';
import SidebarToggle from '../controls/SidebarToggle';

// Registry mapping component names to actual components
const TOOLBAR_COMPONENTS: Record<string, React.ComponentType<any>> = {
  FormatControls,
  HeadingControls,
  ListControls,
  AlignmentControls,
  ColorControls,
  LinkControls,
  ImageControls,
  CodeBlockControls,
  QuoteControls,
  DividerControls,
  TableControls,
  InsertControls,
  HistoryControls,
  FontControls,
  FontSizeControls,
  SidebarToggle,
};

export const getToolbarComponent = (componentName?: string): React.ComponentType<any> | null => {
  if (!componentName) return null;
  return TOOLBAR_COMPONENTS[componentName] || null;
};

export const registerToolbarComponent = (name: string, component: React.ComponentType<any>) => {
  TOOLBAR_COMPONENTS[name] = component;
};
