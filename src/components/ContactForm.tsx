
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Mail } from 'lucide-react';
import ContactTabs from './contact/ContactTabs';

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ open, onOpenChange }) => {
  const handleFormSuccess = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Mail className="w-5 h-5 mr-2" />
            Contact & Email Templates
          </DialogTitle>
        </DialogHeader>
        
        <ContactTabs onFormSuccess={handleFormSuccess} />
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
