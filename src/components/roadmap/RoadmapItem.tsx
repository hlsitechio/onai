import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Github, Tag } from "lucide-react";
import { RoadmapItem as RoadmapItemType } from '@/types/roadmap';

interface RoadmapItemProps {
  item: RoadmapItemType;
}

const statusColors = {
  planned: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  'in-progress': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  completed: 'bg-green-500/10 text-green-400 border-green-500/20',
  delayed: 'bg-red-500/10 text-red-400 border-red-500/20'
};

const categoryColors = {
  core: 'bg-purple-500/10 text-purple-300 border-purple-500/20',
  ai: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20',
  ui: 'bg-pink-500/10 text-pink-300 border-pink-500/20',
  security: 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20',
  performance: 'bg-yellow-500/10 text-yellow-300 border-yellow-500/20'
};

const priorityIcons = {
  low: '●',
  medium: '●●',
  high: '●●●',
  critical: '●●●●'
};

const priorityColors = {
  low: 'text-blue-400',
  medium: 'text-yellow-400',
  high: 'text-orange-400',
  critical: 'text-red-400'
};

const RoadmapItem: React.FC<RoadmapItemProps> = ({ item }) => {
  // Format target date for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <Card className="bg-black/50 border-white/10 hover:border-white/20 transition-all hover:shadow-lg hover:shadow-purple-500/5">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-base font-medium">{item.title}</CardTitle>
          <div className="flex space-x-1">
            <Badge variant="outline" className={categoryColors[item.category]}>
              {item.category}
            </Badge>
            <Badge variant="outline" className={statusColors[item.status]}>
              {item.status.replace('-', ' ')}
            </Badge>
          </div>
        </div>
        <CardDescription className="text-slate-400 line-clamp-2">
          {item.description}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pb-2">
        <div className="space-y-3">
          <div className="flex justify-between text-xs">
            <div className="flex items-center text-slate-400">
              <Calendar className="h-3 w-3 mr-1" />
              Target: {formatDate(item.targetDate)}
            </div>
            <div className="flex items-center text-slate-400">
              <Clock className="h-3 w-3 mr-1" />
              Est: {item.estimatedDays} days
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Progress</span>
              <span className="text-white">{item.completionPercentage}%</span>
            </div>
            <Progress 
              value={item.completionPercentage} 
              className="h-1.5"
              indicatorClassName={`${
                item.status === 'completed' 
                  ? 'bg-green-500' 
                  : item.status === 'in-progress' 
                  ? 'bg-orange-500' 
                  : 'bg-blue-500'
              }`}
            />
          </div>
          
          {item.tags && item.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {item.tags.map((tag, index) => (
                <Badge 
                  key={index} 
                  variant="outline" 
                  className="bg-slate-900/50 text-slate-400 border-slate-700/50 text-xs py-0"
                >
                  <Tag className="h-2 w-2 mr-1" />
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="pt-0 flex justify-between">
        <div className="text-xs text-slate-500">
          <span className={`mr-1 font-mono ${priorityColors[item.priority]}`}>
            {priorityIcons[item.priority]}
          </span>
          <span className="text-slate-400">
            Priority: {item.priority}
          </span>
        </div>
        
        {item.githubIssue && (
          <a 
            href={item.githubIssue.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs text-blue-400 hover:text-blue-300 transition-colors flex items-center"
          >
            <Github className="h-3 w-3 mr-1" />
            #{item.githubIssue.number}
          </a>
        )}
      </CardFooter>
    </Card>
  );
};

export default RoadmapItem;
