
// V3 Command chain utilities for editor operations
export interface EditorCommandChain {
  formatting: {
    bold: () => boolean;
    italic: () => boolean;
    underline: () => boolean;
    strike: () => boolean;
    code: () => boolean;
  };
}

export const createV3CommandChain = (editor: any): EditorCommandChain => {
  return {
    formatting: {
      bold: () => {
        try {
          document.execCommand('bold', false);
          return true;
        } catch {
          return false;
        }
      },
      italic: () => {
        try {
          document.execCommand('italic', false);
          return true;
        } catch {
          return false;
        }
      },
      underline: () => {
        try {
          document.execCommand('underline', false);
          return true;
        } catch {
          return false;
        }
      },
      strike: () => {
        try {
          document.execCommand('strikeThrough', false);
          return true;
        } catch {
          return false;
        }
      },
      code: () => {
        try {
          document.execCommand('formatBlock', false, 'code');
          return true;
        } catch {
          return false;
        }
      }
    }
  };
};
