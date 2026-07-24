import {
    ArrowRight,
    Calendar,
    CheckCircle,
    ChevronRight,
    ClipboardList,
    Package,
    Plus,
    User,
    Users,
} from "lucide-react";
import { useEffect, useState } from "react";
import api from "../../../services/api";
import StatsCard from "./StatsCard";

function formatPickupDate(dateStr) {
    if (!dateStr) return { date: "-", time: "-" };
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return { date: dateStr, time: "" };

    const day = date.getDate().toString().padStart(2, "0");
    const month = date.toLocaleString("en-US", { month: "short" });
    const year = date.getFullYear();
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return {
        date: `${day} ${month} ${year}`,
        time: `${h.toString().padStart(2, "0")}:${minutes} ${ampm}`,
    };
}

function getStatusLabel(status) {
    if (!status) return "Active";
    if (status === "available" || status === "active") return "Active";
    if (status === "requested") return "Pending";
    if (status === "completed") return "Completed";
    return status.charAt(0).toUpperCase() + status.slice(1);
}

function getStatusClass(status) {
    if (!status) return "active";
    const s = status.toLowerCase();
    if (s === "available" || s === "active") return "active";
    if (s === "requested" || s === "pending") return "pending";
    if (s === "completed") return "completed";
    return "active";
}

export default function DonorDashboardHome({ userName = "User" }) {
    const [donations, setDonations] = useState([]);
    const [requests, setRequests] = useState([]);
    const [stats, setStats] = useState({
        activeDonations: 0,
        pendingRequests: 0,
        completed: 0,
        todaysPickups: 0,
    });

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await api.get("/donations/my-donations");
                if (response.data.success && Array.isArray(response.data.data)) {
                    const all = response.data.data;
                    setDonations(all.slice(0, 5));

                    const active = all.filter((d) => d.status === "available").length;
                    const pending = all.filter((d) => d.status === "requested").length;
                    const completed = all.filter((d) => d.status === "completed").length;

                    const today = new Date().toDateString();
                    const todaysPickups = all.filter(
                        (d) => new Date(d.pickupTime).toDateString() === today,
                    ).length;

                    setStats({
                        activeDonations: active,
                        pendingRequests: pending,
                        completed,
                        todaysPickups,
                    });
                }
            } catch {
                // If API fails or backend offline, keep empty state without dummy fallback
                setDonations([]);
                setRequests([]);
                setStats({
                    activeDonations: 0,
                    pendingRequests: 0,
                    completed: 0,
                    todaysPickups: 0,
                });
            }
        };

        fetchDashboardData();
    }, []);

    const firstName = userName ? userName.split(" ")[0] : "Donor";

    return (
        <div>
            {/* Header */}
            <div className="dashboard-header">
                <div className="dashboard-header-text">
                    <h2>Donor Dashboard</h2>
                    <p>
                        Welcome back, <strong>{firstName}!</strong>
                    </p>
                    <p>Here's what's happening with your donations.</p>
                </div>
                <button className="btn-create-donation">
                    <Plus size={18} />
                    Create Donation
                </button>
            </div>

            {/* Stats Row */}
            <div className="stats-row">
                <StatsCard
                    icon={ClipboardList}
                    number={stats.activeDonations}
                    label="Active Donations"
                />
                <StatsCard
                    icon={Users}
                    number={stats.pendingRequests}
                    label="Pending Requests"
                />
                <StatsCard
                    icon={CheckCircle}
                    number={stats.completed}
                    label="Completed"
                />
                <StatsCard
                    icon={Calendar}
                    number={stats.todaysPickups}
                    label="Today's Pickups"
                />
            </div>

            {/* My Active Donations */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h3>My Active Donations</h3>
                    <span className="view-all-link">
                        View All <ArrowRight size={14} />
                    </span>
                </div>
                {donations.length === 0 ? (
                    <div className="empty-state">
                        <Package
                            size={32}
                            style={{ margin: "0 auto 8px auto", opacity: 0.4 }}
                        />
                        <p>No active donations found</p>
                    </div>
                ) : (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>Food Item</th>
                                <th>Quantity</th>
                                <th>Pickup Before</th>
                                <th>Requests</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {donations.map((donation) => {
                                const pickup = formatPickupDate(donation.pickupTime);
                                return (
                                    <tr key={donation._id}>
                                        <td>
                                            <div className="food-item-cell">
                                                <div className="food-icon">
                                                    <Package size={16} />
                                                </div>
                                                <div>
                                                    <div className="food-item-name">
                                                        {donation.foodName}
                                                    </div>
                                                    <div className="food-item-category">
                                                        {donation.category}
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td>{donation.quantity}</td>
                                        <td>
                                            {pickup.date}
                                            <br />
                                            {pickup.time}
                                        </td>
                                        <td>{donation.requests ?? 0}</td>
                                        <td>
                                            <span
                                                className={`status-badge ${getStatusClass(donation.status)}`}
                                            >
                                                {getStatusLabel(donation.status)}
                                            </span>
                                        </td>
                                        <td>
                                            <span className="row-arrow">
                                                <ChevronRight size={18} />
                                            </span>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Recent Requests */}
            <div className="dashboard-card">
                <div className="card-header">
                    <h3>Recent Requests</h3>
                    <span className="view-all-link">
                        View All <ArrowRight size={14} />
                    </span>
                </div>
                {requests.length === 0 ? (
                    <div className="empty-state">
                        <Users
                            size={32}
                            style={{ margin: "0 auto 8px auto", opacity: 0.4 }}
                        />
                        <p>No recent requests</p>
                    </div>
                ) : (
                    <table className="dashboard-table">
                        <thead>
                            <tr>
                                <th>NGO Name</th>
                                <th>Donation</th>
                                <th>Requested On</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {requests.map((request) => (
                                <tr key={request._id}>
                                    <td>
                                        <div className="ngo-cell">
                                            <div className="ngo-avatar">
                                                <User size={14} />
                                            </div>
                                            {request.ngoName}
                                        </div>
                                    </td>
                                    <td>{request.donation}</td>
                                    <td>{request.requestedOn}</td>
                                    <td>
                                        <span
                                            className={`status-badge ${getStatusClass(request.status)}`}
                                        >
                                            {request.status}
                                        </span>
                                    </td>
                                    <td>
                                        <span className="row-arrow">
                                            <ChevronRight size={18} />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}
