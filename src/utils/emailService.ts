
import { supabase } from '@/integrations/supabase/client';

interface EmailData {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

export const sendEmail = async (emailData: EmailData): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Email service: Attempting to send email via Supabase edge function...');
    console.log('Email service: Recipient:', emailData.to);
    console.log('Email service: Subject:', emailData.subject);
    
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: {
        to: emailData.to,
        subject: emailData.subject,
        html: emailData.html,
        from: emailData.from || "Online Note AI <info@onlinenote.ai>"
      }
    });

    console.log('Email service: Supabase function response:', { data, error });

    if (error) {
      console.error('Email service: Supabase function error:', error);
      return { 
        success: false, 
        error: error.message || 'Failed to send email via Supabase function' 
      };
    }

    if (data && !data.success) {
      console.error('Email service: Email function returned failure:', data.error);
      return { 
        success: false, 
        error: data.error || 'Email function returned failure' 
      };
    }

    console.log('Email service: Email sent successfully');
    return { success: true };
  } catch (error) {
    console.error('Email service: Exception occurred:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
