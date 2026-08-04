import {
  Bell,
  ChevronDown,
  LogOut,
  Menu,
  Settings,
  User,
} from "lucide-react";
import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

import foodDonationIcon from "../assets/food_donation_icon.png";
import { getNotifications } from "../services/notificationService";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const profileRef = useRef(null);

  const user = useMemo(() => {
    try {
      const stored = JSON.parse(
        localStorage.getItem("user") || "{}"
      );

      return {
        ...stored,
        name:
          stored.organizationName ||
          stored.name ||
          "User",
        email: stored.email || "",
        role: stored.role || "",
      };
    } catch {
      return {
        name: "User",
        email: "",
        role: "",
      };
    }
  }, []);

  const isNGO = user.role === "ngo";

  const profilePath = isNGO
    ? "/ngo/profile"
    : "/profile";

  const settingsPath = isNGO
    ? "/ngo/settings"
    : "/settings";

  const dashboardPath = isNGO
    ? "/ngo/dashboard"
    : "/dashboard";

  const notificationPath = isNGO
    ? "/ngo/notifications"
    : "/notifications";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        profileRef.current &&
        !profileRef.current.contains(event.target)
      ) {
        setIsProfileOpen(false);
      }
    };

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setIsProfileOpen(false);
      }
    };

    document.addEventListener(
      "mousedown",
      handleClickOutside
    );

    document.addEventListener(
      "keydown",
      handleEscape
    );

    return () => {
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );

      document.removeEventListener(
        "keydown",
        handleEscape
      );
    };
  }, []);

  useEffect(() => {
    const fetchUnreadCount = async () => {
      try {
        const response = await getNotifications();

        const unread =
          (response.data || []).filter(
            (notification) => !notification.isRead
          ).length;

        setUnreadCount(unread);
      } catch (error) {
        console.error(
          "Failed to fetch notifications:",
          error
        );
      }
    };

    fetchUnreadCount();
  }, []);

  const closeProfileMenu = () => {
    setIsProfileOpen(false);
  };

  const handleLogoClick = () => {
    if (window.location.pathname !== dashboardPath) {
      navigate(dashboardPath);
    }
  };

  const handleNotificationClick = () => {
    closeProfileMenu();

    if (window.location.pathname !== notificationPath) {
      navigate(notificationPath);
    }
  };

  const handleProfileNavigation = (path) => {
    closeProfileMenu();

    if (window.location.pathname !== path) {
      navigate(path);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setUnreadCount(0);
    closeProfileMenu();

    navigate("/", {
      replace: true,
    });
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-16 bg-white border-b border-gray-200 shadow-sm">
      <div className="h-full flex items-center justify-between px-4 sm:px-6">

        {/* Left Section */}
        <div className="flex items-center gap-3">

          <button
            onClick={onMenuClick}
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition"
            aria-label="Open Menu"
          >
            <Menu size={22} />
          </button>

          <button
            onClick={handleLogoClick}
            className="flex items-center gap-3 group"
          >
            <img
              src={foodDonationIcon}
              alt="FoodRescue"
              className="w-12 h-12 object-contain"
            />

            <div className="hidden sm:block text-left">
              <h1 className="text-base font-semibold text-gray-900 group-hover:text-[#16A34A] transition-colors">
                FoodRescue
              </h1>

              <p className="text-xs text-gray-500">
                Share Food, Help People
              </p>
            </div>
          </button>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-4">

          {/* Notifications */}
          <button
            type="button"
            onClick={handleNotificationClick}
            className="relative flex items-center justify-center w-10 h-10 rounded-full hover:bg-gray-100 transition"
            aria-label="Notifications"
          >
            <Bell
              size={20}
              className="text-gray-700"
            />

            {unreadCount > 0 && (
              <span
                className="absolute top-1 right-1
      min-w-[18px] h-[18px]
      px-1 rounded-full
      bg-red-500 text-white
      text-[10px] font-semibold
      flex items-center justify-center"
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}
          </button>

          {/* Profile */}
          <div
            ref={profileRef}
            className="relative"
          >
            <button
              type="button"
              onClick={() =>
                setIsProfileOpen((prev) => !prev)
              }
              className="flex items-center gap-2 rounded-xl px-2 py-1.5 hover:bg-gray-100 transition"
            >
              <div
                className="w-9 h-9 rounded-full
              bg-[#16A34A]/10
              flex items-center justify-center"
              >
                <User
                  size={18}
                  className="text-[#16A34A]"
                />
              </div>

              <div className="hidden sm:flex flex-col items-start max-w-[150px]">
                <span className="text-sm font-medium text-gray-800 truncate w-full">
                  {user.name}
                </span>

                <span className="text-xs text-gray-500 truncate w-full">
                  {user.email}
                </span>
              </div>

              <ChevronDown
                size={16}
                className={`text-gray-500 transition-transform duration-200 ${isProfileOpen
                  ? "rotate-180"
                  : ""
                  }`}
              />
            </button>

            {isProfileOpen && (
              <div
                className="absolute right-0 mt-2 w-56
              bg-white rounded-xl border border-gray-200
              shadow-xl overflow-hidden"
              >
                <div className="px-4 py-3 border-b border-gray-100">
                  <p className="font-semibold text-gray-900 truncate">
                    {user.name}
                  </p>

                  <p className="text-xs text-gray-500 truncate mt-1">
                    {user.email}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    handleProfileNavigation(
                      profilePath
                    )
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
                >
                  <User size={17} />
                  Profile
                </button>

                <button
                  type="button"
                  onClick={() =>
                    handleProfileNavigation(
                      settingsPath
                    )
                  }
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-50 transition"
                >
                  <Settings size={17} />
                  Settings
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 border-t border-gray-100 hover:bg-red-50 transition"
                >
                  <LogOut size={17} />
                  Logout
                </button>
              </div>
            )}
          </div>

        </div>
      </div>
    </nav>
  );
}