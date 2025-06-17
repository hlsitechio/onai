
// Base email template structure and utilities
export const createEmailTemplate = (title: string, headerGradient: string, headerIcon: string, content: string, ctaButton?: string) => `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%); min-height: 100vh;">
  <div style="max-width: 600px; margin: 0 auto; background: #1a1a2e; border: 1px solid #333; border-radius: 16px; overflow: hidden; box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);">
    <!-- Header -->
    <div style="background: ${headerGradient}; padding: 40px 30px; text-align: center; position: relative;">
      <div style="background: rgba(255, 255, 255, 0.1); width: 80px; height: 80px; border-radius: 50%; margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; border: 2px solid rgba(255, 255, 255, 0.2);">
        <span style="font-size: 40px; color: #fff;">${headerIcon}</span>
      </div>
      <h1 style="color: #ffffff; font-size: 32px; font-weight: 700; margin: 0; text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);">
        ${title}
      </h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 40px 30px; color: #e0e0e0;">
      ${content}
      ${ctaButton || ''}
    </div>
    
    <!-- Footer -->
    <div style="background: #0f0f23; padding: 30px; text-align: center; border-top: 1px solid #333;">
      <p style="color: #888; font-size: 14px; margin: 0 0 15px;">
        Questions? Contact us at 
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
`;
