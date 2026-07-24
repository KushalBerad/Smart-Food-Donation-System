import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import DonorDashboardHome from "./DonorDashboardHome";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [activeItem, setActiveItem] = useState("dashboard");
    const [sidebarOpen, setSidebarOpen] = useState(true);

    const toggleSidebar = () => setSidebarOpen((prev) => !prev);

    useEffect(() => {
        const token = localStorage.getItem("token");
        const userData = localStorage.getItem("user");

        if (!token || !userData) {
            navigate("/auth/login", { replace: true });
            return;
        }

        try {
            setUser(JSON.parse(userData));
        } catch {
            navigate("/auth/login", { replace: true });
        }
    }, [navigate]);

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/auth/login", { replace: true });
    };

    const handleNavigate = (itemId) => {
        setActiveItem(itemId);
    };

    if (!user) {
        return null;
    }

    return (
        <div className="dashboard-layout">
            <Topbar userName={user.name || "User"} onToggleSidebar={toggleSidebar} />
            <Sidebar
                activeItem={activeItem}
                onNavigate={handleNavigate}
                onLogout={handleLogout}
                isOpen={sidebarOpen}
            />
            <main className={`dashboard-main ${sidebarOpen ? '' : 'sidebar-collapsed'}`}>
                <DonorDashboardHome userName={user.name || "User"} />
            </main>
        </div>
    );
}

export default Dashboard;