
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Copy, Github, GitlabIcon as Gitlab, CheckCircle } from 'lucide-react';

interface CICDIntegrationGuideProps {
  webhookUrl: string;
  hookName: string;
}

const CICDIntegrationGuide: React.FC<CICDIntegrationGuideProps> = ({ 
  webhookUrl, 
  hookName 
}) => {
  const { toast } = useToast();

  const copyToClipboard = async (text: string, label: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied to clipboard',
        description: `${label} has been copied to your clipboard`,
      });
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Could not copy to clipboard',
        variant: 'destructive',
      });
    }
  };

  const githubWorkflow = `name: Deploy to Vercel
on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
    
    - name: Install dependencies
      run: npm ci
    
    - name: Run tests
      run: npm run test
    
    - name: Trigger Vercel deployment
      if: github.ref == 'refs/heads/main'
      run: |
        curl -X POST "${webhookUrl}"
      env:
        WEBHOOK_URL: \${{ secrets.VERCEL_DEPLOY_HOOK }}`;

  const gitlabCI = `stages:
  - test
  - deploy

variables:
  NODE_VERSION: "18"

test:
  stage: test
  image: node:\${NODE_VERSION}
  script:
    - npm ci
    - npm run test
  only:
    - merge_requests
    - main

deploy:
  stage: deploy
  image: alpine:latest
  before_script:
    - apk add --no-cache curl
  script:
    - curl -X POST "\$VERCEL_DEPLOY_HOOK"
  only:
    - main
  variables:
    VERCEL_DEPLOY_HOOK: "${webhookUrl}"`;

  const curlCommand = `curl -X POST "${webhookUrl}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "ref": "main",
    "repository": "your-repo",
    "author": "CI/CD Pipeline"
  }'`;

  const integrationSteps = [
    {
      title: 'Add Webhook URL as Secret',
      description: 'Store your webhook URL securely in your CI/CD platform',
      completed: false,
    },
    {
      title: 'Configure Pipeline',
      description: 'Add deployment step to your CI/CD configuration',
      completed: false,
    },
    {
      title: 'Test Integration',
      description: 'Push changes to trigger automated deployment',
      completed: false,
    },
    {
      title: 'Monitor Deployments',
      description: 'Track deployment status in your logs',
      completed: false,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-white mb-2">CI/CD Integration</h3>
        <p className="text-sm text-gray-400">
          Integrate "{hookName}" with your continuous integration pipeline
        </p>
      </div>

      {/* Integration Steps */}
      <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
        <CardHeader>
          <CardTitle className="text-white">Setup Checklist</CardTitle>
          <CardDescription className="text-gray-400">
            Follow these steps to integrate with your CI/CD pipeline
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {integrationSteps.map((step, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg border border-white/10 bg-white/5"
              >
                <div className="flex items-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${step.completed ? 'text-green-400' : 'text-gray-500'}`} />
                  <div>
                    <p className="text-white font-medium">{step.title}</p>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
                <Badge variant="outline" className="border-white/20 text-gray-400">
                  {index + 1}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Platform-specific configurations */}
      <Tabs defaultValue="github" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="github" className="flex items-center gap-2">
            <Github className="w-4 h-4" />
            GitHub Actions
          </TabsTrigger>
          <TabsTrigger value="gitlab" className="flex items-center gap-2">
            <Gitlab className="w-4 h-4" />
            GitLab CI
          </TabsTrigger>
          <TabsTrigger value="curl">Manual/Other</TabsTrigger>
        </TabsList>

        <TabsContent value="github" className="space-y-4">
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">GitHub Actions Workflow</CardTitle>
              <CardDescription className="text-gray-400">
                Add this workflow to .github/workflows/deploy.yml
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-black/60 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border border-white/10">
                  <code>{githubWorkflow}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10"
                  onClick={() => copyToClipboard(githubWorkflow, 'GitHub workflow')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                <p className="text-blue-400 text-sm">
                  <strong>Note:</strong> Add your webhook URL as a repository secret named 
                  <code className="mx-1 px-1 bg-black/40 rounded">VERCEL_DEPLOY_HOOK</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="gitlab" className="space-y-4">
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">GitLab CI Configuration</CardTitle>
              <CardDescription className="text-gray-400">
                Add this configuration to your .gitlab-ci.yml file
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-black/60 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border border-white/10">
                  <code>{gitlabCI}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10"
                  onClick={() => copyToClipboard(gitlabCI, 'GitLab CI configuration')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 p-3 bg-orange-500/10 border border-orange-500/20 rounded-lg">
                <p className="text-orange-400 text-sm">
                  <strong>Note:</strong> Add your webhook URL as a CI/CD variable named 
                  <code className="mx-1 px-1 bg-black/40 rounded">VERCEL_DEPLOY_HOOK</code>
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="curl" className="space-y-4">
          <Card className="border-white/10 bg-black/40 backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="text-white">Manual Trigger</CardTitle>
              <CardDescription className="text-gray-400">
                Use this cURL command to manually trigger deployments
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="relative">
                <pre className="bg-black/60 text-green-400 p-4 rounded-lg text-sm overflow-x-auto border border-white/10">
                  <code>{curlCommand}</code>
                </pre>
                <Button
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 border-white/20 text-white hover:bg-white/10"
                  onClick={() => copyToClipboard(curlCommand, 'cURL command')}
                >
                  <Copy className="w-4 h-4" />
                </Button>
              </div>
              <div className="mt-4 p-3 bg-purple-500/10 border border-purple-500/20 rounded-lg">
                <p className="text-purple-400 text-sm">
                  <strong>Tip:</strong> You can integrate this command into any CI/CD platform 
                  that supports shell commands or HTTP requests.
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CICDIntegrationGuide;
