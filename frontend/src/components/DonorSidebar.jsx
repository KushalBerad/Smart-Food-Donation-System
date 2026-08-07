import {
  BarChart,
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

import {
  useLocation,
  useNavigate,
} from "react-router-dom";

const menuItems = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    path: "/dashboard",
  },
  {
    label: "Create Donation",
    icon: PlusCircle,
    path: "/create-donation",
  },
  {
    label: "My Donations",
    icon: Package,
    path: "/my-donations",
  },
  {
    label: "Requests",
    icon: Users,
    path: "/requests",
  },
  {
    label: "History",
    icon: History,
    path: "/history",
  },
  {
    label: "Profile",
    icon: User,
    path: "/profile",
  },
  {
    label: "Reports & Impact",
    icon: BarChart,
    path: "/reports",
  },
  {
    label: "Help & Support",
    icon: Heart,
    path: "/help-support",
  },
  {
    label: "Settings",
    icon: Settings,
    path: "/settings",
  },
];

export default function Sidebar({
  isOpen,
  onClose,
}) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    navigate(path);
    onClose?.();
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    onClose?.();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed md:sticky top-16 left-0 z-40 w-64 h-[calc(100vh-4rem)]
        bg-white border-r border-gray-200 shadow-sm
        flex flex-col
        transform transition-transform duration-300
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
        md:translate-x-0`}
      >
        <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          {menuItems.map(
            ({
              label,
              icon: Icon,
              path,
            }) => {
              const active =
                location.pathname === path;

              return (
                <button
                  key={path}
                  onClick={() =>
                    handleNavigation(path)
                  }
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl
                  text-sm font-medium transition-all duration-200
                  ${
                    active
                      ? "bg-[#16A34A]/10 text-[#16A34A]"
                      : "text-gray-600 hover:bg-gray-50 hover:text-[#16A34A]"
                  }`}
                >
                  <Icon
                    size={18}
                    className="shrink-0"
                  />

                  <span className="truncate">
                    {label}
                  </span>
                </button>
              );
            }
          )}
        </nav>

        <div className="border-t border-gray-100 p-3">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl
            text-sm font-medium text-gray-600
            hover:bg-red-50 hover:text-red-600
            transition-colors"
          >
            <LogOut
              size={18}
              className="shrink-0"
            />

            Logout
          </button>
        </div>
      </aside>
    </>
  );
}