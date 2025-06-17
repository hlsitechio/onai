
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendTestEmail } from '@/utils/email/testEmailService';
import { Loader2, Mail, Send, Check } from 'lucide-react';

const EmailTemplateTest = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState<string | null>(null);
  const [sent, setSent] = useState<string[]>([]);
  const { toast } = useToast();

  const handleSendTest = async (templateType: 'welcome' | 'share' | 'reset' | 'trial-started' | 'trial-reminder' | 'trial-expired' | 'subscription-started' | 'payment-failed' | 'subscription-cancelled' | 'subscription-renewed' | 'account-downgraded', templateName: string) => {
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

  const subscriptionTemplates = [
    {
      id: 'trial-started' as const,
      name: 'Trial Started',
      description: 'Welcome email when trial begins',
      icon: '🚀',
      color: 'from-blue-500 to-purple-600',
      category: 'Trial'
    },
    {
      id: 'trial-reminder' as const,
      name: 'Trial Reminder',
      description: 'Reminder when trial is ending soon',
      icon: '⏰',
      color: 'from-orange-400 to-red-500',
      category: 'Trial'
    },
    {
      id: 'trial-expired' as const,
      name: 'Trial Expired',
      description: 'Email when trial has ended',
      icon: '😔',
      color: 'from-gray-500 to-gray-600',
      category: 'Trial'
    },
    {
      id: 'subscription-started' as const,
      name: 'Subscription Started',
      description: 'Welcome email for new premium subscribers',
      icon: '🎉',
      color: 'from-green-500 to-teal-500',
      category: 'Subscription'
    },
    {
      id: 'payment-failed' as const,
      name: 'Payment Failed',
      description: 'Alert when payment cannot be processed',
      icon: '⚠️',
      color: 'from-red-500 to-pink-500',
      category: 'Billing'
    },
    {
      id: 'subscription-cancelled' as const,
      name: 'Subscription Cancelled',
      description: 'Confirmation when user cancels subscription',
      icon: '😢',
      color: 'from-gray-600 to-blue-600',
      category: 'Subscription'
    },
    {
      id: 'subscription-renewed' as const,
      name: 'Subscription Renewed',
      description: 'Confirmation of successful renewal',
      icon: '✅',
      color: 'from-green-400 to-blue-500',
      category: 'Billing'
    },
    {
      id: 'account-downgraded' as const,
      name: 'Account Downgraded',
      description: 'Notification when account moves to free plan',
      icon: 'ℹ️',
      color: 'from-blue-400 to-purple-500',
      category: 'Account'
    }
  ];

  const basicTemplates = [
    {
      id: 'welcome' as const,
      name: 'Welcome Email',
      description: 'Dark purple gradient with onboarding steps',
      icon: '🧠',
      color: 'from-purple-600 to-blue-600',
      category: 'General'
    },
    {
      id: 'share' as const,
      name: 'Share Notification',
      description: 'Pink gradient for note sharing alerts',
      icon: '📝',
      color: 'from-pink-500 to-red-500',
      category: 'General'
    },
    {
      id: 'reset' as const,
      name: 'Password Reset',
      description: 'Orange gradient for security actions',
      icon: '🔐',
      color: 'from-yellow-400 to-orange-500',
      category: 'General'
    }
  ];

  const allTemplates = [...subscriptionTemplates, ...basicTemplates];

  const groupedTemplates = allTemplates.reduce((acc, template) => {
    if (!acc[template.category]) {
      acc[template.category] = [];
    }
    acc[template.category].push(template);
    return acc;
  }, {} as Record<string, typeof allTemplates>);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      <Card className="bg-black/40 border-white/20">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Mail className="w-6 h-6 text-blue-400" />
            Complete Email Template System
          </CardTitle>
          <CardDescription className="text-gray-300">
            Test all subscription and general email templates with beautiful dark-themed design and high contrast
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
          
          {Object.entries(groupedTemplates).map(([category, templates]) => (
            <div key={category} className="space-y-4">
              <h3 className="text-xl font-bold text-white border-b border-white/20 pb-2">
                {category} Templates
              </h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <Card key={template.id} className="bg-white/5 border-white/10 hover:border-white/20 transition-colors">
                    <CardHeader className="pb-3">
                      <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${template.color} flex items-center justify-content-center mb-3`}>
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
            </div>
          ))}
          
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm">💡</span>
              </div>
              <div>
                <h4 className="text-blue-300 font-medium mb-1">Email Template Features</h4>
                <ul className="text-blue-200 text-sm space-y-1">
                  <li>• Complete subscription lifecycle coverage</li>
                  <li>• Dark theme with high contrast colors</li>
                  <li>• Mobile-responsive design with consistent branding</li>
                  <li>• Professional typography and accessible spacing</li>
                  <li>• Automated triggers for subscription events</li>
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
