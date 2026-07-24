import { Bell, ChevronDown, Menu, User } from "lucide-react";

export default function Topbar({ userName = "User", onToggleSidebar }) {
    return (
        <header className="dashboard-topbar">
            <div className="topbar-left">
                <button className="topbar-hamburger" aria-label="Menu" onClick={onToggleSidebar}>
                    <Menu size={22} />
                </button>

                <div className="topbar-brand">
                    <div className="topbar-logo-icon">
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#ffffff"
                            strokeWidth="2"
                        >
                            <path d="M12 2c-1.5 3-2 5-2 7a2 2 0 104 0c0-2-.5-4-2-7z" />
                            <path d="M6 13c0 4 2.5 8 6 8s6-4 6-8" />
                        </svg>
                    </div>
                    <div className="topbar-brand-text">
                        <h1>FoodRescue</h1>
                        <p>Share Food, Help People</p>
                    </div>
                </div>
            </div>

            <div className="topbar-right">
                <button className="topbar-bell" aria-label="Notifications">
                    <Bell size={20} />
                </button>

                <div className="topbar-user">
                    <div className="topbar-avatar">
                        <User size={16} />
                    </div>
                    <span className="topbar-username">{userName}</span>
                    <ChevronDown size={14} color="#6b7a72" />
                </div>
            </div>
        </header>
    );
}
