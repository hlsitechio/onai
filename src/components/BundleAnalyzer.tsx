
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { analyzeBundleSize } from '@/utils/bundleOptimization';

const BundleAnalyzer: React.FC = () => {
  const [bundleInfo, setBundleInfo] = useState<any>(null);

  useEffect(() => {
    const info = analyzeBundleSize();
    setBundleInfo(info);
  }, []);

  if (!bundleInfo) return null;

  const { transferSize, decodedSize, isLargeBundle } = bundleInfo;

  return (
    <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="text-white flex items-center gap-2">
          Bundle Analysis
          <Badge variant={isLargeBundle ? "destructive" : "default"}>
            {isLargeBundle ? "Large" : "Optimal"}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="text-sm text-gray-400">
          <p><strong>Transfer Size:</strong> {(transferSize / 1024).toFixed(2)} KB</p>
          <p><strong>Decoded Size:</strong> {(decodedSize / 1024).toFixed(2)} KB</p>
          <p><strong>Compression:</strong> {((1 - transferSize / decodedSize) * 100).toFixed(1)}%</p>
        </div>
        {isLargeBundle && (
          <div className="text-yellow-400 text-sm">
            ⚠️ Consider implementing more code splitting for better performance
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BundleAnalyzer;
