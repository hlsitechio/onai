
import { useToast } from "@/hooks/use-toast";

export const useNotesImportExport = () => {
  const { toast } = useToast();

  const handleExportNotes = (notes: Record<string, string>) => {
    try {
      if (!notes || Object.keys(notes).length === 0) {
        toast({
          title: "No notes to export",
          description: "You don't have any saved notes to export",
          variant: "destructive"
        });
        return;
      }

      const notesData = JSON.stringify(notes, null, 2);
      const blob = new Blob([notesData], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `notes-export-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast({
        title: "Notes exported",
        description: `Successfully exported ${Object.keys(notes).length} notes to a JSON file`
      });
    } catch (error) {
      console.error('Export error:', error);
      toast({
        title: "Export failed",
        description: "Failed to export notes. Please try again.",
        variant: "destructive"
      });
    }
  };

  const handleImportNotes = (onNotesImported?: (notes: Record<string, string>) => void | Promise<void>) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = async (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) {
        toast({
          title: "No file selected",
          description: "Please select a JSON file to import",
          variant: "destructive"
        });
        return;
      }

      // Validate file type
      if (!file.name.endsWith('.json')) {
        toast({
          title: "Invalid file type",
          description: "Please select a JSON file (.json)",
          variant: "destructive"
        });
        return;
      }

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast({
          title: "File too large",
          description: "Please select a file smaller than 10MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const fileContent = e.target?.result as string;
          if (!fileContent) {
            throw new Error('Failed to read file content');
          }

          const importedNotes = JSON.parse(fileContent);
          
          // Validate that imported data is an object with string values
          if (!importedNotes || typeof importedNotes !== 'object' || Array.isArray(importedNotes)) {
            throw new Error('Invalid file format: Expected JSON object with note data');
          }
          
          // Validate and clean each note entry
          const validatedNotes: Record<string, string> = {};
          let invalidCount = 0;
          
          for (const [key, value] of Object.entries(importedNotes)) {
            if (typeof key === 'string' && typeof value === 'string' && key.trim() && value.trim()) {
              validatedNotes[key] = value;
            } else {
              invalidCount++;
            }
          }
          
          if (Object.keys(validatedNotes).length === 0) {
            throw new Error('No valid notes found in the imported file. Make sure the file contains valid note data.');
          }
          
          // Call the callback with imported notes if provided
          if (onNotesImported) {
            await onNotesImported(validatedNotes);
          }
          
          const successMessage = invalidCount > 0 
            ? `Successfully imported ${Object.keys(validatedNotes).length} notes (${invalidCount} invalid entries skipped)`
            : `Successfully imported ${Object.keys(validatedNotes).length} notes`;
          
          toast({
            title: "Notes imported",
            description: successMessage
          });
        } catch (error) {
          console.error('Import error:', error);
          const errorMessage = error instanceof Error ? error.message : "Failed to import notes. Please check the file format.";
          toast({
            title: "Import failed",
            description: errorMessage,
            variant: "destructive"
          });
        }
      };

      reader.onerror = () => {
        toast({
          title: "File read error",
          description: "Failed to read the selected file. Please try again.",
          variant: "destructive"
        });
      };

      reader.readAsText(file);
    };
    input.click();
  };

  return { handleExportNotes, handleImportNotes };
};
