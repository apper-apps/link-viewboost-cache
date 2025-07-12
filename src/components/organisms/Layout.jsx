import React, { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/organisms/Sidebar";
import Header from "@/components/organisms/Header";

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuClick = () => {
    setSidebarOpen(true);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="flex h-screen overflow-hidden">
        {/* Sidebar */}
        <Sidebar 
          isOpen={sidebarOpen} 
          onClose={handleSidebarClose} 
        />

        {/* Main content */}
        <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
          <Header onMenuClick={handleMenuClick} />
          
          <main className="flex-1 overflow-y-auto">
            <div className="p-6 lg:p-8">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default Layout;