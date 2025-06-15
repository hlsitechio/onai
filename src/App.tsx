
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AppInitializer from "./components/AppInitializer";
import MigrationDialog from "./components/migration/MigrationDialog";
import { isMigrationNeeded } from "./utils/migrationUtils";

const queryClient = new QueryClient();

function App() {
  const [showMigrationDialog, setShowMigrationDialog] = useState(false);

  useEffect(() => {
    // Check if migration is needed after app loads
    const checkMigration = async () => {
      try {
        const needsMigration = await isMigrationNeeded();
        if (needsMigration) {
          setShowMigrationDialog(true);
        }
      } catch (error) {
        console.error('Error checking migration status:', error);
      }
    };

    // Delay migration check to allow app to fully initialize
    const timer = setTimeout(checkMigration, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleMigrationComplete = () => {
    setShowMigrationDialog(false);
    // Refresh the page to reload with migrated data
    window.location.reload();
  };

  return (
    <div className="min-h-screen w-full">
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <AppInitializer>
            <Toaster />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
            <MigrationDialog 
              isOpen={showMigrationDialog}
              onOpenChange={setShowMigrationDialog}
              onMigrationComplete={handleMigrationComplete}
            />
          </AppInitializer>
        </TooltipProvider>
      </QueryClientProvider>
    </div>
  );
}

export default App;
