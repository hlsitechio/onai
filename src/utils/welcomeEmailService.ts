
import { sendEmail } from './emailService';
import { welcomeEmailTemplates } from './email/welcomeTemplates';

export const sendWelcomeEmail = async (userEmail: string): Promise<{ success: boolean; error?: string }> => {
  try {
    console.log('Welcome email service: Starting email send process for:', userEmail);
    
    // Extract user name from email (first part before @)
    const userName = userEmail.split('@')[0];
    
    // Create the welcome email
    const emailData = welcomeEmailTemplates.welcomeNewUser(userEmail, userName);
    
    console.log('Welcome email service: Email data prepared, calling sendEmail...');
    
    // Send the email
    const result = await sendEmail(emailData);
    
    console.log('Welcome email service: sendEmail result:', result);
    
    if (result.success) {
      console.log('Welcome email service: Email sent successfully to:', userEmail);
      return { success: true };
    } else {
      console.error('Welcome email service: Failed to send email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Welcome email service: Exception occurred:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
