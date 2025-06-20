import React from 'react';
import { ExternalLink, FileText, Shield, Coffee, Mail, Settings, Home } from 'lucide-react';

const StandardSitemap = () => {
  const sitemapData = [
    {
      title: "Main Pages",
      icon: Home,
      links: [
        { name: "Home", url: "/", description: "Main landing page with AI-powered note editor" },
        { name: "Features", url: "/#features", description: "Explore our AI-powered note-taking features" },
        { name: "Technologies", url: "/#sponsors", description: "See the technologies that power our platform" },
        { name: "Contact Us", url: "/contactus", description: "Get in touch with our support team" }
      ]
    },
    {
      title: "Legal & Compliance",
      icon: Shield,
      links: [
        { name: "Privacy Policy", url: "/privacy-policy", description: "How we handle and protect your data" },
        { name: "Terms of Use", url: "/terms-of-use", description: "Terms and conditions for using our service" },
        { name: "Cookie Settings", url: "/cookie-settings", description: "Manage your cookie preferences" }
      ]
    },
    {
      title: "Support & Community",
      icon: Coffee,
      links: [
        { name: "Buy Me a Coffee", url: "https://www.buymeacoffee.com/onlinenoteai", description: "Support our free service - every coffee helps!", external: true },
        { name: "Contact Support", url: "/contactus", description: "Get help from our support team" },
        { name: "Email Support", url: "mailto:info@onlinenote.ai", description: "Direct email support", external: true }
      ]
    }
  ];

  return (
    <section className="py-16 px-4 bg-gradient-to-b from-black to-gray-900">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Site Map
          </h2>
          <p className="text-lg text-gray-300 max-w-2xl mx-auto">
            Navigate through all available pages and resources on Online Note AI
          </p>
        </div>

        {/* Sitemap Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {sitemapData.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-gray-800/50 rounded-lg p-6 border border-gray-700 hover:border-purple-500/50 transition-all duration-300">
              <div className="flex items-center gap-3 mb-6">
                <section.icon className="h-6 w-6 text-purple-400" />
                <h3 className="text-xl font-semibold text-white">{section.title}</h3>
              </div>
              
              <ul className="space-y-3">
                {section.links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <a 
                      href={link.url}
                      target={link.external ? "_blank" : undefined}
                      rel={link.external ? "noopener noreferrer" : undefined}
                      className="group block p-3 rounded-lg hover:bg-gray-700/50 transition-colors"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-white font-medium group-hover:text-purple-300 transition-colors">
                          {link.name}
                        </span>
                        {link.external && (
                          <ExternalLink className="h-3 w-3 text-gray-400 group-hover:text-purple-300" />
                        )}
                      </div>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {link.description}
                      </p>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Call to Action Section */}
        <div className="bg-gradient-to-r from-purple-900/30 to-blue-900/30 rounded-xl p-8 text-center border border-purple-500/20">
          <h3 className="text-2xl font-bold text-white mb-4">
            Support Online Note AI
          </h3>
          <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
            Help us keep Online Note AI free forever! Your support allows us to maintain the service and add new features.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="https://www.buymeacoffee.com/onlinenoteai" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105 shadow-lg"
            >
              <Coffee className="h-5 w-5" />
              Buy Me a Coffee
            </a>
            <a 
              href="/contactus"
              className="inline-flex items-center gap-2 border border-purple-400 text-purple-400 hover:bg-purple-400 hover:text-white px-8 py-3 rounded-lg font-medium transition-all hover:scale-105"
            >
              <Mail className="h-5 w-5" />
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StandardSitemap;
