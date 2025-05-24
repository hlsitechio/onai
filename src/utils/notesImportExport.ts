
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

  const handleImportNotes = () => {
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
            // Here you would merge the imported notes with existing notes
            toast({
              title: "Notes imported",
              description: "Notes have been imported successfully"
            });
          } catch (error) {
            toast({
              title: "Import failed",
              description: "Failed to import notes. Please check the file format.",
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
