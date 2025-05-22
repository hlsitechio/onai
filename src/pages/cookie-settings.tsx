import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { ArrowLeft } from "lucide-react";
import { Button } from "../components/ui/button";
// Plain navigation without router dependencies
import { Switch } from "../components/ui/switch";
import { Label } from "../components/ui/label";

const CookieSettings = () => {
  // Use regular navigation instead of router
  const navigateHome = () => {
    window.location.href = '/';
  };
  const [essentialCookies, setEssentialCookies] = useState(true); // Always enabled
  const [functionalCookies, setFunctionalCookies] = useState(true);
  const [analyticsCookies, setAnalyticsCookies] = useState(true);
  const [marketingCookies, setMarketingCookies] = useState(false);
  
  const handleSaveSettings = () => {
    // In a real implementation, this would save the settings to localStorage or cookies
    localStorage.setItem('cookie-preferences', JSON.stringify({
      essential: essentialCookies,
      functional: functionalCookies,
      analytics: analyticsCookies,
      marketing: marketingCookies
    }));
    
    alert('Cookie settings saved successfully!');
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
            <h1 className="text-3xl font-bold text-white">Cookie Settings</h1>
          </div>
          
          <div className="prose prose-invert max-w-none">
            <p className="text-gray-300 mb-6">
              We use cookies to enhance your experience on our website. This page allows you to customize which cookies you accept. Please review our cookie policy below and adjust your preferences.
            </p>
            
            <div className="bg-black/30 rounded-lg border border-indigo-500/20 p-6 mb-8">
              <h2 className="text-2xl font-semibold text-white mb-6">Manage Cookie Preferences</h2>
              
              <div className="space-y-6">
                {/* Essential Cookies */}
                <div className="flex items-center justify-between p-4 rounded-md bg-indigo-900/20 border border-indigo-500/30">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Essential Cookies</h3>
                    <p className="text-gray-400 text-sm">
                      These cookies are necessary for the website to function and cannot be disabled.
                    </p>
                  </div>
                  <Switch 
                    checked={essentialCookies} 
                    disabled={true} // Cannot disable essential cookies
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
                
                {/* Functional Cookies */}
                <div className="flex items-center justify-between p-4 rounded-md bg-black/40 border border-gray-700">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Functional Cookies</h3>
                    <p className="text-gray-400 text-sm">
                      These cookies enable personalized features and functionality.
                    </p>
                  </div>
                  <Switch 
                    checked={functionalCookies} 
                    onCheckedChange={setFunctionalCookies}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
                
                {/* Analytics Cookies */}
                <div className="flex items-center justify-between p-4 rounded-md bg-black/40 border border-gray-700">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Analytics Cookies</h3>
                    <p className="text-gray-400 text-sm">
                      These cookies help us understand how visitors interact with our website.
                    </p>
                  </div>
                  <Switch 
                    checked={analyticsCookies} 
                    onCheckedChange={setAnalyticsCookies}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
                
                {/* Marketing Cookies */}
                <div className="flex items-center justify-between p-4 rounded-md bg-black/40 border border-gray-700">
                  <div>
                    <h3 className="text-lg font-medium text-white mb-1">Marketing Cookies</h3>
                    <p className="text-gray-400 text-sm">
                      These cookies are used to track effectiveness of advertising and to show you relevant ads.
                    </p>
                  </div>
                  <Switch 
                    checked={marketingCookies} 
                    onCheckedChange={setMarketingCookies}
                    className="data-[state=checked]:bg-indigo-500"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-end">
                <Button 
                  onClick={handleSaveSettings}
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white"
                >
                  Save Preferences
                </Button>
              </div>
            </div>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">About Cookies</h2>
            <p className="text-gray-300 mb-4">
              Cookies are small text files that are placed on your device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">How We Use Cookies</h2>
            <p className="text-gray-300 mb-4">
              OneAI Notes uses cookies for the following purposes:
            </p>
            <ul className="list-disc pl-6 text-gray-300 mb-4">
              <li className="mb-2"><strong>Essential:</strong> To enable core functionality such as security, network management, and accessibility.</li>
              <li className="mb-2"><strong>Functional:</strong> To enhance functionality and personalize your experience.</li>
              <li className="mb-2"><strong>Analytics:</strong> To collect anonymous information about how visitors use our website.</li>
              <li className="mb-2"><strong>Marketing:</strong> To provide you with relevant content and offers.</li>
            </ul>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Third-Party Cookies</h2>
            <p className="text-gray-300 mb-4">
              In addition to our own cookies, we may also use various third-party cookies to report usage statistics and deliver advertisements.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Managing Cookies</h2>
            <p className="text-gray-300 mb-4">
              Most web browsers allow some control of cookies through browser settings. To find out more about cookies, including how to see what cookies have been set and how to manage and delete them, visit <a href="https://www.allaboutcookies.org" className="text-indigo-400 hover:text-indigo-300" target="_blank" rel="noopener noreferrer">www.allaboutcookies.org</a>.
            </p>
            
            <h2 className="text-2xl font-semibold text-white mt-8 mb-4">Contact Us</h2>
            <p className="text-gray-300 mb-4">
              If you have any questions about our cookie policy, please contact us at:
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

export default CookieSettings;
