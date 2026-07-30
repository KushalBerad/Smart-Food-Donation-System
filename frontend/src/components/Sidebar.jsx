import {
  Heart,
  History,
  LayoutDashboard,
  LogOut,
  Package,
  PlusCircle,
  Settings,
  User,
  Users,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Create Donation", icon: PlusCircle, path: "/create-donation" },
  { label: "My Donations", icon: Package, path: "/my-donations" },
  { label: "Requests", icon: Users, path: "/requests" },
  { label: "History", icon: History, path: "/history" },
  { label: "Profile", icon: User, path: "/profile" },
  { label: "Help & Support", icon: Heart, path: "/help-support" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

export default function Sidebar({
  activeItem = "Dashboard",
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

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
              const active = label === activeItem;

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

        {/* Bottom Logout */}
        <div className="p-3 border-t border-gray-100">
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
      </aside>
    </>
  );
}