
const Footer = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="py-8 bg-slate-100">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <p className="text-slate-600 text-sm">
              © {currentYear} NoteFlow. All rights reserved.
            </p>
          </div>
          
          <div className="flex space-x-6">
            <a href="#" className="text-slate-600 hover:text-noteflow-600 text-sm">Privacy Policy</a>
            <a href="#" className="text-slate-600 hover:text-noteflow-600 text-sm">Terms of Service</a>
            <a href="#" className="text-slate-600 hover:text-noteflow-600 text-sm">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
