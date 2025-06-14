
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { AlertTriangle, CheckCircle, XCircle, Upload } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { migrateLocalNotesToSupabase, isMigrationNeeded, backupNotesBeforeMigration } from '@/utils/migrationUtils';

interface MigrationDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onMigrationComplete: () => void;
}

const MigrationDialog: React.FC<MigrationDialogProps> = ({ 
  isOpen, 
  onOpenChange, 
  onMigrationComplete 
}) => {
  const [migrationState, setMigrationState] = useState<'check' | 'backup' | 'migrate' | 'complete' | 'error'>('check');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [migratedCount, setMigratedCount] = useState(0);
  const { toast } = useToast();

  useEffect(() => {
    if (isOpen) {
      checkMigrationStatus();
    }
  }, [isOpen]);

  const checkMigrationStatus = async () => {
    try {
      setMigrationState('check');
      setProgress(10);
      
      const needsMigration = await isMigrationNeeded();
      
      if (!needsMigration) {
        setMigrationState('complete');
        setProgress(100);
        setTimeout(() => {
          onMigrationComplete();
          onOpenChange(false);
        }, 1500);
      } else {
        setProgress(25);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMigrationState('error');
    }
  };

  const handleMigration = async () => {
    try {
      setMigrationState('backup');
      setProgress(30);
      
      // Create backup
      await backupNotesBeforeMigration();
      setProgress(50);
      
      setMigrationState('migrate');
      
      // Perform migration
      const result = await migrateLocalNotesToSupabase();
      setProgress(90);
      
      if (result.success) {
        setMigratedCount(result.migratedCount);
        setMigrationState('complete');
        setProgress(100);
        
        toast({
          title: 'Migration Successful',
          description: `Successfully migrated ${result.migratedCount} notes to the cloud.`,
        });
        
        setTimeout(() => {
          onMigrationComplete();
          onOpenChange(false);
        }, 2000);
      } else {
        throw new Error(`Migration failed: ${result.errors.join(', ')}`);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
      setMigrationState('error');
      
      toast({
        title: 'Migration Failed',
        description: 'There was an error migrating your notes. Please try again.',
        variant: 'destructive',
      });
    }
  };

  const renderContent = () => {
    switch (migrationState) {
      case 'check':
        return (
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <AlertTriangle className="h-8 w-8 text-yellow-500" />
              <div>
                <h3 className="font-semibold">Local Notes Detected</h3>
                <p className="text-sm text-gray-600">
                  We found notes stored locally. Would you like to migrate them to the cloud for better security and sync?
                </p>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleMigration} className="flex-1">
                <Upload className="h-4 w-4 mr-2" />
                Migrate Notes
              </Button>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Skip
              </Button>
            </div>
          </div>
        );
      
      case 'backup':
      case 'migrate':
        return (
          <div className="space-y-4">
            <div className="text-center">
              <h3 className="font-semibold mb-2">
                {migrationState === 'backup' ? 'Creating Backup...' : 'Migrating Notes...'}
              </h3>
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-gray-600 mt-2">
                {migrationState === 'backup' 
                  ? 'Backing up your existing notes for safety...'
                  : 'Transferring your notes to the cloud...'
                }
              </p>
            </div>
          </div>
        );
      
      case 'complete':
        return (
          <div className="text-center space-y-4">
            <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-green-700">Migration Complete!</h3>
              <p className="text-sm text-gray-600">
                Successfully migrated {migratedCount} notes to the cloud.
              </p>
            </div>
          </div>
        );
      
      case 'error':
        return (
          <div className="text-center space-y-4">
            <XCircle className="h-12 w-12 text-red-500 mx-auto" />
            <div>
              <h3 className="font-semibold text-red-700">Migration Failed</h3>
              <p className="text-sm text-gray-600">{error}</p>
            </div>
            <div className="flex space-x-3">
              <Button onClick={handleMigration} variant="outline" className="flex-1">
                Try Again
              </Button>
              <Button onClick={() => onOpenChange(false)} className="flex-1">
                Close
              </Button>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Migrate Local Notes</DialogTitle>
          <DialogDescription>
            Transfer your existing notes to the cloud for better security and synchronization.
          </DialogDescription>
        </DialogHeader>
        {renderContent()}
      </DialogContent>
    </Dialog>
  );
};

export default MigrationDialog;
