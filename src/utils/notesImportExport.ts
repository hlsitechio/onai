
import { useToast } from "@/hooks/use-toast";

export const useNotesImportExport = () => {
  const { toast } = useToast();

  const handleExportNotes = (notes: Record<string, string>) => {
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
      description: "All notes have been exported to a JSON file"
    });
  };

  const handleImportNotes = (onNotesImported?: (notes: Record<string, string>) => void) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const importedNotes = JSON.parse(e.target?.result as string);
            
            // Validate that imported data is an object with string values
            if (typeof importedNotes !== 'object' || importedNotes === null) {
              throw new Error('Invalid file format: Expected JSON object');
            }
            
            // Validate each note entry
            const validatedNotes: Record<string, string> = {};
            for (const [key, value] of Object.entries(importedNotes)) {
              if (typeof value === 'string') {
                validatedNotes[key] = value;
              }
            }
            
            if (Object.keys(validatedNotes).length === 0) {
              throw new Error('No valid notes found in the imported file');
            }
            
            // Call the callback with imported notes if provided
            if (onNotesImported) {
              onNotesImported(validatedNotes);
            }
            
            toast({
              title: "Notes imported",
              description: `Successfully imported ${Object.keys(validatedNotes).length} notes`
            });
          } catch (error) {
            console.error('Import error:', error);
            toast({
              title: "Import failed",
              description: error instanceof Error ? error.message : "Failed to import notes. Please check the file format.",
              variant: "destructive"
            });
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return { handleExportNotes, handleImportNotes };
};
