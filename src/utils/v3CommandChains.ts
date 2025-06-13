
import type { Editor } from '@tiptap/react';
import type { Node } from '@tiptap/pm/model';

export interface V3CommandChain {
  focus(): V3CommandChain;
  run(): boolean;
  [key: string]: any;
}

export interface V3CommandOptions {
  validateBeforeRun?: boolean;
  optimizePerformance?: boolean;
  preserveSelection?: boolean;
  enableUndo?: boolean;
}

export const createV3CommandChain = (editor: Editor, options: V3CommandOptions = {}) => {
  const defaultOptions: V3CommandOptions = {
    validateBeforeRun: true,
    optimizePerformance: true,
    preserveSelection: false,
    enableUndo: true
  };
  
  const config = { ...defaultOptions, ...options };
  
  return {
    // Text Formatting Commands
    formatting: {
      bold: () => {
        if (config.validateBeforeRun && !editor.can().toggleBold()) {
          console.warn('Bold command not available');
          return false;
        }
        return editor.chain().focus().toggleBold().run();
      },
      
      italic: () => {
        if (config.validateBeforeRun && !editor.can().toggleItalic()) {
          console.warn('Italic command not available');
          return false;
        }
        return editor.chain().focus().toggleItalic().run();
      },
      
      underline: () => {
        if (config.validateBeforeRun && !editor.can().toggleUnderline()) {
          console.warn('Underline command not available');
          return false;
        }
        return editor.chain().focus().toggleUnderline().run();
      },
      
      strike: () => {
        if (config.validateBeforeRun && !editor.can().toggleStrike()) {
          console.warn('Strike command not available');
          return false;
        }
        return editor.chain().focus().toggleStrike().run();
      },
      
      code: () => {
        if (config.validateBeforeRun && !editor.can().toggleCode()) {
          console.warn('Code command not available');
          return false;
        }
        return editor.chain().focus().toggleCode().run();
      }
    },

    // Heading Commands
    headings: {
      setHeading: (level: 1 | 2 | 3 | 4 | 5 | 6) => {
        if (config.validateBeforeRun && !editor.can().toggleHeading({ level })) {
          console.warn(`Heading ${level} command not available`);
          return false;
        }
        return editor.chain().focus().toggleHeading({ level }).run();
      },
      
      setParagraph: () => {
        if (config.validateBeforeRun && !editor.can().setParagraph()) {
          console.warn('Paragraph command not available');
          return false;
        }
        return editor.chain().focus().setParagraph().run();
      }
    },

    // List Commands
    lists: {
      bulletList: () => {
        if (config.validateBeforeRun && !editor.can().toggleBulletList()) {
          console.warn('Bullet list command not available');
          return false;
        }
        return editor.chain().focus().toggleBulletList().run();
      },
      
      orderedList: () => {
        if (config.validateBeforeRun && !editor.can().toggleOrderedList()) {
          console.warn('Ordered list command not available');
          return false;
        }
        return editor.chain().focus().toggleOrderedList().run();
      },
      
      taskList: () => {
        if (config.validateBeforeRun && !editor.can().toggleTaskList()) {
          console.warn('Task list command not available');
          return false;
        }
        return editor.chain().focus().toggleTaskList().run();
      }
    },

    // Alignment Commands
    alignment: {
      setTextAlign: (alignment: 'left' | 'center' | 'right' | 'justify') => {
        if (config.validateBeforeRun && !editor.can().setTextAlign(alignment)) {
          console.warn(`Text align ${alignment} command not available`);
          return false;
        }
        return editor.chain().focus().setTextAlign(alignment).run();
      }
    },

    // Insert Commands
    insert: {
      table: (rows = 3, cols = 3, withHeaderRow = true) => {
        if (config.validateBeforeRun && !editor.can().insertTable({ rows, cols, withHeaderRow })) {
          console.warn('Insert table command not available');
          return false;
        }
        return editor.chain().focus().insertTable({ rows, cols, withHeaderRow }).run();
      },
      
      image: (src: string, alt?: string) => {
        if (config.validateBeforeRun && !editor.can().setImage({ src, alt })) {
          console.warn('Insert image command not available');
          return false;
        }
        return editor.chain().focus().setImage({ src, alt }).run();
      },
      
      link: (href: string, target = '_blank') => {
        if (config.validateBeforeRun && !editor.can().setLink({ href, target })) {
          console.warn('Insert link command not available');
          return false;
        }
        return editor.chain().focus().setLink({ href, target }).run();
      },
      
      hardBreak: () => {
        if (config.validateBeforeRun && !editor.can().setHardBreak()) {
          console.warn('Hard break command not available');
          return false;
        }
        return editor.chain().focus().setHardBreak().run();
      }
    },

    // Color Commands
    colors: {
      setColor: (color: string) => {
        if (config.validateBeforeRun && !editor.can().setColor(color)) {
          console.warn('Set color command not available');
          return false;
        }
        return editor.chain().focus().setColor(color).run();
      },
      
      setHighlight: (color?: string) => {
        if (color) {
          if (config.validateBeforeRun && !editor.can().setHighlight({ color })) {
            console.warn('Set highlight with color command not available');
            return false;
          }
          return editor.chain().focus().setHighlight({ color }).run();
        } else {
          if (config.validateBeforeRun && !editor.can().toggleHighlight()) {
            console.warn('Toggle highlight command not available');
            return false;
          }
          return editor.chain().focus().toggleHighlight().run();
        }
      }
    },

    // History Commands
    history: {
      undo: () => {
        if (config.validateBeforeRun && !editor.can().undo()) {
          console.warn('Undo command not available');
          return false;
        }
        return editor.chain().focus().undo().run();
      },
      
      redo: () => {
        if (config.validateBeforeRun && !editor.can().redo()) {
          console.warn('Redo command not available');
          return false;
        }
        return editor.chain().focus().redo().run();
      }
    },

    // Advanced Commands
    advanced: {
      clearContent: () => {
        if (config.validateBeforeRun && !editor.can().clearContent()) {
          console.warn('Clear content command not available');
          return false;
        }
        return editor.chain().focus().clearContent().run();
      },
      
      selectAll: () => {
        if (config.validateBeforeRun && !editor.can().selectAll()) {
          console.warn('Select all command not available');
          return false;
        }
        return editor.chain().focus().selectAll().run();
      },
      
      setContent: (content: string) => {
        return editor.commands.setContent(content, false);
      }
    }
  };
};

export const validateCommand = (editor: Editor, command: string): boolean => {
  try {
    const canMethod = `can${command.charAt(0).toUpperCase() + command.slice(1)}`;
    return typeof editor.can()[canMethod as keyof typeof editor.can] === 'function' 
      ? editor.can()[canMethod as keyof typeof editor.can]() 
      : false;
  } catch (error) {
    console.warn(`Command validation failed for ${command}:`, error);
    return false;
  }
};

export const createBatchCommand = (editor: Editor, commands: Array<() => boolean>) => {
  return () => {
    const results = commands.map(cmd => {
      try {
        return cmd();
      } catch (error) {
        console.warn('Batch command failed:', error);
        return false;
      }
    });
    
    return results.every(result => result === true);
  };
};
