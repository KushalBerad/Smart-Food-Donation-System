import { useState } from "react";
import Sidebar from "../components/DonorSidebar";
import Navbar from "../components/Navbar";

function DashboardLayout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Navbar */}
      <Navbar
        onMenuClick={() => setIsSidebarOpen(true)}
      />

      <div className="flex pt-16">

        {/* Sidebar */}
        <Sidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />

        {/* Page Content */}
        <main className="flex-1 min-w-0">
          {children}
        </main>

      </div>
    </div>
  );
}

export default DashboardLayout;