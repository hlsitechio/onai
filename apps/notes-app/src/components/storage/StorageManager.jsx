import React from 'react';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import storageService from '../../services/storageService';

const StorageManager = ({ className = '' }) => {
  const [storageInfo, setStorageInfo] = React.useState(null);
  const [importStatus, setImportStatus] = React.useState(null);

  React.useEffect(() => {
    updateStorageInfo();
  }, []);

  const updateStorageInfo = () => {
    const info = storageService.getStorageInfo();
    setStorageInfo(info);
  };

  const handleExport = () => {
    try {
      const success = storageService.downloadBackup();
      if (success) {
        setImportStatus({ type: 'success', message: 'Backup downloaded successfully!' });
      } else {
        setImportStatus({ type: 'error', message: 'Failed to download backup' });
      }
    } catch (error) {
      setImportStatus({ type: 'error', message: error.message });
    }
    
    setTimeout(() => setImportStatus(null), 3000);
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const result = storageService.importData(e.target.result);
        if (result.success) {
          setImportStatus({ 
            type: 'success', 
            message: `Successfully imported ${result.imported.notes} notes and ${result.imported.folders} folders!` 
          });
          updateStorageInfo();
          // Refresh the page to show imported data
          setTimeout(() => window.location.reload(), 1500);
        } else {
          setImportStatus({ type: 'error', message: result.error });
        }
      } catch (error) {
        setImportStatus({ type: 'error', message: 'Invalid file format' });
      }
    };
    reader.readAsText(file);
    
    // Reset file input
    event.target.value = '';
    setTimeout(() => setImportStatus(null), 5000);
  };

  const handleClearStorage = () => {
    if (confirm('⚠️ This will delete ALL your notes and data. This action cannot be undone. Are you sure?')) {
      const success = storageService.clearStorage();
      if (success) {
        setImportStatus({ type: 'success', message: 'Storage cleared successfully' });
        setTimeout(() => window.location.reload(), 1500);
      } else {
        setImportStatus({ type: 'error', message: 'Failed to clear storage' });
      }
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Storage Information */}
      <div className="glass-effect-dark rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Info className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Storage Information</h3>
        </div>
        
        {storageInfo && (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Total Notes:</span>
                <span className="text-white font-medium">{storageInfo.totalNotes}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Total Folders:</span>
                <span className="text-white font-medium">{storageInfo.totalFolders}</span>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-400">Storage Used:</span>
                <span className="text-white font-medium">{formatBytes(storageInfo.storageUsed)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-400">Status:</span>
                <span className={`font-medium ${storageInfo.isOnline ? 'text-green-400' : 'text-red-400'}`}>
                  {storageInfo.isOnline ? 'Online' : 'Offline'}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Export/Backup */}
      <div className="glass-effect-dark rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Download className="h-5 w-5 text-green-400" />
          <h3 className="text-lg font-semibold text-white">Export & Backup</h3>
        </div>
        
        <p className="text-gray-400 text-sm">
          Download a backup of all your notes, folders, and settings as a JSON file.
        </p>
        
        <Button 
          onClick={handleExport}
          className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white"
        >
          <Download className="h-4 w-4 mr-2" />
          Download Backup
        </Button>
      </div>

      {/* Import */}
      <div className="glass-effect-dark rounded-xl p-6 space-y-4">
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-blue-400" />
          <h3 className="text-lg font-semibold text-white">Import Data</h3>
        </div>
        
        <p className="text-gray-400 text-sm">
          Import notes and data from a previously exported backup file.
        </p>
        
        <div className="space-y-3">
          <Label htmlFor="import-file" className="text-white">
            Select Backup File
          </Label>
          <Input
            id="import-file"
            type="file"
            accept=".json"
            onChange={handleImport}
            className="bg-black/30 border-white/20 text-white file:bg-blue-500/20 file:text-blue-300 file:border-0 file:rounded-md"
          />
        </div>
      </div>

      {/* Clear Storage */}
      <div className="glass-effect-dark rounded-xl p-6 space-y-4 border border-red-500/20">
        <div className="flex items-center gap-3">
          <Trash2 className="h-5 w-5 text-red-400" />
          <h3 className="text-lg font-semibold text-white">Danger Zone</h3>
        </div>
        
        <p className="text-gray-400 text-sm">
          ⚠️ This will permanently delete all your notes, folders, and settings. This action cannot be undone.
        </p>
        
        <Button 
          onClick={handleClearStorage}
          variant="destructive"
          className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Data
        </Button>
      </div>

      {/* Status Messages */}
      {importStatus && (
        <div className={`glass-effect-dark rounded-xl p-4 border ${
          importStatus.type === 'success' 
            ? 'border-green-500/30 bg-green-500/10' 
            : 'border-red-500/30 bg-red-500/10'
        }`}>
          <p className={`text-sm ${
            importStatus.type === 'success' ? 'text-green-400' : 'text-red-400'
          }`}>
            {importStatus.message}
          </p>
        </div>
      )}
    </div>
  );
};

export default StorageManager;

