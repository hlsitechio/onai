
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

// Enhanced email templates with beautiful dark theme and high contrast
export const emailTemplates = {
  welcome: (userEmail: string) => ({
    to: userEmail,
    subject: 'Welcome to Online Note AI! 🚀',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Online Note AI</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 30px; text-align: center; position: relative;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.2);">
              <span style="font-size: 40px; color: #fff;">🧠</span>
            </div>
            <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
              Welcome to Online Note AI!
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 18px; margin: 10px 0 0; font-weight: 300;">
              Your AI-powered note-taking journey begins now
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; color: #e0e0e0;">
            <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
              🎉 You're all set to revolutionize your note-taking!
            </h2>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0;">
              Thank you for joining Online Note AI. We're excited to help you organize and enhance your notes with cutting-edge AI-powered features.
            </p>
            
            <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
              <h3 style="color: #60a5fa; font-size: 20px; font-weight: 600; margin: 0 0 20px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">🚀</span> Getting Started:
              </h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
                  <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">1</span>
                  Create your first note by clicking the "New Note" button
                </li>
                <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
                  <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">2</span>
                  Use our AI assistant to help improve your writing
                </li>
                <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
                  <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">3</span>
                  Share your notes securely with others
                </li>
                <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
                  <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">4</span>
                  Access your notes from anywhere with cloud sync
                </li>
              </ul>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="https://onlinenote.ai/app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
                🚀 Start Creating Notes
              </a>
            </div>
            
            <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
              <p style="margin: 0; color: #60a5fa; font-size: 14px; line-height: 1.5;">
                <strong>💡 Pro Tip:</strong> Need help? Our AI assistant is always ready to help you write better, organize your thoughts, and boost your productivity!
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #0f0f23; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px; margin: 0 0 15px;">
              Have questions? We're here to help at 
              <a href="mailto:info@onlinenote.ai" style="color: #60a5fa; text-decoration: none;">info@onlinenote.ai</a>
            </p>
            <p style="color: #666; font-size: 12px; margin: 0;">
              Best regards,<br>
              <strong style="color: #60a5fa;">The Online Note AI Team</strong>
            </p>
            <div style="margin-top: 20px;">
              <a href="https://onlinenote.ai" style="color: #60a5fa; text-decoration: none; font-size: 12px;">onlinenote.ai</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  shareNotification: (recipientEmail: string, sharedBy: string, noteTitle: string, shareUrl: string) => ({
    to: recipientEmail,
    subject: `📝 ${sharedBy} shared "${noteTitle}" with you`,
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Note Shared With You</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); padding: 40px 30px; text-align: center; position: relative;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.2);">
              <span style="font-size: 40px; color: #fff;">📝</span>
            </div>
            <h1 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
              Note Shared With You
            </h1>
            <p style="color: rgba(255, 255, 255, 0.9); font-size: 16px; margin: 10px 0 0; font-weight: 300;">
              Someone wants to share their thoughts with you
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; color: #e0e0e0;">
            <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 0 0 30px; border: 1px solid #4a5568; text-align: center;">
              <h2 style="color: #ffffff; font-size: 22px; font-weight: 600; margin: 0 0 15px;">
                <span style="color: #f093fb;">${sharedBy}</span> shared a note with you
              </h2>
              <div style="background: rgba(240, 147, 251, 0.1); border: 1px solid rgba(240, 147, 251, 0.3); border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #f093fb; font-size: 18px; font-weight: 600; margin: 0; word-break: break-word;">
                  "${noteTitle}"
                </h3>
              </div>
            </div>
            
            <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
              This note was shared through <strong style="color: #f093fb;">Online Note AI</strong>, a secure note-taking platform designed for seamless collaboration.
            </p>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${shareUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(240, 147, 251, 0.3); transition: all 0.3s ease;">
                📖 View Note
              </a>
            </div>
            
            <div style="background: rgba(240, 147, 251, 0.1); border: 1px solid rgba(240, 147, 251, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
              <p style="margin: 0 0 15px; color: #f093fb; font-size: 14px; font-weight: 600;">
                🔒 Your Privacy Matters
              </p>
              <p style="margin: 0; color: #b0b0b0; font-size: 14px; line-height: 1.5;">
                This shared note is accessed securely. Only people with the direct link can view it, and your personal information remains protected.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0; padding: 20px; background: rgba(96, 165, 250, 0.1); border-radius: 10px; border: 1px solid rgba(96, 165, 250, 0.3);">
              <p style="margin: 0 0 15px; color: #60a5fa; font-size: 15px; font-weight: 600;">
                Don't have an account yet?
              </p>
              <a href="https://onlinenote.ai/auth" style="color: #60a5fa; text-decoration: none; font-weight: 600;">
                🚀 Sign up for free
              </a>
              <p style="margin: 15px 0 0; color: #888; font-size: 12px;">
                Join thousands of users creating and sharing amazing notes with AI
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #0f0f23; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px; margin: 0 0 15px;">
              Questions about this shared note? Contact us at 
              <a href="mailto:info@onlinenote.ai" style="color: #f093fb; text-decoration: none;">info@onlinenote.ai</a>
            </p>
            <p style="color: #666; font-size: 12px; margin: 0;">
              Powered by <strong style="color: #f093fb;">Online Note AI</strong><br>
              <a href="https://onlinenote.ai" style="color: #60a5fa; text-decoration: none; font-size: 12px;">onlinenote.ai</a>
            </p>
          </div>
        </div>
      </body>
      </html>
    `,
  }),

  passwordReset: (userEmail: string, resetUrl: string) => ({
    to: userEmail,
    subject: '🔐 Reset Your Online Note AI Password',
    html: `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password</title>
      </head>
      <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
        <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); padding: 40px 30px; text-align: center; position: relative;">
            <div style="background: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.2);">
              <span style="font-size: 40px; color: #333;">🔐</span>
            </div>
            <h1 style="color: #333; font-size: 28px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);">
              Reset Your Password
            </h1>
            <p style="color: rgba(51, 51, 51, 0.8); font-size: 16px; margin: 10px 0 0; font-weight: 300;">
              Secure your account with a new password
            </p>
          </div>
          
          <!-- Content -->
          <div style="padding: 40px 30px; color: #e0e0e0;">
            <div style="background: rgba(252, 182, 159, 0.1); border: 1px solid rgba(252, 182, 159, 0.3); border-radius: 12px; padding: 25px; margin: 0 0 30px; text-align: center;">
              <h2 style="color: #fcb69f; font-size: 20px; font-weight: 600; margin: 0 0 15px;">
                🔑 Password Reset Request
              </h2>
              <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin: 0;">
                We received a request to reset your password for your Online Note AI account. Click the button below to create a new password.
              </p>
            </div>
            
            <div style="text-align: center; margin: 40px 0;">
              <a href="${resetUrl}" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(252, 182, 159, 0.3); transition: all 0.3s ease;">
                🔐 Reset Password
              </a>
            </div>
            
            <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
              <h3 style="color: #fbbf24; font-size: 18px; font-weight: 600; margin: 0 0 15px; display: flex; align-items: center;">
                <span style="margin-right: 10px;">⚠️</span> Security Notice:
              </h3>
              <ul style="list-style: none; padding: 0; margin: 0;">
                <li style="display: flex; align-items: flex-start; margin: 12px 0; color: #e0e0e0; font-size: 14px;">
                  <span style="color: #fbbf24; margin-right: 10px; margin-top: 2px;">•</span>
                  This link will expire in <strong>24 hours</strong> for security reasons
                </li>
                <li style="display: flex; align-items: flex-start; margin: 12px 0; color: #e0e0e0; font-size: 14px;">
                  <span style="color: #fbbf24; margin-right: 10px; margin-top: 2px;">•</span>
                  If you didn't request this reset, you can safely ignore this email
                </li>
                <li style="display: flex; align-items: flex-start; margin: 12px 0; color: #e0e0e0; font-size: 14px;">
                  <span style="color: #fbbf24; margin-right: 10px; margin-top: 2px;">•</span>
                  For security, never share this link with anyone
                </li>
              </ul>
            </div>
            
            <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
              <p style="margin: 0; color: #60a5fa; font-size: 14px; line-height: 1.5;">
                <strong>💡 Tip:</strong> Choose a strong password with at least 8 characters, including numbers and special characters to keep your notes secure.
              </p>
            </div>
          </div>
          
          <!-- Footer -->
          <div style="background: #0f0f23; padding: 30px; text-align: center; border-top: 1px solid #333;">
            <p style="color: #888; font-size: 14px; margin: 0 0 15px;">
              Need help? Contact our support team at 
              <a href="mailto:info@onlinenote.ai" style="color: #fcb69f; text-decoration: none;">info@onlinenote.ai</a>
            </p>
            <p style="color: #666; font-size: 12px; margin: 0;">
              Best regards,<br>
              <strong style="color: #fcb69f;">The Online Note AI Team</strong>
            </p>
            <div style="margin-top: 20px;">
              <a href="https://onlinenote.ai" style="color: #60a5fa; text-decoration: none; font-size: 12px;">onlinenote.ai</a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  }),
};

// Test email function
export const sendTestEmail = async (testEmail: string, templateType: 'welcome' | 'share' | 'reset') => {
  let template;
  
  switch (templateType) {
    case 'welcome':
      template = emailTemplates.welcome(testEmail);
      break;
    case 'share':
      template = emailTemplates.shareNotification(
        testEmail,
        'Test User',
        'Sample Note Title - AI-Generated Content',
        'https://onlinenote.ai/shared/test-note-123'
      );
      break;
    case 'reset':
      template = emailTemplates.passwordReset(
        testEmail,
        'https://onlinenote.ai/reset-password?token=test-token-123'
      );
      break;
    default:
      throw new Error('Invalid template type');
  }
  
  return await sendEmail(template);
};
