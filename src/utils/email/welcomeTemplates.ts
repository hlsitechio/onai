
import { createEmailTemplate } from './emailTemplateUtils';

export const welcomeEmailTemplates = {
  // Welcome email for new users
  welcomeNewUser: (userEmail: string, userName: string) => ({
    to: userEmail,
    subject: '🎉 Welcome to Online Note AI - Your Journey Begins!',
    html: createEmailTemplate(
      'Welcome to Online Note AI!',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '🚀',
      `
        <h2 style="color: #ffffff; font-size: 28px; font-weight: 700; margin: 0 0 25px; text-align: center; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
          Welcome aboard, ${userName}! 🎉
        </h2>
        
        <p style="font-size: 18px; line-height: 1.7; margin: 0 0 35px; color: #e0e0e0; text-align: center;">
          Thank you for joining <strong style="color: #667eea;">Online Note AI</strong>! We're thrilled to have you as part of our community.
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 16px; padding: 35px; margin: 35px 0; border: 1px solid #4a5568; box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);">
          <h3 style="color: #667eea; font-size: 22px; font-weight: 600; margin: 0 0 25px; text-align: center;">
            🌟 What's Next?
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="display: flex; align-items: center; margin: 20px 0; color: #e0e0e0; font-size: 16px;">
              <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">1</span>
              Create your first note and experience our AI-powered writing assistance
            </li>
            <li style="display: flex; align-items: center; margin: 20px 0; color: #e0e0e0; font-size: 16px;">
              <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">2</span>
              Explore our advanced organization and tagging features
            </li>
            <li style="display: flex; align-items: center; margin: 20px 0; color: #e0e0e0; font-size: 16px;">
              <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">3</span>
              Share and collaborate with others seamlessly
            </li>
            <li style="display: flex; align-items: center; margin: 20px 0; color: #e0e0e0; font-size: 16px;">
              <span style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; width: 32px; height: 32px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 20px; font-weight: bold; font-size: 14px; box-shadow: 0 4px 12px rgba(102, 126, 234, 0.3);">4</span>
              Discover premium features to supercharge your productivity
            </li>
          </ul>
        </div>
        
        <div style="background: rgba(102, 126, 234, 0.1); border: 1px solid rgba(102, 126, 234, 0.3); border-radius: 12px; padding: 25px; margin: 35px 0; text-align: center;">
          <h3 style="color: #667eea; font-size: 20px; font-weight: 600; margin: 0 0 15px;">
            💡 Pro Tip
          </h3>
          <p style="color: #e0e0e0; font-size: 16px; line-height: 1.6; margin: 0;">
            Start with a simple note and let our AI help you expand your ideas. You'll be amazed at what you can create together!
          </p>
        </div>
        
        <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); border-radius: 12px; padding: 25px; margin: 35px 0; border: 1px solid #333;">
          <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin: 0; text-align: center;">
            <strong style="color: #667eea;">Need help getting started?</strong><br>
            Check out our quick start guide or reach out to our friendly support team anytime.
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 18px 36px; border-radius: 50px; font-weight: 600; font-size: 18px; display: inline-block; box-shadow: 0 8px 25px rgba(102, 126, 234, 0.4); transition: all 0.3s ease; text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);">
            🚀 Start Creating Amazing Notes
          </a>
        </div>
        
        <div style="text-align: center; margin: 30px 0 0;">
          <p style="color: #888; font-size: 14px; margin: 0;">
            Follow us for tips, updates, and inspiration:
          </p>
          <div style="margin: 15px 0;">
            <a href="https://twitter.com/onlinenoteai" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Twitter</a>
            <span style="color: #666;">•</span>
            <a href="https://linkedin.com/company/onlinenoteai" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">LinkedIn</a>
            <span style="color: #666;">•</span>
            <a href="https://blog.onlinenote.ai" style="color: #667eea; text-decoration: none; margin: 0 10px; font-size: 14px;">Blog</a>
          </div>
        </div>
      `
    ),
  }),
};
