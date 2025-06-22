
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <div className="flex-1 ml-0 md:ml-[280px]">
        <Header />
        <div className="p-6 pt-24">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
