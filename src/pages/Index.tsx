
import React from "react";
import TransferredTextEditor from "@/components/TransferredTextEditor";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen w-full overflow-hidden bg-gradient-to-br from-[#050510] to-[#0a0518]">
      <TransferredTextEditor />
      <CookieConsent />
    </div>
  );
};

export default Index;
