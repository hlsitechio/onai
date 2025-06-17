
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ContactFormFields from './ContactFormFields';
import EmailTemplateTest from '../EmailTemplateTest';
import { ContactTabsProps } from './types';

const ContactTabs: React.FC<ContactTabsProps> = ({ onFormSuccess }) => {
  return (
    <Tabs defaultValue="contact" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="contact">Contact Form</TabsTrigger>
        <TabsTrigger value="templates">Email Templates</TabsTrigger>
      </TabsList>
      
      <TabsContent value="contact" className="space-y-4">
        <ContactFormFields onSuccess={onFormSuccess} />
      </TabsContent>
      
      <TabsContent value="templates" className="max-h-[60vh] overflow-y-auto">
        <EmailTemplateTest />
      </TabsContent>
    </Tabs>
  );
};

export default ContactTabs;
