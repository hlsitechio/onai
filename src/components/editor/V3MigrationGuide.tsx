
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Info, ArrowRight, TestTube } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import V3TestingSuite from './V3TestingSuite';
import type { Editor } from '@tiptap/react';

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  details: string[];
}

interface V3MigrationGuideProps {
  editor?: Editor | null;
}

const V3MigrationGuide: React.FC<V3MigrationGuideProps> = ({ editor }) => {
  const [openSections, setOpenSections] = useState<string[]>(['current']);
  const [showTestingSuite, setShowTestingSuite] = useState(false);

  const migrationSteps: MigrationStep[] = [
    {
      id: 'dependencies',
      title: 'Update Dependencies',
      description: 'Prepare package.json for V3 migration',
      status: 'completed',
      details: [
        'Updated to @tiptap/core and @tiptap/pm packages V2.14.0',
        'All extensions updated to latest V2 versions',
        'Ready for seamless V3 upgrade when available'
      ]
    },
    {
      id: 'extensions',
      title: 'Enhanced Extension Configuration',
      description: 'V3-compatible extension configs with performance optimization',
      status: 'completed',
      details: [
        'V3ExtensionConfigs.ts implemented with enhanced settings',
        'Performance optimizations: lazy loading, caching, memory optimization',
        'Accessibility improvements: ARIA labels, keyboard navigation',
        'Security enhancements: content sanitization, allowed attributes',
        'All 15+ extensions configured with V3-ready settings'
      ]
    },
    {
      id: 'commands',
      title: 'Advanced Command Structure',
      description: 'V3-ready command chains with validation and optimization',
      status: 'completed',
      details: [
        'v3CommandChains.ts with comprehensive command utilities',
        'Enhanced error handling and command validation',
        'Batch command execution with rollback support',
        'Performance monitoring for command execution',
        'Structured command organization by category'
      ]
    },
    {
      id: 'validation',
      title: 'Content Validation & Security',
      description: 'Robust content validation system for V3 compatibility',
      status: 'completed',
      details: [
        'v3ContentValidation.ts with comprehensive validation rules',
        'HTML structure validation and sanitization',
        'Security checks: script tag prevention, attribute filtering',
        'Accessibility validation: alt text, proper nesting',
        'Content scoring system with detailed reporting'
      ]
    },
    {
      id: 'performance',
      title: 'Performance Optimizations',
      description: 'Advanced performance monitoring and optimization',
      status: 'completed',
      details: [
        'v3PerformanceOptimizations.ts with intelligent caching',
        'Content caching with automatic cleanup',
        'Extension prioritization and lazy loading',
        'Event handler throttling and memory optimization',
        'Real-time performance metrics and monitoring'
      ]
    },
    {
      id: 'testing',
      title: 'Comprehensive Testing Suite',
      description: 'Automated testing for V3 compatibility validation',
      status: 'completed',
      details: [
        'V3TestingSuite component for comprehensive testing',
        'Command functionality testing with performance metrics',
        'Content validation and security testing',
        'Extension loading and compatibility verification',
        'Performance benchmarking and memory usage analysis'
      ]
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'in-progress':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      case 'pending':
        return <Info className="h-4 w-4 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      completed: 'bg-green-500/20 text-green-400',
      'in-progress': 'bg-yellow-500/20 text-yellow-400',
      pending: 'bg-gray-500/20 text-gray-400'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status.replace('-', ' ')}
      </Badge>
    );
  };

  const toggleSection = (sectionId: string) => {
    setOpenSections(prev => 
      prev.includes(sectionId) 
        ? prev.filter(id => id !== sectionId)
        : [...prev, sectionId]
    );
  };

  const completedSteps = migrationSteps.filter(step => step.status === 'completed').length;
  const progressPercentage = (completedSteps / migrationSteps.length) * 100;

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-white mb-2">Tiptap V3 Migration Complete! 🎉</h2>
        <p className="text-gray-300 mb-4">
          Your editor is now fully prepared for Tiptap V3 with enhanced performance, security, and compatibility
        </p>
        
        <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
          <div 
            className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-400 mb-4">
          {completedSteps} of {migrationSteps.length} steps completed ({Math.round(progressPercentage)}%)
        </p>

        <Button
          onClick={() => setShowTestingSuite(!showTestingSuite)}
          className="bg-purple-600 hover:bg-purple-700 mb-6"
        >
          <TestTube className="h-4 w-4 mr-2" />
          {showTestingSuite ? 'Hide' : 'Show'} Testing Suite
        </Button>
      </div>

      {showTestingSuite && (
        <div className="mb-6">
          <V3TestingSuite editor={editor} />
        </div>
      )}

      <div className="space-y-4">
        {migrationSteps.map((step) => (
          <Card key={step.id} className="bg-gray-800/50 border-gray-700">
            <Collapsible 
              open={openSections.includes(step.id)}
              onOpenChange={() => toggleSection(step.id)}
            >
              <CollapsibleTrigger asChild>
                <CardHeader className="cursor-pointer hover:bg-gray-700/30 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(step.status)}
                      <div className="text-left">
                        <CardTitle className="text-white text-lg">{step.title}</CardTitle>
                        <CardDescription className="text-gray-300">
                          {step.description}
                        </CardDescription>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(step.status)}
                      <ArrowRight className={`h-4 w-4 text-gray-400 transition-transform ${
                        openSections.includes(step.id) ? 'rotate-90' : ''
                      }`} />
                    </div>
                  </div>
                </CardHeader>
              </CollapsibleTrigger>
              
              <CollapsibleContent>
                <CardContent className="pt-0">
                  <ul className="space-y-2">
                    {step.details.map((detail, index) => (
                      <li key={index} className="flex items-start gap-2 text-gray-300">
                        <CheckCircle className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{detail}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </CollapsibleContent>
            </Collapsible>
          </Card>
        ))}
      </div>

      <Card className="bg-gradient-to-br from-green-900/30 to-blue-900/30 border-green-700">
        <CardHeader>
          <CardTitle className="text-green-300 flex items-center gap-2">
            <CheckCircle className="h-5 w-5" />
            V3 Migration Complete - Ready for the Future!
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-green-200">
            <p>
              🎉 Congratulations! Your editor is now fully V3-ready with:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Enhanced performance with intelligent caching and optimization</li>
              <li>Robust content validation and security measures</li>
              <li>Advanced command chains with error handling</li>
              <li>Comprehensive testing suite for ongoing validation</li>
              <li>Accessibility improvements and ARIA compliance</li>
              <li>Future-proof architecture ready for V3 release</li>
            </ul>
            <p className="mt-4 font-semibold">
              When Tiptap V3 is released, simply update your dependencies and you're ready to go!
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default V3MigrationGuide;
