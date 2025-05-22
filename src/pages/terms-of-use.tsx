import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
// Plain navigation without router dependencies

const TermsOfUse = () => {
  // Use regular navigation instead of router
  const navigateHome = () => {
    window.location.href = '/';
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-black">
      {/* Background gradients */}
      <div className="fixed inset-0 bg-gradient-to-br from-[#070B34] via-[#141E4A] to-[#07051A] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(120,90,220,0.15)_0%,rgba(0,0,0,0)_60%)] pointer-events-none"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(60,20,180,0.1)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      
      {/* Header */}
      <Header />
      
      {/* Main content */}
      <main className="flex-grow container mx-auto px-4 py-16 relative z-10 mt-16">
        <div className="max-w-4xl mx-auto bg-black/40 backdrop-blur-lg rounded-lg border border-indigo-500/20 p-8 shadow-xl">
          <div className="mb-8 flex items-center">
            <Button 
              variant="ghost" 
              size="sm" 
              className="mr-4 text-gray-400 hover:text-white"
              onClick={navigateHome}
            >
              <ArrowLeft size={16} className="mr-2" />
              Back to Home
            </Button>
            <h1 className="text-3xl font-bold text-white">Terms of Use</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: May 22, 2025</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Agreement to Terms</h2>
            <p className="text-gray-300 mb-4">
              By accessing or using OneAI Notes, you agree to be bound by these Terms of Use. If you do not agree to these terms, please do not use our service.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Description of Service</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes is a note-taking application that provides features for creating, editing, and organizing notes with AI assistance. Our service is provided at no cost, with all features freely available to all users.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. User Accounts</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes does not require account creation to use the service. Your notes are stored locally and synchronized across your devices without requiring registration.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. User Responsibilities</h2>
            <p className="text-gray-300 mb-4">
              As a user of OneAI Notes, you agree to:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">Use the service only for lawful purposes</li>
              <li className="mb-2">Not attempt to circumvent any security features</li>
              <li className="mb-2">Not use the service to store or transmit harmful code</li>
              <li className="mb-2">Not interfere with the proper functioning of the service</li>
              <li className="mb-2">Not abuse, harass, or threaten others using our service</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Intellectual Property Rights</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes and its original content, features, and functionality are owned by Online Note AI and are protected by international copyright, trademark, and other intellectual property laws.
            </p>
            <p className="text-gray-300 mb-4">
              The content you create using OneAI Notes remains your property. We claim no ownership rights over your notes or other content.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. AI-Generated Content</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes provides AI assistance features that can generate content based on your input. You are responsible for reviewing and editing AI-generated content. We do not guarantee the accuracy, quality, or appropriateness of AI-generated content.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Data Sharing and Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our use of your data is governed by our Privacy Policy. When using the sharing feature of OneAI Notes, you are responsible for ensuring you have the right to share any content you distribute through our service.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Termination</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to terminate or suspend access to our service immediately, without prior notice, for conduct that we believe violates these Terms of Use or is harmful to other users, us, or third parties, or for any other reason.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Limitation of Liability</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the service.
            </p>
            <p className="text-gray-300 mb-4">
              We do not guarantee that the service will be uninterrupted, timely, secure, or error-free. You use the service at your own risk.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Disclaimer of Warranties</h2>
            <p className="text-gray-300 mb-4">
              The service is provided "as is" and "as available" without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Changes to Terms</h2>
            <p className="text-gray-300 mb-4">
              We reserve the right to modify these terms at any time. We will provide notice of significant changes by updating the "Last Updated" date at the top of this page. Your continued use of the service after such modifications constitutes your acceptance of the new terms.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">12. Governing Law</h2>
            <p className="text-gray-300 mb-4">
              These Terms shall be governed by and construed in accordance with the laws of the jurisdiction in which Online Note AI operates, without regard to its conflict of law provisions.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">13. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about these Terms, please contact us at:
            </p>
            <p className="text-gray-300 mb-4">
              <strong>Email:</strong> info@onlinenote.ai
            </p>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  );
};

export default TermsOfUse;
