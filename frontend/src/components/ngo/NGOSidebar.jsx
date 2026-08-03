import {
  BarChart3,
  Building2,
  ClipboardList,
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Search,
  Settings,
  User,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/ngo/dashboard" },

  { label: "Browse Donations", icon: Search, path: "/ngo/browse" },

  { label: "My Requests", icon: ClipboardList, path: "/ngo/requests" },

  { label: "History", icon: History, path: "/ngo/history" },

  { label: "Profile", icon: User, path: "/ngo/profile" },

  { label: "Reports & Impact", icon: BarChart3, path: "/ngo/reports" },

  { label: "Help & Support", icon: Heart, path: "/ngo/help-support" },

  { label: "Settings", icon: Settings, path: "/ngo/settings" },
];

export default function NGOSidebar({ isOpen, onClose }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/", {
      replace: true,
    });
    onClose?.();
  };

  // Get user info from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const ngoName = user.organizationName || user.name || "NGO";
  const ngoId = user.registrationNumber || user._id?.slice(-6)?.toUpperCase() || "";

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white shadow-lg
        flex flex-col justify-between z-40 transform transition-transform duration-200
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      >
        {/* Top Menu */}
        <div>
          <nav className="px-3 mt-2 space-y-1">
            {menuItems.map(({ label, icon: Icon, path }) => {
              const active = location.pathname === path;

              return (
                <button
                  key={label}
                  onClick={() => handleNavigation(path)}
                  className={`relative w-full flex items-center gap-3 pl-4 pr-3 py-2.5 rounded-xl text-sm font-medium
                    ${active
                      ? "bg-[#16A34A]/10 text-[#16A34A]"
                      : "text-gray-500 hover:bg-gray-50 hover:text-gray-800"
                    }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: NGO Info + Logout */}
        <div className="border-t border-gray-100">
          {/* NGO Identity */}
          <div className="px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#16A34A]/10 flex items-center justify-center shrink-0">
              <Building2 size={18} className="text-[#16A34A]" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">
                {ngoName}
              </p>
              {ngoId && (
                <p className="text-xs text-gray-400 truncate">
                  NGO ID: {ngoId}
                </p>
              )}
            </div>
          </div>

          {/* Logout */}
          <div className="px-3 pb-3">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl
              text-sm font-medium text-gray-500
              hover:bg-red-50 hover:text-red-500 transition-colors"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
