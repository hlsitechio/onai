
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const OptimizedVercelDashboard: React.FC = () => {
  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-noteflow-400 to-purple-400 bg-clip-text text-transparent">
            Vercel Integration Removed
          </h1>
          <p className="text-gray-400 mt-2">
            The Vercel integration has been successfully removed from this project
          </p>
        </div>
      </div>

      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Integration Status</CardTitle>
          <CardDescription className="text-gray-400">
            All Vercel-related functionality has been cleaned up
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-gray-300">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Database tables removed</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Edge functions deleted</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 rounded-full bg-green-500"></div>
              <span>Components and hooks cleaned up</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default OptimizedVercelDashboard;
