import React, { useState } from "react";
import Modal from "react-modal";
import { X, Mail } from "lucide-react";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ open, onOpenChange }) => {
  // Scroll to top when the modal opens
  React.useEffect(() => {
    if (open) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [open]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState("General Info");
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Format the email subject based on the selected inquiry type
    const emailSubject = encodeURIComponent(`[${subject}] Inquiry from ${name}`);
    const emailBody = encodeURIComponent(message);
    
    // Create a mailto link that will open in Gmail
    const mailtoLink = `mailto:info@onlinenote.ai?subject=${emailSubject}&body=${emailBody}`;
    
    // Open the email client
    window.open(mailtoLink, "_blank");
    
    // Close the dialog after sending
    onOpenChange(false);
    
    // Reset the form
    setName("");
    setEmail("");
    setSubject("General Info");
    setMessage("");
  };

  return (
    <Modal
      isOpen={open}
      onRequestClose={() => onOpenChange(false)}
      contentLabel="Contact Form"
      className="fixed left-1/2 top-24 transform -translate-x-1/2 max-w-md w-full bg-black/80 backdrop-blur-xl p-6 rounded-xl border border-indigo-500/20 shadow-2xl outline-none text-white z-50 max-h-[80vh] overflow-y-auto"
      overlayClassName="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
    >
      {/* Header */}
      <div className="flex flex-col space-y-2 text-center border-b border-indigo-500/20 pb-4">
        <h2 className="text-xl font-bold flex items-center gap-2 justify-center">
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
            Contact OneAI Notes
          </span>
        </h2>
        <p className="text-white/80">
          Have a question or feedback? We'd love to hear from you.
        </p>
      </div>
      
      <form onSubmit={handleSubmit} className="grid gap-4 py-4">
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="name" className="text-sm text-white/90">
            Your Name
          </label>
          <input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="John Doe"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="email" className="text-sm text-white/90">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="john@example.com"
            required
          />
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="subject" className="text-sm text-white/90">
            Inquiry Type
          </label>
          <select 
            value={subject} 
            onChange={(e) => setSubject(e.target.value)}
            className="flex h-10 w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="General Info">General Information</option>
            <option value="Support">Technical Support</option>
            <option value="Feedback">Feedback & Suggestions</option>
            <option value="Business">Business Inquiry</option>
            <option value="Other">Other</option>
          </select>
        </div>
        
        <div className="grid grid-cols-1 gap-2">
          <label htmlFor="message" className="text-sm text-white/90">
            Your Message
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="min-h-[120px] flex w-full rounded-md border border-white/10 bg-black/40 px-3 py-2 text-sm text-white placeholder:text-white/50 focus:outline-none focus:ring-1 focus:ring-indigo-500/50 disabled:cursor-not-allowed disabled:opacity-50"
            placeholder="Tell us how we can help..."
            required
          />
        </div>
        
        <div className="mt-4 flex justify-end gap-2">
          <button 
            type="button" 
            onClick={() => onOpenChange(false)}
            className="inline-flex h-10 items-center justify-center rounded-md border border-white/10 bg-transparent px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-white/10 focus:outline-none"
          >
            Cancel
          </button>
          <button 
            type="submit"
            className="inline-flex h-10 items-center justify-center rounded-md bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 px-4 py-2 text-sm font-medium text-white transition-colors focus:outline-none"
          >
            Send Message
          </button>
        </div>
      </form>
      
      {/* Close button */}
      <button
        className="absolute right-4 top-4 rounded-sm opacity-70 transition-opacity hover:opacity-100 focus:outline-none"
        onClick={() => onOpenChange(false)}
      >
        <X className="h-4 w-4 text-white" />
        <span className="sr-only">Close</span>
      </button>
    </Modal>
  );
};

export default ContactForm;
