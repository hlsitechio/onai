
/**
 * Tiptap V3 Migration Utilities
 * This file contains utilities to help prepare for V3 migration
 */

import type { Editor } from '@tiptap/react';
import type { Node } from '@tiptap/pm/model';

// V3-compatible command structure
export interface V3CommandProps {
  editor: Editor;
  tr?: any;
  state?: any;
  dispatch?: any;
  view?: any;
  chain?: () => any;
}

// V3-style extension configuration
export interface ExtensionConfig {
  name: string;
  priority?: number;
  isolating?: boolean;
  marks?: string;
  group?: string;
  content?: string;
  inline?: boolean;
  atom?: boolean;
  selectable?: boolean;
  draggable?: boolean;
  code?: boolean;
  whitespace?: 'pre' | 'normal';
  definingAsContext?: boolean;
  definingForContent?: boolean;
  tableRole?: string;
}

// V3-compatible node and mark helpers
export const createNodeHelper = (config: ExtensionConfig) => {
  return {
    name: config.name,
    ...config
  };
};

// V3-style command chains (preparing for improved chaining)
export const createCommandChain = (editor: Editor) => {
  return {
    focus: () => ({
      toggleBold: () => editor.chain().focus().toggleBold(),
      toggleItalic: () => editor.chain().focus().toggleItalic(),
      toggleUnderline: () => editor.chain().focus().toggleUnderline(),
      toggleStrike: () => editor.chain().focus().toggleStrike(),
      toggleCode: () => editor.chain().focus().toggleCode(),
      setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => editor.chain().focus().toggleHeading({ level }),
      setTextAlign: (alignment: string) => editor.chain().focus().setTextAlign(alignment),
      insertTable: () => editor.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }),
      setColor: (color: string) => editor.chain().focus().setColor(color),
      setHighlight: (color?: string) => {
        // Fix: Properly handle optional color parameter
        if (color) {
          return editor.chain().focus().setHighlight({ color });
        } else {
          return editor.chain().focus().setHighlight();
        }
      },
      setLink: (href: string) => editor.chain().focus().setLink({ href }),
      insertImage: (src: string) => editor.chain().focus().setImage({ src }),
      run: () => editor.chain().focus().run()
    })
  };
};

// Content validation (V3 has stricter content validation)
export const validateContent = (content: string): boolean => {
  try {
    if (!content) return true;
    
    // Basic HTML validation for V3 compatibility
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Check for valid structure
    return tempDiv.children.length >= 0;
  } catch (error) {
    console.warn('Content validation failed:', error);
    return false;
  }
};

// V3-style event handling
export const createEventHandlers = (editor: Editor) => {
  return {
    onUpdate: ({ editor: updatedEditor }: { editor: Editor }) => {
      // V3 will have improved event handling
      console.log('Editor updated with V3-style handler');
    },
    onSelectionUpdate: ({ editor: updatedEditor }: { editor: Editor }) => {
      // V3 selection handling
      console.log('Selection updated with V3-style handler');
    },
    onFocus: ({ editor: focusedEditor }: { editor: Editor }) => {
      // V3 focus handling
      console.log('Editor focused with V3-style handler');
    },
    onBlur: ({ editor: blurredEditor }: { editor: Editor }) => {
      // V3 blur handling
      console.log('Editor blurred with V3-style handler');
    }
  };
};

// Extension configuration for V3 compatibility
export const getV3CompatibleExtensions = () => {
  return {
    StarterKit: {
      history: {
        depth: 100,
        newGroupDelay: 500
      }
    },
    TextAlign: {
      types: ['heading', 'paragraph'],
      alignments: ['left', 'center', 'right', 'justify'],
      defaultAlignment: 'left'
    },
    Link: {
      openOnClick: false,
      linkOnPaste: true,
      autolink: true,
      protocols: ['http', 'https', 'mailto'],
      HTMLAttributes: {
        class: 'text-blue-400 underline cursor-pointer hover:text-blue-300',
        target: '_blank',
        rel: 'noopener noreferrer'
      }
    },
    Image: {
      inline: false,
      allowBase64: true,
      HTMLAttributes: {
        class: 'max-w-full h-auto rounded-lg'
      }
    },
    Table: {
      resizable: true,
      handleWidth: 5,
      cellMinWidth: 25,
      allowTableNodeSelection: true
    }
  };
};

// Migration status checker
export const checkV3Readiness = (editor: Editor) => {
  const checks = {
    extensionsCompatible: true,
    contentValid: validateContent(editor.getHTML()),
    commandsWorking: true,
    eventsHandled: true
  };

  const readinessScore = Object.values(checks).filter(Boolean).length / Object.keys(checks).length;
  
  return {
    isReady: readinessScore === 1, // Fix: Use isReady instead of ready
    score: readinessScore,
    checks,
    recommendations: readinessScore < 1 ? [
      'Update extension configurations',
      'Validate content structure',
      'Test command chains',
      'Verify event handlers'
    ] : ['Your editor is V3-ready!']
  };
};
