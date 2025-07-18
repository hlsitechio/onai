
import { createEmailTemplate } from './emailTemplateUtils';

export const subscriptionEmailTemplates = {
  // Trial Started
  trialStarted: (userEmail: string, userName: string, trialDays: number = 14) => ({
    to: userEmail,
    subject: '🚀 Your Premium Trial Has Started!',
    html: createEmailTemplate(
      'Premium Trial Started!',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '🚀',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Welcome to Premium, ${userName}! 🎉
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Your ${trialDays}-day premium trial has started. Enjoy unlimited access to all AI-powered features!
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #60a5fa; font-size: 20px; font-weight: 600; margin: 0 0 20px;">
            🎯 What's Included:
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Unlimited AI-powered writing assistance
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Advanced note organization and tagging
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Priority customer support
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Enhanced collaboration features
            </li>
          </ul>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/app" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
            🚀 Start Using Premium Features
          </a>
        </div>
      `
    ),
  }),

  // Trial Reminder (3 days left)
  trialReminder: (userEmail: string, userName: string, daysLeft: number = 3) => ({
    to: userEmail,
    subject: `⏰ ${daysLeft} Days Left in Your Premium Trial`,
    html: createEmailTemplate(
      'Trial Reminder',
      'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
      '⏰',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Hi ${userName}, your trial ends soon!
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          You have <strong style="color: #fcb69f;">${daysLeft} days left</strong> in your premium trial. Don't miss out on these amazing features!
        </p>
        
        <div style="background: rgba(252, 182, 159, 0.1); border: 1px solid rgba(252, 182, 159, 0.3); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
          <h3 style="color: #fcb69f; font-size: 18px; font-weight: 600; margin: 0 0 15px;">
            🎯 Continue enjoying premium benefits
          </h3>
          <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin: 0;">
            Keep your unlimited AI assistance, advanced features, and priority support by upgrading today.
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/subscription" style="background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%); color: #333; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(252, 182, 159, 0.3); transition: all 0.3s ease;">
            💎 Upgrade to Premium
          </a>
        </div>
      `
    ),
  }),

  // Trial Expired
  trialExpired: (userEmail: string, userName: string) => ({
    to: userEmail,
    subject: '😔 Your Premium Trial Has Ended',
    html: createEmailTemplate(
      'Trial Ended',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '😔',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Thanks for trying Premium, ${userName}
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Your premium trial has ended, but you can still use Online Note AI with our generous free plan. Want to get back to premium features?
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #60a5fa; font-size: 18px; font-weight: 600; margin: 0 0 15px;">
            💝 Special Offer Just for You
          </h3>
          <p style="color: #e0e0e0; font-size: 15px; line-height: 1.6; margin: 0;">
            Get 20% off your first month when you upgrade within the next 7 days. Use code: <strong style="color: #60a5fa;">WELCOME20</strong>
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/subscription?code=WELCOME20" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
            💎 Upgrade with 20% Off
          </a>
        </div>
      `
    ),
  }),

  // Subscription Started
  subscriptionStarted: (userEmail: string, userName: string, planName: string) => ({
    to: userEmail,
    subject: '🎉 Welcome to Premium! Your Subscription is Active',
    html: createEmailTemplate(
      'Premium Activated!',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      '🎉',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Welcome to Premium, ${userName}! 🚀
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Your <strong style="color: #4facfe;">${planName}</strong> subscription is now active. Thank you for supporting Online Note AI!
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #4facfe; font-size: 20px; font-weight: 600; margin: 0 0 20px;">
            🌟 You now have access to:
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #4facfe; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Unlimited AI writing assistance and suggestions
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #4facfe; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Advanced organization and tagging system
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #4facfe; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Priority customer support and faster response times
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #4facfe; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Enhanced collaboration and sharing features
            </li>
          </ul>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/app" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3); transition: all 0.3s ease;">
            🚀 Start Using Premium Features
          </a>
        </div>
      `
    ),
  }),

  // Payment Failed
  paymentFailed: (userEmail: string, userName: string, retryUrl: string) => ({
    to: userEmail,
    subject: '⚠️ Payment Issue - Action Required',
    html: createEmailTemplate(
      'Payment Issue',
      'linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%)',
      '⚠️',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Hi ${userName}, we couldn't process your payment
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          There was an issue processing your subscription payment. Don't worry - you still have access to your premium features for now.
        </p>
        
        <div style="background: rgba(255, 107, 107, 0.1); border: 1px solid rgba(255, 107, 107, 0.3); border-radius: 12px; padding: 25px; margin: 30px 0; text-align: center;">
          <h3 style="color: #ff6b6b; font-size: 18px; font-weight: 600; margin: 0 0 15px;">
            🔧 Quick Fix Available
          </h3>
          <p style="color: #b0b0b0; font-size: 15px; line-height: 1.6; margin: 0;">
            Update your payment method to continue enjoying premium features without interruption.
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="${retryUrl}" style="background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(255, 107, 107, 0.3); transition: all 0.3s ease;">
            💳 Update Payment Method
          </a>
        </div>
      `
    ),
  }),

  // Subscription Cancelled
  subscriptionCancelled: (userEmail: string, userName: string, endDate: string) => ({
    to: userEmail,
    subject: '😢 Your Subscription Has Been Cancelled',
    html: createEmailTemplate(
      'Subscription Cancelled',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      '😢',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          We're sorry to see you go, ${userName}
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Your subscription has been cancelled. You'll continue to have access to premium features until <strong style="color: #667eea;">${endDate}</strong>.
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #60a5fa; font-size: 18px; font-weight: 600; margin: 0 0 15px;">
            💝 We'd Love Your Feedback
          </h3>
          <p style="color: #e0e0e0; font-size: 15px; line-height: 1.6; margin: 0;">
            Help us improve by letting us know what we could have done better. Your feedback is invaluable to us.
          </p>
        </div>
        
        <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; color: #60a5fa; font-size: 14px; line-height: 1.5;">
            <strong>💡 Remember:</strong> You can always reactivate your subscription anytime. We'll be here when you're ready to come back!
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="mailto:info@onlinenote.ai?subject=Subscription Feedback" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s ease; margin-right: 15px;">
            💬 Share Feedback
          </a>
          <a href="https://onlinenote.ai/subscription" style="background: transparent; color: #60a5fa; text-decoration: none; padding: 16px 32px; border: 2px solid #60a5fa; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; transition: all 0.3s ease;">
            🔄 Reactivate
          </a>
        </div>
      `
    ),
  }),

  // Subscription Renewed
  subscriptionRenewed: (userEmail: string, userName: string, planName: string, nextBillingDate: string) => ({
    to: userEmail,
    subject: '✅ Subscription Renewed Successfully',
    html: createEmailTemplate(
      'Subscription Renewed',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      '✅',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Thank you, ${userName}! 🙏
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Your <strong style="color: #4facfe;">${planName}</strong> subscription has been renewed successfully. Your next billing date is <strong style="color: #4facfe;">${nextBillingDate}</strong>.
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568; text-align: center;">
          <h3 style="color: #4facfe; font-size: 18px; font-weight: 600; margin: 0 0 15px;">
            🎉 Continue Enjoying Premium
          </h3>
          <p style="color: #e0e0e0; font-size: 15px; line-height: 1.6; margin: 0;">
            Your premium features continue without interruption. Thank you for your continued support!
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/app" style="background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(79, 172, 254, 0.3); transition: all 0.3s ease;">
            🚀 Continue Creating Amazing Notes
          </a>
        </div>
      `
    ),
  }),

  // Account Downgraded
  accountDowngraded: (userEmail: string, userName: string) => ({
    to: userEmail,
    subject: 'ℹ️ Account Downgraded to Free Plan',
    html: createEmailTemplate(
      'Account Downgraded',
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'ℹ️',
      `
        <h2 style="color: #ffffff; font-size: 24px; font-weight: 600; margin: 0 0 20px; text-align: center;">
          Hi ${userName}, your account has been downgraded
        </h2>
        
        <p style="font-size: 16px; line-height: 1.6; margin: 0 0 30px; color: #b0b0b0; text-align: center;">
          Your subscription has ended and your account has been downgraded to our free plan. You can still use Online Note AI with basic features!
        </p>
        
        <div style="background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%); border-radius: 12px; padding: 25px; margin: 30px 0; border: 1px solid #4a5568;">
          <h3 style="color: #60a5fa; font-size: 18px; font-weight: 600; margin: 0 0 15px;">
            🆓 What You Still Get for Free:
          </h3>
          <ul style="list-style: none; padding: 0; margin: 0;">
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Unlimited note creation and editing
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Basic AI assistance (limited usage)
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Cloud storage and sync across devices
            </li>
            <li style="display: flex; align-items: center; margin: 15px 0; color: #e0e0e0; font-size: 15px;">
              <span style="background: #60a5fa; color: #1a1a2e; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin-right: 15px; font-weight: bold; font-size: 12px;">✓</span>
              Basic sharing and collaboration
            </li>
          </ul>
        </div>
        
        <div style="background: rgba(96, 165, 250, 0.1); border: 1px solid rgba(96, 165, 250, 0.3); border-radius: 10px; padding: 20px; margin: 30px 0;">
          <p style="margin: 0; color: #60a5fa; font-size: 14px; line-height: 1.5;">
            <strong>💡 Want premium features back?</strong> Upgrade anytime to get unlimited AI assistance, advanced features, and priority support.
          </p>
        </div>
      `,
      `
        <div style="text-align: center; margin: 40px 0;">
          <a href="https://onlinenote.ai/subscription" style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: #ffffff; text-decoration: none; padding: 16px 32px; border-radius: 50px; font-weight: 600; font-size: 16px; display: inline-block; box-shadow: 0 8px 20px rgba(102, 126, 234, 0.3); transition: all 0.3s ease;">
            💎 Upgrade to Premium
          </a>
        </div>
      `
    ),
  }),
};
