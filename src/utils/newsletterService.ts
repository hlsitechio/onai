
import { sendEmail } from './emailService';
import { newsletterEmailTemplates } from './email/newsletterTemplates';

export const sendNewsletterConfirmation = async (userEmail: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Newsletter service: Sending confirmation email to:', userEmail);
    
    // Extract user name from email (first part before @)
    const userName = userEmail.split('@')[0];
    
    // Create the confirmation email
    const emailData = newsletterEmailTemplates.subscriptionConfirmation(userEmail, userName);
    
    console.log('Newsletter service: Email data prepared, calling sendEmail...');
    
    // Send the email
    const result = await sendEmail(emailData);
    
    console.log('Newsletter service: sendEmail result:', result);
    
    if (result.success) {
      console.log('Newsletter service: Confirmation email sent successfully to:', userEmail);
      return { success: true };
    } else {
      console.error('Newsletter service: Failed to send confirmation email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Newsletter service: Exception occurred:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};

export const sendWelcomeSeriesEmail = async (userEmail: string, emailNumber: number = 1): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log(`Newsletter service: Sending welcome series email ${emailNumber} to:`, userEmail);
    
    const userName = userEmail.split('@')[0];
    let emailData;
    
    switch (emailNumber) {
      case 1:
        emailData = newsletterEmailTemplates.welcomeSeries1(userEmail, userName);
        break;
      default:
        return { success: false, error: 'Invalid email number for welcome series' };
    }
    
    const result = await sendEmail(emailData);
    
    if (result.success) {
      console.log(`Newsletter service: Welcome series email ${emailNumber} sent successfully to:`, userEmail);
      return { success: true };
    } else {
      console.error(`Newsletter service: Failed to send welcome series email ${emailNumber}:`, result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Newsletter service: Exception occurred:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
