
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendTestEmail } from '@/utils/emailService';
import { Loader2, Mail, Send, Check } from 'lucide-react';

const EmailTemplateTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSendTest = async (templateType: 'welcome' | 'share' | 'reset', templateName: string) => {
    if (!email) {
      toast({
        title: 'Email required',
        description: 'Please enter your email address first.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(templateType);
    
    try {
      const result = await sendTestEmail(email, templateType);
      
      if (result.success) {
        setSent(prev => [...prev, templateType]);
        toast({
          title: 'Test email sent! 📧',
          description: `${templateName} template sent to ${email}`,
        });
      } else {
        throw new Error(result.error || 'Failed to send email');
      }
    } catch (error) {
      console.error('Error sending test email:', error);
      toast({
        title: 'Failed to send email',
        description: error instanceof Error ? error.message : 'Unknown error occurred',
        variant: 'destructive',
      });
    } finally {
      setLoading(null);
    }
  };

  const templates = [
    {
      id: 'welcome' as const,
      name: 'Welcome Email',
      description: 'Dark purple gradient with onboarding steps',
      icon: '🚀',
      color: 'from-purple-600 to-blue-600'
    },
    {
      id: 'share' as const,
      name: 'Share Notification',
      description: 'Pink gradient for note sharing alerts',
      icon: '📝',
      color: 'from-pink-500 to-red-500'
    },
    {
      id: 'reset' as const,
      name: 'Password Reset',
      description: 'Orange gradient for security actions',
      icon: '🔐',
      color: 'from-yellow-400 to-orange-500'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="w-6 h-6 text-blue-400" />
            Email Template Testing
          </CardTitle>
          <CardDescription className="text-gray-300">
            Send test emails to preview our beautiful dark-themed templates with high contrast design
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-white">Your Email Address</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email to receive test emails"
              className="bg-white/5 border-white/20 text-white placeholder:text-gray-400"
            />
          </div>
          
          <div className="grid md:grid-cols-3 gap-4">
            {templates.map((template) => (
              <Card key={template.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                <CardHeader className="pb-3">
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-center mb-3`}>
                    <span className="text-2xl">{template.icon}</span>
                  </div>
                  <CardTitle className="text-lg text-white">{template.name}</CardTitle>
                  <CardDescription className="text-gray-400 text-sm">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <Button
                    onClick={() => handleSendTest(template.id, template.name)}
                    disabled={loading === template.id || !email}
                    className={`w-full ${
                      sent.includes(template.id)
                        ? 'bg-green-600 hover:bg-green-700'
                        : `bg-gradient-to-r ${template.color} hover:opacity-90`
                    } text-white`}
                  >
                    {loading === template.id ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : sent.includes(template.id) ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Sent!
                      </>
                    ) : (
                      <>
                        <Send className="mr-2 h-4 w-4" />
                        Send Test
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">💡</span>
              </div>
              <div>
                <h4 className="text-blue-300 font-medium mb-1">Template Features</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Dark theme with high contrast colors</li>
                  <li>• Mobile-responsive design</li>
                  <li>• Beautiful gradients and animations</li>
                  <li>• Professional typography and spacing</li>
                </ul>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EmailTemplateTest;
