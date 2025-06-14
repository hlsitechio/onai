
import React from "react";
import TransferredTextEditor from "@/components/TransferredTextEditor";
import CookieConsent from "@/components/CookieConsent";

const Index = () => {
  return (
    <div className="min-h-screen">
      <TransferredTextEditor />
      <CookieConsent />
    </div>
  );
};

export default Index;
