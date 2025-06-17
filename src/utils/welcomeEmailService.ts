
import { sendEmail } from './emailService';
import { welcomeEmailTemplates } from './email/welcomeTemplates';

export const sendWelcomeEmail = async (userEmail: string): Promise<{ success: boolean; error?: string }> => {
  try {
    // Extract user name from email (first part before @)
    const userName = userEmail.split('@')[0];
    
    // Create the welcome email
    const emailData = welcomeEmailTemplates.welcomeNewUser(userEmail, userName);
    
    console.log('Sending welcome email to:', userEmail);
    
    // Send the email
    const result = await sendEmail(emailData);
    
    if (result.success) {
      console.log('Welcome email sent successfully to:', userEmail);
      return { success: true };
    } else {
      console.error('Failed to send welcome email:', result.error);
      return { success: false, error: result.error };
    }
  } catch (error) {
    console.error('Error in sendWelcomeEmail:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
};
