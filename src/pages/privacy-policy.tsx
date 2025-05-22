import React from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
// Plain navigation without router dependencies

const PrivacyPolicy = () => {
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
            <h1 className="text-3xl font-bold text-white">Privacy Policy</h1>
          </div>

          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300">Last Updated: May 22, 2025</p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">1. Introduction</h2>
            <p className="text-gray-300 mb-4">
              At OneAI Notes, we value your privacy and are committed to protecting your personal information. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our note-taking application.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">2. Information We Collect</h2>
            <p className="text-gray-300 mb-4">We collect the following information when you use our service:</p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">Content of your notes (stored locally and synchronized with your devices)</li>
              <li className="mb-2">Anonymous usage statistics to improve our service</li>
              <li className="mb-2">Technical information such as browser type, device information, and IP address</li>
              <li className="mb-2">Optional information you provide when contacting us</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">3. How We Use Your Data</h2>
            <p className="text-gray-300 mb-4">
              We use your data for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">To provide and maintain our note-taking service</li>
              <li className="mb-2">To improve and personalize your experience</li>
              <li className="mb-2">To respond to your inquiries and support requests</li>
              <li className="mb-2">To detect and prevent technical issues and abuse</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">4. AI Features and Your Data</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes provides AI-powered features to enhance your note-taking experience. When you use these features:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">Content you submit for AI processing is transmitted securely</li>
              <li className="mb-2">We do not store or use your content to train our AI models</li>
              <li className="mb-2">AI processing is performed using established models with privacy safeguards</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">5. Data Security</h2>
            <p className="text-gray-300 mb-4">
              We implement appropriate security measures to protect your data. Your notes are encrypted during transmission and storage. We regularly review our security practices to ensure the highest level of protection.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">6. Data Sharing</h2>
            <p className="text-gray-300 mb-4">
              We do not sell your data. We may share your information with:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">Service providers who help us deliver our services</li>
              <li className="mb-2">Legal authorities when required by law</li>
              <li className="mb-2">Parties involved in a merger, acquisition, or asset sale (with appropriate safeguards)</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">7. Your Rights</h2>
            <p className="text-gray-300 mb-4">
              Depending on your location, you may have the following rights regarding your data:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2">Access to your personal data</li>
              <li className="mb-2">Correction of inaccurate data</li>
              <li className="mb-2">Deletion of your data</li>
              <li className="mb-2">Restriction or objection to processing</li>
              <li className="mb-2">Data portability</li>
            </ul>
            <p className="text-gray-300 mb-4">
              To exercise these rights, please contact us at info@onlinenote.ai.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">8. Cookies</h2>
            <p className="text-gray-300 mb-4">
              We use cookies and similar technologies to enhance your experience. For more information, please see our Cookie Settings page.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">9. Children's Privacy</h2>
            <p className="text-gray-300 mb-4">
              Our service is not intended for children under 13. We do not knowingly collect data from children under 13. If you believe we have collected data from a child under 13, please contact us.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">10. Changes to This Policy</h2>
            <p className="text-gray-300 mb-4">
              We may update this privacy policy from time to time. We will notify you of significant changes by posting the new policy on this page and updating the "Last Updated" date.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">11. Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have questions about this privacy policy, please contact us at:
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

export default PrivacyPolicy;
