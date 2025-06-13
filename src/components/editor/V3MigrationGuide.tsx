
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, AlertCircle, Info, ArrowRight } from 'lucide-react';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';

interface MigrationStep {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'pending';
  details: string[];
}

const V3MigrationGuide: React.FC = () => {
  const [openSections, setOpenSections] = useState<string[]>(['current']);

  const migrationSteps: MigrationStep[] = [
    {
      id: 'dependencies',
      title: 'Update Dependencies',
      description: 'Prepare package.json for V3 migration',
      status: 'in-progress',
      details: [
        'Added @tiptap/core and @tiptap/pm packages',
        'Current using V2.14.0 (latest V2)',
        'Ready for V3 upgrade when available'
      ]
    },
    {
      id: 'extensions',
      title: 'Extension Configuration',
      description: 'Update extension configs for V3 compatibility',
      status: 'completed',
      details: [
        'StarterKit configured with V3-style options',
        'Enhanced Link extension with protocol validation',
        'Improved Table extension with better accessibility',
        'Typography extension with smarter replacements'
      ]
    },
    {
      id: 'commands',
      title: 'Command Structure',
      description: 'Prepare command chains for V3 improvements',
      status: 'completed',
      details: [
        'Created V3-compatible command helpers',
        'Enhanced error handling in command chains',
        'Improved command validation'
      ]
    },
    {
      id: 'events',
      title: 'Event Handling',
      description: 'Update event handlers for V3 patterns',
      status: 'completed',
      details: [
        'V3-style onCreate, onUpdate handlers',
        'Enhanced selection tracking',
        'Improved focus/blur management'
      ]
    },
    {
      id: 'content',
      title: 'Content Validation',
      description: 'Implement stricter content validation',
      status: 'completed',
      details: [
        'Content validation utilities',
        'HTML structure verification',
        'Error handling for invalid content'
      ]
    },
    {
      id: 'testing',
      title: 'Migration Testing',
      description: 'Test V3-ready features',
      status: 'pending',
      details: [
        'Test all toolbar functions',
        'Verify keyboard shortcuts',
        'Check content persistence',
        'Validate extension interactions'
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
        <h2 className="text-2xl font-bold text-white mb-2">Tiptap V3 Migration Progress</h2>
        <p className="text-gray-300 mb-4">
          Preparing your editor for Tiptap V3 with enhanced performance and new features
        </p>
        
        <div className="w-full bg-gray-700 rounded-full h-2 mb-4">
          <div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-500"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        
        <p className="text-sm text-gray-400">
          {completedSteps} of {migrationSteps.length} steps completed ({Math.round(progressPercentage)}%)
        </p>
      </div>

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

      <Card className="bg-blue-900/20 border-blue-700">
        <CardHeader>
          <CardTitle className="text-blue-300 flex items-center gap-2">
            <Info className="h-5 w-5" />
            What's Next?
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3 text-sm text-blue-200">
            <p>
              Your editor is now prepared for Tiptap V3 migration. When V3 is officially released:
            </p>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li>Update dependencies to V3 versions</li>
              <li>Test all existing functionality</li>
              <li>Leverage new V3 features like improved performance</li>
              <li>Utilize enhanced extension APIs</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default V3MigrationGuide;
