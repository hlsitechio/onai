
import React from "react";
import EditorManager from "@/components/editor/EditorManager";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#050510] to-[#0a0518]">
      <EditorManager />
      <CookieConsent />
    </div>
  );
};

export default Index;
