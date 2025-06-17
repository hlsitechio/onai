
import { sendEmail } from './emailService';
import { subscriptionEmailTemplates } from './subscriptionTemplates';
import { emailTemplates } from './legacyTemplates';

// Test email function - now includes subscription templates
export const sendTestEmail = async (testEmail: string, templateType: 'welcome' | 'share' | 'reset' | 'trial-started' | 'trial-reminder' | 'trial-expired' | 'subscription-started' | 'payment-failed' | 'subscription-cancelled' | 'subscription-renewed' | 'account-downgraded') => {
  let template;
  
  switch (templateType) {
    case 'welcome':
    case 'subscription-started':
      template = subscriptionEmailTemplates.subscriptionStarted(testEmail, 'Test User', 'Professional Plan');
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
    case 'trial-started':
      template = subscriptionEmailTemplates.trialStarted(testEmail, 'Test User', 14);
      break;
    case 'trial-reminder':
      template = subscriptionEmailTemplates.trialReminder(testEmail, 'Test User', 3);
      break;
    case 'trial-expired':
      template = subscriptionEmailTemplates.trialExpired(testEmail, 'Test User');
      break;
    case 'payment-failed':
      template = subscriptionEmailTemplates.paymentFailed(testEmail, 'Test User', 'https://onlinenote.ai/billing/retry');
      break;
    case 'subscription-cancelled':
      template = subscriptionEmailTemplates.subscriptionCancelled(testEmail, 'Test User', 'January 15, 2025');
      break;
    case 'subscription-renewed':
      template = subscriptionEmailTemplates.subscriptionRenewed(testEmail, 'Test User', 'Professional Plan', 'February 15, 2025');
      break;
    case 'account-downgraded':
      template = subscriptionEmailTemplates.accountDowngraded(testEmail, 'Test User');
      break;
    default:
      throw new Error('Invalid template type');
  }
  
  return await sendEmail(template);
};
