import {
    ClipboardList,
    Clock,
    HandHeart,
    LayoutDashboard,
    LogOut,
    PlusCircle,
    User,
} from "lucide-react";

const NAV_ITEMS = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    { id: "create", label: "Create Donation", icon: PlusCircle },
    { id: "donations", label: "My Donations", icon: ClipboardList },
    { id: "requests", label: "Requests", icon: HandHeart },
    { id: "history", label: "History", icon: Clock },
    { id: "profile", label: "Profile", icon: User },
];

export default function Sidebar({ activeItem = "dashboard", onNavigate, onLogout, isOpen = true }) {
    return (
        <aside className={`dashboard-sidebar ${isOpen ? '' : 'collapsed'}`}>
            <nav className="sidebar-nav">
                {NAV_ITEMS.map((item) => {
                    const Icon = item.icon;
                    return (
                        <button
                            key={item.id}
                            className={`sidebar-item ${activeItem === item.id ? "active" : ""}`}
                            onClick={() => onNavigate?.(item.id)}
                        >
                            <span className="sidebar-item-icon">
                                <Icon size={20} />
                            </span>
                            {item.label}
                        </button>
                    );
                })}

                <div className="sidebar-divider" />

                <button
                    className="sidebar-item sidebar-logout"
                    onClick={onLogout}
                >
                    <span className="sidebar-item-icon">
                        <LogOut size={20} />
                    </span>
                    Logout
                </button>
            </nav>
        </aside>
    );
}
