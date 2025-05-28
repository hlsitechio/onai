# OneAI Security System

This comprehensive security system provides robust protection for the OneAI application, focusing on Gemini 2.5 AI integration, Supabase interactions, and client-side security.

## Overview

The OneAI Security System includes:

1. **Core Security Configuration** (`securityConfig.ts`)
   - Content Security Policy (CSP) configuration
   - XSS protection utilities
   - Storage security
   - Gemini API security

2. **Supabase Security** (`supabaseSecurity.ts`)
   - Edge Function security
   - Storage security
   - Realtime subscription security
   - Rate limiting

3. **Gemini AI Security** (`geminiSecurity.ts`)
   - Prompt injection protection
   - Response validation
   - Rate limiting
   - Content moderation

4. **UI Security** (`uiSecurity.ts`)
   - Input sanitization
   - Modal security (positioned at top-24, 80vh max-height)
   - Safe rendering
   - Link protection

5. **Middleware Integration** (`securityMiddleware.ts`)
   - React hooks and components
   - Context provider for app-wide security
   - Security-enhanced UI components

6. **Server-Side Security** (`.htaccess`)
   - Proper routing for all application paths
   - Comprehensive security headers
   - XSS protection
   - Content Security Policy
   - CORS configuration

## Getting Started

The security system is already integrated into the application's main component tree. To use it in your components:

```tsx
import { useSecurity, SecureInput, SecureLink } from '@/utils/security/securityMiddleware';

const MyComponent = () => {
  const security = useSecurity();
  
  // Sanitize user input
  const handleInput = (rawInput) => {
    const safeInput = security.sanitizeInput(rawInput);
    // Process safe input...
  };
  
  return (
    <div>
      {/* Use secure input component */}
      <SecureInput 
        value={inputValue} 
        onChange={setValue} 
        placeholder="Enter text securely" 
      />
      
      {/* Use secure link component */}
      <SecureLink href="https://example.com">
        Secure External Link
      </SecureLink>
    </div>
  );
};
```

## Gemini AI Integration

For Gemini 2.5 AI integration, use the provided hook:

```tsx
import { useGeminiSecurity } from '@/utils/security/securityMiddleware';

const AIComponent = () => {
  const gemini = useGeminiSecurity();
  
  const generateContent = async (prompt) => {
    // Sanitize the prompt
    const safePrompt = gemini.sanitizePrompt(prompt);
    
    // Generate content safely
    const response = await gemini.generateSafeContent(safePrompt);
    
    // Validate the response
    if (!gemini.validateResponse(response)) {
      // Handle invalid response
      return;
    }
    
    // Use the safe response...
  };
  
  return (
    // Component implementation
  );
};
```

## Supabase Integration

For secure Supabase operations:

```tsx
import { useSupabaseSecurity } from '@/utils/security/securityMiddleware';

const DataComponent = () => {
  const supabaseSecurity = useSupabaseSecurity();
  
  // Securely invoke Supabase functions
  const callFunction = async () => {
    const result = await supabaseSecurity.invokeFunction('function-name', {
      param1: 'value1',
      param2: 'value2'
    });
    
    // Process result...
  };
  
  // Securely save notes
  const saveNote = async (id, content) => {
    await supabaseSecurity.secureNoteSave(id, content);
  };
  
  return (
    // Component implementation
  );
};
```

## Modal Security

For secure modal dialogs with the top-positioned styling:

```tsx
import { useModalSecurity } from '@/utils/security/securityMiddleware';
import Modal from 'react-modal';

const ModalComponent = () => {
  const [isOpen, setIsOpen] = useState(false);
  const modalSecurity = useModalSecurity();
  
  const openModal = () => {
    if (modalSecurity.openModal()) {
      setIsOpen(true);
    }
  };
  
  const closeModal = () => {
    modalSecurity.closeModal();
    setIsOpen(false);
  };
  
  return (
    <>
      <button onClick={openModal}>Open Secure Modal</button>
      
      <Modal
        isOpen={isOpen}
        onRequestClose={closeModal}
        style={modalSecurity.getModalStyles()}
        contentLabel="Secure Modal"
      >
        <h2>Secure Modal Content</h2>
        <div>
          {/* Modal content here */}
        </div>
        <button onClick={closeModal}>Close</button>
      </Modal>
    </>
  );
};
```

## Security Benefits

This security system provides:

1. **XSS Protection**: Prevents cross-site scripting attacks
2. **Content Security Policy**: Controls resource loading
3. **CORS Protection**: Manages cross-origin requests
4. **Input Validation**: Sanitizes all user inputs
5. **Gemini AI Protection**: Prevents prompt injection
6. **Rate Limiting**: Prevents API abuse
7. **Modal Security**: Ensures consistent and secure modal display
8. **Route Security**: Ensures all routes are properly configured

## Technical Notes

- The security system is designed to work with both Supabase and Gemini 2.5 AI
- All components adhere to the existing UI design patterns, including modal positioning (top-24, 80vh max-height)
- The system is fully TypeScript-compatible
- Integration with your performance monitoring dashboard is built-in
