
import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: emailData,
    });

    if (error) {
      console.error('Error invoking send-email function:', error);
      return { success: false, error: error.message };
    }

    if (!data.success) {
      console.error('Email sending failed:', data.error);
      return { success: false, error: data.error };
    }

    console.log('Email sent successfully:', data.data);
    return { success: true };
  } catch (error) {
    console.error('Unexpected error sending email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

// Export templates and utilities from other files for convenience
export { subscriptionEmailTemplates } from './email/subscriptionTemplates';
export { emailTemplates } from './email/legacyTemplates';
export { sendTestEmail } from './email/testEmailService';
export { createEmailTemplate } from './email/emailTemplateUtils';
