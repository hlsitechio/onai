import { createEmailTemplate } from './emailTemplateUtils';
import { subscriptionEmailTemplates } from './subscriptionTemplates';

// Legacy templates (keeping for backward compatibility)
export const emailTemplates = {
  welcome: subscriptionEmailTemplates.subscriptionStarted,
  shareNotification: (recipientEmail: string, sharedBy: string, noteTitle: string, shareUrl: string) => ({
    to: recipientEmail,
    subject: `📝 ${sharedBy} shared "${noteTitle}" with you`,
    html: createEmailTemplate(
      'Note Shared With You',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      '📝',
      `
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
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="${shareUrl}" style="background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(240, 147, 251, 0.3); transition: all 0.3s ease;">
            📖 View Note
          </a>
        </div>
      `
    ),
  }),
  passwordReset: (userEmail: string, resetUrl: string) => ({
    to: userEmail,
    subject: '🔐 Reset Your Online Note AI Password',
    html: createEmailTemplate(
      'Reset Your Password',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      '🔐',
      `
        <div style="background: rgba(252, 182, 159, 0.1); border: 1px solid rgba(252, 182, 159, 0.3); border-radius: 12px; padding: 25px; margin: 0 0 30px; text-align: center;">
          <h2 style="color: #fcb69f; font-size: 20px; font-weight: 600; margin: 0 0 15px;">
            🔑 Password Reset Request
          </h2>
          <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin: 0;">
            We received a request to reset your password for your Online Note AI account. Click the button below to create a new password.
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="${resetUrl}" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(252, 182, 159, 0.3); transition: all 0.3s ease;">
            🔐 Reset Password
          </a>
        </div>
      `
    ),
  }),
};
