
import Header from "@/components/Header";
import Hero from "@/components/Hero";
import TextEditor from "@/components/TextEditor";
import Features from "@/components/Features";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-black bg-gradient-to-br from-black via-gray-900 to-black">
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,rgba(30,30,50,0.3)_0%,rgba(0,0,0,0)_70%)] pointer-events-none"></div>
      <Header />
      <Hero />
      <TextEditor />
      <Features />
      <Footer />
    </div>
  );
};

export default Index;
