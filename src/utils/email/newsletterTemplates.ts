
import { createEmailTemplate } from './emailTemplateUtils';

export const newsletterEmailTemplates = {
  // Newsletter subscription confirmation
  subscriptionConfirmation: (userEmail: string, userName?: string) => ({
    to: userEmail,
    subject: '🎉 Welcome to Online Note AI Newsletter!',
    html: createEmailTemplate(
      'Welcome to Our Newsletter!',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '📧',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Welcome to the Online Note AI community${userName ? `, ${userName}` : ''}! 🎉
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Thank you for subscribing to our newsletter. You're now part of our community of productive writers!
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #60a5fa; font-size: 20px; font-weight: 600; margin: 0 0 20px;">
            🌟 What to expect from us:
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Latest AI-powered writing features and updates
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Productivity tips and writing best practices
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Exclusive content and early access to new features
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Community highlights and success stories
            </li>
          </ul>
        </div>
        
        <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; color: #60a5fa; font-size: 14px; line-height: 1.5;">
            <strong>💡 Pro Tip:</strong> Add our email to your contacts to ensure you never miss an update. You can also reply to any of our emails if you have questions or feedback!
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; margin-right: 15px;">
            🚀 Start Writing Amazing Notes
          </a>
          <a href="https://onlinenote.ai/app" style="background: transparent; color: #60a5fa; text-decoration: none; padding: 16px 32px; border: 2px solid #60a5fa; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
            📝 Go to App
          </a>
        </div>
      `
    ),
  }),

  // Newsletter welcome series - first email
  welcomeSeries1: (userEmail: string, userName?: string) => ({
    to: userEmail,
    subject: '🚀 Getting Started with Online Note AI - Your First Steps',
    html: createEmailTemplate(
      'Let\'s Get You Started!',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      '🚀',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Ready to supercharge your writing${userName ? `, ${userName}` : ''}? 🚀
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Welcome to your journey with Online Note AI! Let's help you get the most out of our powerful writing assistant.
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #4facfe; font-size: 18px; font-weight: 600; margin: 0 0 20px;">
            🎯 Quick Start Guide:
          </h3>
          <ol style="color: #e0e0e0; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
            <li style="margin: 10px 0;"><strong>Create your first note:</strong> Click the "+" button and start writing</li>
            <li style="margin: 10px 0;"><strong>Try AI assistance:</strong> Highlight text and use our AI suggestions</li>
            <li style="margin: 10px 0;"><strong>Organize with tags:</strong> Keep your notes structured and findable</li>
            <li style="margin: 10px 0;"><strong>Enable sync:</strong> Access your notes from any device</li>
          </ol>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/app" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3); transition: all 0.3s ease;">
            ✨ Start Writing Now
          </a>
        </div>
      `
    ),
  }),
};
