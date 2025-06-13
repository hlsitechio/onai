
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CheckCircle, AlertTriangle, XCircle, Play, RefreshCw } from 'lucide-react';
import type { Editor } from '@tiptap/react';
import { validateV3Content } from '@/utils/v3ContentValidation';
import { createV3CommandChain } from '@/utils/v3CommandChains';

interface TestResult {
  name: string;
  status: 'passed' | 'failed' | 'warning';
  message: string;
  duration: number;
}

interface TestSuite {
  name: string;
  tests: TestResult[];
  overallStatus: 'passed' | 'failed' | 'warning';
}

interface V3TestingSuiteProps {
  editor: Editor | null;
}

const V3TestingSuite: React.FC<V3TestingSuiteProps> = ({ editor }) => {
  const [testResults, setTestResults] = useState<TestSuite[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [lastRunTime, setLastRunTime] = useState<Date | null>(null);

  const runCommandTests = async (editor: Editor): Promise<TestResult[]> => {
    const tests: TestResult[] = [];
    const commands = createV3CommandChain(editor);
    
    // Test basic formatting commands
    const formatTests = [
      { name: 'Bold Command', fn: () => commands.formatting.bold() },
      { name: 'Italic Command', fn: () => commands.formatting.italic() },
      { name: 'Underline Command', fn: () => commands.formatting.underline() },
      { name: 'Strike Command', fn: () => commands.formatting.strike() },
      { name: 'Code Command', fn: () => commands.formatting.code() }
    ];

    for (const test of formatTests) {
      const startTime = performance.now();
      try {
        const result = test.fn();
        const duration = performance.now() - startTime;
        
        tests.push({
          name: test.name,
          status: result ? 'passed' : 'warning',
          message: result ? 'Command executed successfully' : 'Command not available',
          duration
        });
      } catch (error) {
        tests.push({
          name: test.name,
          status: 'failed',
          message: `Command failed: ${error}`,
          duration: performance.now() - startTime
        });
      }
    }

    return tests;
  };

  const runContentValidationTests = async (editor: Editor): Promise<TestResult[]> => {
    const tests: TestResult[] = [];
    const startTime = performance.now();
    
    try {
      const content = editor.getHTML();
      const validation = validateV3Content(content);
      
      tests.push({
        name: 'Content Structure Validation',
        status: validation.isValid ? 'passed' : 'failed',
        message: validation.isValid 
          ? 'Content structure is valid'
          : `Validation failed: ${validation.errors.join(', ')}`,
        duration: performance.now() - startTime
      });

      tests.push({
        name: 'Content Security Check',
        status: validation.errors.some(e => e.includes('security')) ? 'failed' : 'passed',
        message: validation.errors.some(e => e.includes('security'))
          ? 'Security issues detected'
          : 'Content is secure',
        duration: performance.now() - startTime
      });

      tests.push({
        name: 'Accessibility Compliance',
        status: validation.warnings.some(w => w.includes('accessibility')) ? 'warning' : 'passed',
        message: validation.warnings.some(w => w.includes('accessibility'))
          ? 'Accessibility improvements recommended'
          : 'Content meets accessibility standards',
        duration: performance.now() - startTime
      });

    } catch (error) {
      tests.push({
        name: 'Content Validation',
        status: 'failed',
        message: `Validation error: ${error}`,
        duration: performance.now() - startTime
      });
    }

    return tests;
  };

  const runExtensionTests = async (editor: Editor): Promise<TestResult[]> => {
    const tests: TestResult[] = [];
    const extensions = editor.extensionManager.extensions;
    
    const startTime = performance.now();
    
    try {
      // Test extension loading
      tests.push({
        name: 'Extension Loading',
        status: extensions.length > 0 ? 'passed' : 'failed',
        message: `${extensions.length} extensions loaded successfully`,
        duration: performance.now() - startTime
      });

      // Test core extensions
      const coreExtensions = ['StarterKit', 'TextAlign', 'Link', 'Image'];
      const loadedExtensions = extensions.map(ext => ext.name);
      
      for (const extensionName of coreExtensions) {
        const isLoaded = loadedExtensions.some(name => name.includes(extensionName));
        tests.push({
          name: `${extensionName} Extension`,
          status: isLoaded ? 'passed' : 'warning',
          message: isLoaded ? 'Extension loaded and available' : 'Extension not found',
          duration: 0
        });
      }

    } catch (error) {
      tests.push({
        name: 'Extension Tests',
        status: 'failed',
        message: `Extension test error: ${error}`,
        duration: performance.now() - startTime
      });
    }

    return tests;
  };

  const runPerformanceTests = async (editor: Editor): Promise<TestResult[]> => {
    const tests: TestResult[] = [];
    
    // Test render performance
    const renderStart = performance.now();
    const content = editor.getHTML();
    const renderDuration = performance.now() - renderStart;
    
    tests.push({
      name: 'Render Performance',
      status: renderDuration < 50 ? 'passed' : renderDuration < 100 ? 'warning' : 'failed',
      message: `Content rendered in ${renderDuration.toFixed(2)}ms`,
      duration: renderDuration
    });

    // Test content size
    const contentSize = content.length;
    tests.push({
      name: 'Content Size Check',
      status: contentSize < 50000 ? 'passed' : contentSize < 100000 ? 'warning' : 'failed',
      message: `Content size: ${(contentSize / 1024).toFixed(2)}KB`,
      duration: 0
    });

    // Test memory usage (if available)
    if (typeof performance !== 'undefined' && 'memory' in performance) {
      const memoryUsage = (performance as any).memory?.usedJSHeapSize || 0;
      tests.push({
        name: 'Memory Usage',
        status: memoryUsage < 50000000 ? 'passed' : 'warning',
        message: `Memory usage: ${(memoryUsage / 1024 / 1024).toFixed(2)}MB`,
        duration: 0
      });
    }

    return tests;
  };

  const runAllTests = async () => {
    if (!editor) return;
    
    setIsRunning(true);
    setProgress(0);
    
    try {
      const suites: TestSuite[] = [];
      
      // Run command tests
      setProgress(25);
      const commandTests = await runCommandTests(editor);
      suites.push({
        name: 'Command Tests',
        tests: commandTests,
        overallStatus: commandTests.some(t => t.status === 'failed') ? 'failed' :
                      commandTests.some(t => t.status === 'warning') ? 'warning' : 'passed'
      });

      // Run content validation tests
      setProgress(50);
      const validationTests = await runContentValidationTests(editor);
      suites.push({
        name: 'Content Validation',
        tests: validationTests,
        overallStatus: validationTests.some(t => t.status === 'failed') ? 'failed' :
                      validationTests.some(t => t.status === 'warning') ? 'warning' : 'passed'
      });

      // Run extension tests
      setProgress(75);
      const extensionTests = await runExtensionTests(editor);
      suites.push({
        name: 'Extension Tests',
        tests: extensionTests,
        overallStatus: extensionTests.some(t => t.status === 'failed') ? 'failed' :
                      extensionTests.some(t => t.status === 'warning') ? 'warning' : 'passed'
      });

      // Run performance tests
      setProgress(100);
      const performanceTests = await runPerformanceTests(editor);
      suites.push({
        name: 'Performance Tests',
        tests: performanceTests,
        overallStatus: performanceTests.some(t => t.status === 'failed') ? 'failed' :
                      performanceTests.some(t => t.status === 'warning') ? 'warning' : 'passed'
      });

      setTestResults(suites);
      setLastRunTime(new Date());
    } catch (error) {
      console.error('Test suite failed:', error);
    } finally {
      setIsRunning(false);
      setProgress(0);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      passed: 'bg-green-500/20 text-green-400',
      warning: 'bg-yellow-500/20 text-yellow-400',
      failed: 'bg-red-500/20 text-red-400'
    };
    
    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {status}
      </Badge>
    );
  };

  useEffect(() => {
    if (editor) {
      // Run initial tests after a short delay
      const timer = setTimeout(() => {
        runAllTests();
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [editor]);

  return (
    <div className="space-y-6 p-6 bg-gradient-to-br from-gray-900 to-gray-800 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-white mb-2">V3 Testing Suite</h2>
          <p className="text-gray-300">
            Comprehensive testing for Tiptap V3 compatibility
          </p>
        </div>
        
        <Button
          onClick={runAllTests}
          disabled={!editor || isRunning}
          className="bg-blue-600 hover:bg-blue-700"
        >
          {isRunning ? (
            <>
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              Running Tests...
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Run Tests
            </>
          )}
        </Button>
      </div>

      {isRunning && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-400">
            <span>Running tests...</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      )}

      {lastRunTime && (
        <p className="text-sm text-gray-400">
          Last run: {lastRunTime.toLocaleTimeString()}
        </p>
      )}

      <div className="space-y-4">
        {testResults.map((suite, index) => (
          <Card key={index} className="bg-gray-800/50 border-gray-700">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getStatusIcon(suite.overallStatus)}
                  <div>
                    <CardTitle className="text-white">{suite.name}</CardTitle>
                    <CardDescription>
                      {suite.tests.length} tests completed
                    </CardDescription>
                  </div>
                </div>
                {getStatusBadge(suite.overallStatus)}
              </div>
            </CardHeader>
            
            <CardContent>
              <div className="space-y-2">
                {suite.tests.map((test, testIndex) => (
                  <div key={testIndex} className="flex items-center justify-between p-2 rounded bg-gray-700/30">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(test.status)}
                      <span className="text-gray-300 text-sm">{test.name}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-400">
                        {test.duration > 0 && `${test.duration.toFixed(1)}ms`}
                      </span>
                      {getStatusBadge(test.status)}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default V3TestingSuite;
