
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

// Predefined email templates
export const emailTemplates = {
  welcome: (userEmail: string) => ({
    to: userEmail,
    subject: 'Welcome to Online Note AI!',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Welcome to Online Note AI!</h1>
        <p>Thank you for joining Online Note AI. We're excited to help you organize and enhance your notes with AI-powered features.</p>
        <h2>Getting Started:</h2>
        <ul>
          <li>Create your first note by clicking the "New Note" button</li>
          <li>Use our AI assistant to help improve your writing</li>
          <li>Share your notes securely with others</li>
          <li>Access your notes from anywhere with cloud sync</li>
        </ul>
        <p>If you have any questions, feel free to reach out to us at <a href="mailto:info@onlinenote.ai">info@onlinenote.ai</a></p>
        <p>Best regards,<br>The Online Note AI Team</p>
      </div>
    `,
  }),

  shareNotification: (recipientEmail: string, sharedBy: string, noteTitle: string, shareUrl: string) => ({
    to: recipientEmail,
    subject: `${sharedBy} shared a note with you - ${noteTitle}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Note Shared With You</h1>
        <p><strong>${sharedBy}</strong> has shared a note with you titled: <strong>${noteTitle}</strong></p>
        <div style="margin: 20px 0;">
          <a href="${shareUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">View Note</a>
        </div>
        <p>This note was shared through Online Note AI, a secure note-taking platform.</p>
        <p>If you don't have an account yet, you can <a href="https://onlinenote.ai/auth">sign up for free</a> to create your own notes.</p>
      </div>
    `,
  }),

  passwordReset: (userEmail: string, resetUrl: string) => ({
    to: userEmail,
    subject: 'Reset Your Online Note AI Password',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #4f46e5;">Reset Your Password</h1>
        <p>We received a request to reset your password for your Online Note AI account.</p>
        <div style="margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">Reset Password</a>
        </div>
        <p>If you didn't request this password reset, you can safely ignore this email.</p>
        <p>This link will expire in 24 hours for security reasons.</p>
        <p>Best regards,<br>The Online Note AI Team</p>
      </div>
    `,
  }),
};
