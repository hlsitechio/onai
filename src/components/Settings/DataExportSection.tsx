
import React from 'react';
import { Book } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

const DataExportSection: React.FC = () => {
  return (
    <Card>
      <CardContent>
        <div className="space-y-6">
          <h3 className="text-lg font-semibold">Data & Export</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Export Notes</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Download all your notes as JSON or Markdown</p>
              </div>
              <Button size="sm" variant="outline">
                <Book className="w-4 h-4 mr-2" />
                Export
              </Button>
            </div>

            <Separator />

            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium">Backup to Cloud</p>
                <p className="text-sm text-gray-600 dark:text-gray-400">Automatically backup your data</p>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DataExportSection;
