
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/utils/emailService';
import { Loader2 } from 'lucide-react';
import { FormData, ContactFormFieldsProps } from './types';

const ContactFormFields: React.FC<ContactFormFieldsProps> = ({ onSuccess }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing fields',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);

    try {
      // Send notification email to admin
      const adminEmailResult = await sendEmail({
        to: 'info@onlinenote.ai',
        subject: `Contact Form: ${formData.subject || 'New Message'}`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${formData.name}</p>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Subject:</strong> ${formData.subject || 'No subject'}</p>
            <h3>Message:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
          </div>
        `,
      });

      if (!adminEmailResult.success) {
        throw new Error(adminEmailResult.error || 'Failed to send admin notification');
      }

      // Send confirmation email to user
      const userEmailResult = await sendEmail({
        to: formData.email,
        subject: 'Thank you for contacting Online Note AI',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #4f46e5;">Thank you for contacting us!</h1>
            <p>Hi ${formData.name},</p>
            <p>We've received your message and will get back to you as soon as possible.</p>
            <h3>Your message:</h3>
            <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px;">
              ${formData.message.replace(/\n/g, '<br>')}
            </div>
            <p>If you have any urgent questions, you can also reach us directly at info@onlinenote.ai</p>
            <p>Best regards,<br>The Online Note AI Team</p>
          </div>
        `,
      });

      if (!userEmailResult.success) {
        console.warn('Failed to send confirmation email to user:', userEmailResult.error);
      }

      toast({
        title: 'Message sent successfully!',
        description: 'We\'ll get back to you as soon as possible.',
      });

      // Reset form and trigger success callback
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      onSuccess();
    } catch (error) {
      console.error('Error sending contact form:', error);
      toast({
        title: 'Failed to send message',
        description: 'Please try again later or contact us directly at info@onlinenote.ai',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <Card className="border-0 shadow-none">
      <CardContent className="p-0">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder="Your name"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              placeholder="your@email.com"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              type="text"
              value={formData.subject}
              onChange={(e) => handleInputChange('subject', e.target.value)}
              placeholder="What's this about?"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Message *</Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleInputChange('message', e.target.value)}
              className="min-h-[100px]"
              placeholder="Tell us how we can help you..."
              disabled={isLoading}
            />
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-noteflow-500 to-purple-500 hover:from-noteflow-600 hover:to-purple-600"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Sending...
              </>
            ) : (
              'Send Message'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default ContactFormFields;
