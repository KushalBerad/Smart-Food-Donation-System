import { useState } from "react";
import { useNavigate } from "react-router-dom";
import foodDonationIcon from "../assets/food_donation_icon.png";
import {
  Menu,
  Bell,
  ChevronDown,
  User,
  Settings,
  LogOut,
} from "lucide-react";

export default function Navbar({ onMenuClick }) {
  const navigate = useNavigate();

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  // Get user from localStorage
  const user = (() => {
    try {
      const stored = JSON.parse(localStorage.getItem("user") || "{}");
      return {
        name: stored.organizationName || stored.name || "User",
        email: stored.email || "",
      };
    } catch {
      return { name: "User", email: "" };
    }
  })();

  // Go to Home
  const handleLogoClick = () => {
    navigate("/");
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
    setIsProfileOpen(false);
  };

  return (
    <nav className="fixed w-full h-16 flex items-center justify-between px-4 sm:px-6 bg-white border-b border-gray-200">

      {/* ================= LEFT SECTION ================= */}
      <div className="flex items-center gap-3 sm:gap-4">

        {/* Menu Button
            Only visible on mobile/tablet */}
        <button
          onClick={onMenuClick}
          className="md:hidden text-gray-700 hover:text-gray-900 transition"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Logo + Website Name */}
        <button
          onClick={handleLogoClick}
          className="flex items-center gap-0 text-left"
        >
          {/* Logo */}
          <div className="w-22 h-10 flex items-center justify-center shrink-0 ">
           <img
             src={foodDonationIcon}
             alt="Food Donation Logo"
             className="w-22 h-22 object-contain"
            />
          </div>

          {/* Website Name */}
          <div className="leading-tight mr-2">
    <h1 className="text-sm sm:text-base font-semibold text-gray-900">
      FoodRescue
    </h1>

    <p className="hidden sm:block text-xs text-gray-500">
      Share Food, Help People
    </p>
  </div>
        </button>
      </div>

      {/* ================= RIGHT SECTION ================= */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* Notification */}
        <div className="relative">

          <button
            onClick={() => {
              setIsNotificationOpen(!isNotificationOpen);
              setIsProfileOpen(false);
            }}
            className="relative text-gray-700 hover:text-gray-900 transition"
            aria-label="Notifications"
          >
            <Bell size={20} />

            {/* Demo Notification Count */}
            <span className="absolute -top-2 -right-2 w-4 h-4 bg-red-500 text-white text-[10px] rounded-full flex items-center justify-center">
              3
            </span>
          </button>

          {/* Notification Dropdown */}
          {isNotificationOpen && (
            <div className="absolute right-0 top-10 w-72 max-w-[90vw] bg-white border border-gray-200 rounded-lg shadow-lg z-50">

              <div className="px-4 py-3 border-b border-gray-200">
                <h3 className="font-semibold text-gray-900">
                  Notifications
                </h3>
              </div>

              <div className="p-4 space-y-3">

                <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                  New donation request received.
                </button>

                <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                  Your donation has been accepted.
                </button>

                <button className="w-full text-left text-sm text-gray-700 hover:bg-gray-50 p-2 rounded">
                  Pickup scheduled for today.
                </button>

              </div>

              <button
                onClick={() => setIsNotificationOpen(false)}
                className="w-full py-2 text-sm text-green-600 border-t border-gray-200 hover:bg-gray-50"
              >
                Close
              </button>
            </div>
          )}
        </div>

        {/* ================= PROFILE ================= */}
        <div className="relative">

          <button
            onClick={() => {
              setIsProfileOpen(!isProfileOpen);
              setIsNotificationOpen(false);
            }}
            className="flex items-center gap-2 cursor-pointer"
          >

            {/* Avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
              <User size={17} className="text-gray-500" />
            </div>

            {/* User Name
                Hidden on small mobile screens */}
            <span className="hidden sm:block text-sm text-gray-800 font-medium">
              {user.name}
            </span>

            <ChevronDown
              size={16}
              className={`text-gray-500 transition-transform ${
                isProfileOpen ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {isProfileOpen && (
            <div className="absolute right-0 top-11 w-52 bg-white border border-gray-200 rounded-lg shadow-lg z-50">

              {/* User Info */}
              <div className="px-4 py-3 border-b border-gray-200">
                <p className="text-sm font-semibold text-gray-900">
                  {user.name}
                </p>

                <p className="text-xs text-gray-500 truncate">
                  {user.email}
                </p>
              </div>

              {/* Profile */}
              <button
                onClick={() => {
                  alert("Demo: Profile clicked!");
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <User size={17} />
                Profile
              </button>

              {/* Settings */}
              <button
                onClick={() => {
                  alert("Demo: Settings clicked!");
                  setIsProfileOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50"
              >
                <Settings size={17} />
                Settings
              </button>

              {/* Logout */}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 border-t border-gray-200"
              >
                <LogOut size={17} />
                Logout
              </button>

            </div>
          )}
        </div>

      </div>
    </nav>
  );
}