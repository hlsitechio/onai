
export interface ToolbarSection {
  id: string;
  name: string;
  priority: number;
  items: ToolbarItem[];
}

export interface ToolbarItem {
  id: string;
  type: 'button' | 'dropdown' | 'separator' | 'group';
  component?: string;
  props?: Record<string, any>;
  visible?: boolean;
  responsive?: {
    hideOnMobile?: boolean;
    hideOnTablet?: boolean;
  };
}

export const DEFAULT_TOOLBAR_CONFIG: ToolbarSection[] = [
  {
    id: 'navigation',
    name: 'Navigation',
    priority: 1,
    items: [
      { id: 'sidebar-toggle', type: 'button', component: 'SidebarToggle' },
      { id: 'separator-1', type: 'separator' }
    ]
  },
  {
    id: 'typography',
    name: 'Typography',
    priority: 2,
    items: [
      { id: 'font-family', type: 'dropdown', component: 'FontControls' },
      { id: 'font-size', type: 'dropdown', component: 'FontSizeControls' },
      { id: 'separator-2', type: 'separator' }
    ]
  },
  {
    id: 'formatting',
    name: 'Formatting',
    priority: 3,
    items: [
      { id: 'format-group', type: 'group', component: 'FormatControls' },
      { id: 'separator-3', type: 'separator' }
    ]
  },
  {
    id: 'structure',
    name: 'Structure',
    priority: 4,
    items: [
      { id: 'headings', type: 'group', component: 'HeadingControls' },
      { id: 'separator-4', type: 'separator' }
    ]
  },
  {
    id: 'content',
    name: 'Content',
    priority: 5,
    items: [
      { id: 'colors', type: 'group', component: 'ColorControls' },
      { id: 'lists', type: 'group', component: 'ListControls' },
      { id: 'alignment', type: 'group', component: 'AlignmentControls' },
      { id: 'separator-5', type: 'separator' }
    ]
  },
  {
    id: 'media',
    name: 'Media & Links',
    priority: 6,
    items: [
      { id: 'links', type: 'button', component: 'LinkControls' },
      { id: 'images', type: 'button', component: 'ImageControls' },
      { id: 'separator-6', type: 'separator' }
    ]
  },
  {
    id: 'advanced',
    name: 'Advanced',
    priority: 7,
    items: [
      { id: 'code', type: 'group', component: 'CodeBlockControls' },
      { id: 'quote', type: 'button', component: 'QuoteControls' },
      { id: 'divider', type: 'button', component: 'DividerControls' },
      { id: 'separator-7', type: 'separator' }
    ]
  },
  {
    id: 'tables',
    name: 'Tables',
    priority: 8,
    items: [
      { id: 'table', type: 'dropdown', component: 'TableControls', responsive: { hideOnMobile: true } },
      { id: 'separator-8', type: 'separator' }
    ]
  },
  {
    id: 'insert',
    name: 'Insert',
    priority: 9,
    items: [
      { id: 'insert', type: 'dropdown', component: 'InsertControls', responsive: { hideOnMobile: true } },
      { id: 'separator-9', type: 'separator' }
    ]
  },
  {
    id: 'history',
    name: 'History',
    priority: 10,
    items: [
      { id: 'history', type: 'group', component: 'HistoryControls', responsive: { hideOnMobile: true } }
    ]
  }
];
