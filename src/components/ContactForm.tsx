import React, { useState } from "react";
import { X } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface ContactFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContactForm: React.FC<ContactFormProps> = ({ open, onOpenChange }) => {
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 backdrop-blur-xl border border-indigo-500/20 shadow-xl text-white">
        <DialogHeader className="border-b border-indigo-500/20 pb-4">
          <DialogTitle className="text-xl text-white flex items-center">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-500">
              Contact OneAI Notes
            </span>
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            Send us a message and we'll get back to you as soon as possible.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-gray-300">Your Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-black/50 border-indigo-500/30 text-white"
                placeholder="John Doe"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm text-gray-300">Your Email</Label>
              <Input 
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="bg-black/50 border-indigo-500/30 text-white"
                placeholder="john@example.com"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="text-sm text-gray-300">Inquiry Type</Label>
            <Select value={subject} onValueChange={setSubject}>
              <SelectTrigger className="bg-black/50 border-indigo-500/30 text-white">
                <SelectValue placeholder="Select an inquiry type" />
              </SelectTrigger>
              <SelectContent className="bg-black/90 border-indigo-500/30 text-white">
                <SelectItem value="General Info">General Info</SelectItem>
                <SelectItem value="Technical Support">Technical Support</SelectItem>
                <SelectItem value="Inquiry">Business Inquiry</SelectItem>
                <SelectItem value="Security">Security</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="message" className="text-sm text-gray-300">Message</Label>
            <Textarea 
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
              className="min-h-[120px] bg-black/50 border-indigo-500/30 text-white"
              placeholder="How can we help you?"
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
              className="border-indigo-500/30 text-gray-300 hover:bg-indigo-950/30"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white border-0"
            >
              Send Message
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ContactForm;
