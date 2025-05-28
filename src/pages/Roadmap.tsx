import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Calendar, Clock, Check, ChevronRight, AlertCircle, Info } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import AppHeader from '@/components/AppHeader';
import { useNavigate } from 'react-router-dom';

// Define the roadmap data structure
interface RoadmapItem {
  id: string;
  title: string;
  description: string;
  targetDate: string;
  estimatedDays: number;
  status: 'planned' | 'in-progress' | 'completed' | 'delayed';
  category: 'core' | 'ai' | 'ui' | 'security' | 'performance';
  priority: 'low' | 'medium' | 'high' | 'critical';
  dependencies?: string[];
  completionPercentage?: number;
  tags?: string[];
}

// Sample roadmap data
const roadmapData: RoadmapItem[] = [
  {
    id: 'feature-001',
    title: 'Tiptap Rich Text Editor Integration',
    description: 'Enhance the note-taking experience with a modern rich text editor supporting formatting, tables, and code blocks.',
    targetDate: '2025-05-30',
    estimatedDays: 7,
    status: 'completed',
    category: 'core',
    priority: 'high',
    completionPercentage: 100,
    tags: ['editor', 'user-experience', 'core-feature']
  },
  {
    id: 'feature-002',
    title: 'Enhanced IndexedDB Storage',
    description: 'Improve the storage system with better error handling, fallback mechanisms, and data integrity validation.',
    targetDate: '2025-06-05',
    estimatedDays: 5,
    status: 'completed',
    category: 'performance',
    priority: 'high',
    completionPercentage: 100,
    tags: ['storage', 'performance', 'reliability']
  },
  {
    id: 'feature-003',
    title: 'Subscription Management System',
    description: 'Implement a client-side subscription system with usage tracking and feature limitation based on subscription tier.',
    targetDate: '2025-06-10',
    estimatedDays: 10,
    status: 'completed',
    category: 'core',
    priority: 'critical',
    completionPercentage: 100,
    tags: ['subscription', 'monetization', 'user-management']
  },
  {
    id: 'feature-004',
    title: 'Collaborative Editing',
    description: 'Enable real-time collaborative editing of notes with multiple users, including cursors, presence, and conflict resolution.',
    targetDate: '2025-07-15',
    estimatedDays: 21,
    status: 'planned',
    category: 'core',
    priority: 'medium',
    completionPercentage: 0,
    dependencies: ['feature-001'],
    tags: ['collaboration', 'real-time', 'multiplayer']
  },
  {
    id: 'feature-005',
    title: 'Advanced AI Note Analysis',
    description: 'Implement machine learning to analyze notes, suggest tags, categorize content, and extract important information.',
    targetDate: '2025-07-20',
    estimatedDays: 14,
    status: 'in-progress',
    category: 'ai',
    priority: 'high',
    completionPercentage: 35,
    tags: ['ai', 'machine-learning', 'content-analysis']
  },
  {
    id: 'feature-006',
    title: 'End-to-End Encryption',
    description: 'Implement client-side encryption for all notes with key management and secure sharing capabilities.',
    targetDate: '2025-08-10',
    estimatedDays: 30,
    status: 'planned',
    category: 'security',
    priority: 'critical',
    completionPercentage: 0,
    tags: ['security', 'encryption', 'privacy']
  },
  {
    id: 'feature-007',
    title: 'Custom Themes & UI Personalization',
    description: 'Allow users to customize the application interface with themes, layouts, and personalized settings.',
    targetDate: '2025-08-25',
    estimatedDays: 10,
    status: 'planned',
    category: 'ui',
    priority: 'low',
    completionPercentage: 0,
    tags: ['customization', 'ui', 'personalization']
  },
  {
    id: 'feature-008',
    title: 'Advanced Search with Semantic Capabilities',
    description: 'Enhance the search functionality with semantic understanding, fuzzy matching, and relevance ranking.',
    targetDate: '2025-09-15',
    estimatedDays: 15,
    status: 'planned',
    category: 'core',
    priority: 'high',
    completionPercentage: 0,
    tags: ['search', 'semantic', 'information-retrieval']
  },
  {
    id: 'feature-009',
    title: 'Mobile App Development',
    description: 'Create native mobile applications for iOS and Android with offline capabilities and sync.',
    targetDate: '2025-10-30',
    estimatedDays: 60,
    status: 'planned',
    category: 'core',
    priority: 'medium',
    completionPercentage: 0,
    tags: ['mobile', 'cross-platform', 'native-app']
  },
  {
    id: 'feature-010',
    title: 'Performance Optimization',
    description: 'Optimize application performance for large documents, reduce loading times, and improve rendering efficiency.',
    targetDate: '2025-06-30',
    estimatedDays: 12,
    status: 'in-progress',
    category: 'performance',
    priority: 'high',
    completionPercentage: 60,
    tags: ['performance', 'optimization', 'speed']
  }
];

// Helper function to get the status color
const getStatusColor = (status: RoadmapItem['status']) => {
  switch (status) {
    case 'planned': return 'bg-slate-500';
    case 'in-progress': return 'bg-blue-500';
    case 'completed': return 'bg-green-500';
    case 'delayed': return 'bg-orange-500';
    default: return 'bg-slate-500';
  }
};

// Helper function to get the priority color
const getPriorityColor = (priority: RoadmapItem['priority']) => {
  switch (priority) {
    case 'low': return 'bg-slate-400 text-slate-950';
    case 'medium': return 'bg-blue-400 text-blue-950';
    case 'high': return 'bg-orange-400 text-orange-950';
    case 'critical': return 'bg-red-400 text-red-950';
    default: return 'bg-slate-400 text-slate-950';
  }
};

// Helper function to get the category icon
const getCategoryIcon = (category: RoadmapItem['category']) => {
  switch (category) {
    case 'core': return <div className="w-3 h-3 rounded-full bg-violet-500 mr-1.5" />;
    case 'ai': return <div className="w-3 h-3 rounded-full bg-emerald-500 mr-1.5" />;
    case 'ui': return <div className="w-3 h-3 rounded-full bg-yellow-500 mr-1.5" />;
    case 'security': return <div className="w-3 h-3 rounded-full bg-red-500 mr-1.5" />;
    case 'performance': return <div className="w-3 h-3 rounded-full bg-blue-500 mr-1.5" />;
    default: return <div className="w-3 h-3 rounded-full bg-gray-500 mr-1.5" />;
  }
};

// Helper function to get days remaining
const getDaysRemaining = (targetDate: string): number => {
  const today = new Date();
  const target = new Date(targetDate);
  const diffTime = target.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
};

// Feature card component
const FeatureCard: React.FC<{ feature: RoadmapItem }> = ({ feature }) => {
  const daysRemaining = getDaysRemaining(feature.targetDate);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full"
    >
      <Card className="overflow-hidden bg-black/40 backdrop-blur-md border-white/5 hover:border-white/10 transition duration-300">
        <CardHeader className="pb-2">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <div className="flex items-center">
                {getCategoryIcon(feature.category)}
                <CardTitle className="text-lg font-semibold text-white">
                  {feature.title}
                </CardTitle>
              </div>
              <CardDescription className="mt-1 text-slate-400">
                {feature.description}
              </CardDescription>
            </div>
            <Badge className={`${getPriorityColor(feature.priority)} ml-2 self-start whitespace-nowrap`}>
              {feature.priority.charAt(0).toUpperCase() + feature.priority.slice(1)} Priority
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="pb-2">
          <div className="mt-1 space-y-3">
            <div className="flex items-center justify-between text-sm">
              <div className="flex items-center text-slate-300">
                <Calendar className="h-4 w-4 mr-1" />
                <span>Target: {new Date(feature.targetDate).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center text-slate-300">
                <Clock className="h-4 w-4 mr-1" />
                <span>Est. {feature.estimatedDays} days</span>
              </div>
            </div>
            
            <div className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-slate-400">Progress</span>
                <span className="text-slate-300">{feature.completionPercentage || 0}%</span>
              </div>
              <Progress value={feature.completionPercentage || 0} className="h-2" 
                indicator={getStatusColor(feature.status)} />
            </div>
            
            {feature.tags && feature.tags.length > 0 && (
              <div className="flex flex-wrap gap-1 mt-2">
                {feature.tags.map(tag => (
                  <span key={tag} className="px-2 py-0.5 bg-white/5 rounded-full text-xs text-slate-300">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="pt-2 flex justify-between items-center bg-black/20">
          <div className={`px-2 py-1 rounded-full text-xs flex items-center ${getStatusColor(feature.status)} text-white`}>
            {feature.status === 'completed' ? (
              <Check className="h-3 w-3 mr-1" />
            ) : feature.status === 'delayed' ? (
              <AlertCircle className="h-3 w-3 mr-1" />
            ) : null}
            {feature.status.charAt(0).toUpperCase() + feature.status.slice(1)}
          </div>
          
          {daysRemaining > 0 && feature.status !== 'completed' ? (
            <span className="text-xs text-slate-400">
              {daysRemaining} days remaining
            </span>
          ) : feature.status === 'completed' ? (
            <span className="text-xs text-green-400">
              Completed
            </span>
          ) : (
            <span className="text-xs text-orange-400">
              Past due
            </span>
          )}
        </CardFooter>
      </Card>
    </motion.div>
  );
};

// Main Roadmap component
const Roadmap: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<string>('all');
  
  // Filter the roadmap data based on the selected tab
  const filteredData = roadmapData.filter(item => {
    if (filter === 'all') return true;
    if (filter === 'upcoming') return item.status === 'planned';
    if (filter === 'progress') return item.status === 'in-progress';
    if (filter === 'completed') return item.status === 'completed';
    if (filter === 'core') return item.category === 'core';
    if (filter === 'ai') return item.category === 'ai';
    if (filter === 'ui') return item.category === 'ui';
    if (filter === 'security') return item.category === 'security';
    if (filter === 'performance') return item.category === 'performance';
    return true;
  });
  
  // Calculate the progress statistics
  const totalFeatures = roadmapData.length;
  const completedFeatures = roadmapData.filter(item => item.status === 'completed').length;
  const inProgressFeatures = roadmapData.filter(item => item.status === 'in-progress').length;
  const plannedFeatures = roadmapData.filter(item => item.status === 'planned').length;
  
  const completionPercentage = Math.round((completedFeatures / totalFeatures) * 100);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#050510] to-[#0a0a1a] text-white">
      <AppHeader />
      
      <div className="container px-4 py-8 mx-auto max-w-7xl">
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-3xl font-bold text-white mb-2">OneAI Development Roadmap</h1>
            <p className="text-slate-400 max-w-3xl">
              Our product development timeline and upcoming features. Track our progress and see what's coming next to OneAI.
            </p>
          </motion.div>
          
          <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="bg-black/40 backdrop-blur-md border-white/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Overall Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-white mb-2">{completionPercentage}%</div>
                <Progress value={completionPercentage} className="h-2 mb-4" />
                <div className="grid grid-cols-3 gap-2 text-center text-sm">
                  <div className="p-2 rounded bg-black/30">
                    <div className="text-green-400 font-semibold">{completedFeatures}</div>
                    <div className="text-slate-400">Completed</div>
                  </div>
                  <div className="p-2 rounded bg-black/30">
                    <div className="text-blue-400 font-semibold">{inProgressFeatures}</div>
                    <div className="text-slate-400">In Progress</div>
                  </div>
                  <div className="p-2 rounded bg-black/30">
                    <div className="text-slate-300 font-semibold">{plannedFeatures}</div>
                    <div className="text-slate-400">Planned</div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-black/40 backdrop-blur-md border-white/5 md:col-span-3">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Category Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-violet-500 mr-2"></div>
                    <span className="text-sm text-slate-300">Core Features: {roadmapData.filter(i => i.category === 'core').length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 mr-2"></div>
                    <span className="text-sm text-slate-300">AI Features: {roadmapData.filter(i => i.category === 'ai').length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-yellow-500 mr-2"></div>
                    <span className="text-sm text-slate-300">UI/UX: {roadmapData.filter(i => i.category === 'ui').length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-red-500 mr-2"></div>
                    <span className="text-sm text-slate-300">Security: {roadmapData.filter(i => i.category === 'security').length}</span>
                  </div>
                  <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-blue-500 mr-2"></div>
                    <span className="text-sm text-slate-300">Performance: {roadmapData.filter(i => i.category === 'performance').length}</span>
                  </div>
                </div>
                
                <div className="mt-4 h-6 w-full rounded-full overflow-hidden flex">
                  <div className="bg-violet-500 h-full" style={{ width: `${(roadmapData.filter(i => i.category === 'core').length / totalFeatures) * 100}%` }}></div>
                  <div className="bg-emerald-500 h-full" style={{ width: `${(roadmapData.filter(i => i.category === 'ai').length / totalFeatures) * 100}%` }}></div>
                  <div className="bg-yellow-500 h-full" style={{ width: `${(roadmapData.filter(i => i.category === 'ui').length / totalFeatures) * 100}%` }}></div>
                  <div className="bg-red-500 h-full" style={{ width: `${(roadmapData.filter(i => i.category === 'security').length / totalFeatures) * 100}%` }}></div>
                  <div className="bg-blue-500 h-full" style={{ width: `${(roadmapData.filter(i => i.category === 'performance').length / totalFeatures) * 100}%` }}></div>
                </div>
                
                <div className="mt-4 text-xs text-slate-400 flex items-center">
                  <Info className="h-4 w-4 mr-1" />
                  Next major release planned for: August 2025
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full" onValueChange={setFilter}>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
            <TabsList className="bg-black/40 p-1 rounded-lg flex flex-wrap">
              <TabsTrigger value="all" className="data-[state=active]:bg-slate-800">All Features</TabsTrigger>
              <TabsTrigger value="upcoming" className="data-[state=active]:bg-slate-800">Upcoming</TabsTrigger>
              <TabsTrigger value="progress" className="data-[state=active]:bg-slate-800">In Progress</TabsTrigger>
              <TabsTrigger value="completed" className="data-[state=active]:bg-slate-800">Completed</TabsTrigger>
            </TabsList>
            
            <TabsList className="bg-black/40 p-1 rounded-lg flex flex-wrap">
              <TabsTrigger value="core" className="data-[state=active]:bg-violet-900">Core</TabsTrigger>
              <TabsTrigger value="ai" className="data-[state=active]:bg-emerald-900">AI</TabsTrigger>
              <TabsTrigger value="ui" className="data-[state=active]:bg-yellow-900">UI/UX</TabsTrigger>
              <TabsTrigger value="security" className="data-[state=active]:bg-red-900">Security</TabsTrigger>
              <TabsTrigger value="performance" className="data-[state=active]:bg-blue-900">Performance</TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={filter} className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredData.map(feature => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
              
              {filteredData.length === 0 && (
                <div className="col-span-full flex flex-col items-center justify-center py-16 text-slate-400">
                  <div className="bg-slate-800/50 p-8 rounded-lg text-center">
                    <div className="text-4xl mb-4">🔍</div>
                    <h3 className="text-xl font-semibold mb-2">No features found</h3>
                    <p className="mb-4">There are no features matching your current filter criteria.</p>
                    <Button onClick={() => setFilter('all')}>View All Features</Button>
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-12 text-center">
          <p className="text-slate-400 mb-4">
            Our roadmap is constantly evolving based on user feedback and market needs.
            <br />Features and dates are subject to change as we continue to improve OneAI.
          </p>
          <Button variant="outline" onClick={() => navigate('/')} className="bg-white/5">
            <ChevronRight className="mr-2 h-4 w-4" />
            Return to OneAI
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Roadmap;
