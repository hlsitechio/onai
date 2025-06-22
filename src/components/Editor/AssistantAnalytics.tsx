
import React from 'react';
import { motion } from 'framer-motion';
import { Zap } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface AssistantAnalyticsProps {
  content: string;
}

const AssistantAnalytics: React.FC<AssistantAnalyticsProps> = ({ content }) => {
  const wordCount = content.split(' ').filter(w => w.length > 0).length;
  const characterCount = content.length;
  const readingTime = Math.ceil(wordCount / 200);

  const stats = [
    { label: 'Words', value: wordCount, color: 'blue' },
    { label: 'Characters', value: characterCount, color: 'purple' },
    { label: 'Reading time', value: `~${readingTime} min`, color: 'green' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
    >
      <Card className="glass shadow-medium">
        <CardContent className="p-5">
          <h3 className="font-bold mb-4 text-gray-800 flex items-center gap-2 dark:text-slate-200">
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, 5, -5, 0] 
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                repeatType: 'reverse'
              }}
            >
              <Zap className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            </motion.div>
            Writing Analytics
          </h3>
          <div className="space-y-3 text-sm">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + index * 0.1 }}
                className="flex justify-between items-center p-2 bg-white/20 backdrop-blur-sm rounded-lg border-0 dark:bg-slate-700/30"
              >
                <span className="font-medium dark:text-slate-300">{stat.label}:</span>
                <Badge variant="secondary" className={`bg-${stat.color}-100/20 backdrop-blur-sm text-${stat.color}-700 border-0 dark:bg-${stat.color}-900/30 dark:text-${stat.color}-300`}>
                  {stat.value}
                </Badge>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default AssistantAnalytics;
