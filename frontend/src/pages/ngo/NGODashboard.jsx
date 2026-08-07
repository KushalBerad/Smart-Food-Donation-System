import {
  CalendarDays,
  ClipboardList,
  Loader2,
  Package,
  Truck,
} from "lucide-react";

import AvailableDonations from "../../components/dashboard/AvailableDonations";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import NGORequests from "../../components/dashboard/NGORequests";
import StatCard from "../../components/dashboard/StatCard";

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/ngoService";

// Format date for display
function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();

  const tomorrow = new Date(now);
  tomorrow.setDate(tomorrow.getDate() + 1);
  const isTomorrow = d.toDateString() === tomorrow.toDateString();

  const time = d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  if (isToday) return `Today, ${time}`;
  if (isTomorrow) return `Tomorrow, ${time}`;

  return d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function formatPickupTime(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  return `${d.toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })} – ${d.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export default function NGODashboard() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [dashboard, setDashboard] = useState(null);

  // Get user from localStorage
  const user = (() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  })();

  const ngoName = user.organizationName || user.name || "NGO";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getDashboardStats();
        if (data.success) {
          setDashboard(data);
        } else {
          setError(data.message || "Failed to load dashboard");
        }
      } catch (err) {
        setError(
          err.response?.data?.message || "Failed to load dashboard data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);

  const stats = dashboard
    ? [
      {
        label: "Available Donations",
        value: dashboard.stats.availableDonations,
        sub: "Available for request",
        icon: Package,
        color: "blue",
      },
      {
        label: "Pending Requests",
        value: dashboard.stats.pendingRequests,
        sub: "Awaiting your response",
        icon: ClipboardList,
        color: "amber",
      },
      {
        label: "Accepted Pickups",
        value: dashboard.stats.acceptedPickups,
        sub: "Ready for collection",
        icon: Truck,
        color: "emerald",
      },
      {
        label: "Today's Pickups",
        value: dashboard.stats.todayPickups,
        sub: "Scheduled for today",
        icon: CalendarDays,
        color: "violet",
      },
    ]
    : [];

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={32} className="animate-spin text-[#16A34A]" />
          <p className="text-sm text-gray-500">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-6 max-w-md text-center">
          <p className="text-red-600 font-medium mb-2">Error</p>
          <p className="text-sm text-gray-600">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 text-sm font-semibold text-white bg-[#16A34A] rounded-lg hover:bg-[#15803D] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <DashboardHeader
        title="NGO Dashboard"
        userName={ngoName}
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4">

        {stats.map((stat) => (
          <StatCard
            key={stat.label}
            label={stat.label}
            value={stat.value}
            icon={stat.icon}
            color={stat.color}
            loading={loading}
          />
        ))}
      </div>

      <div className="space-y-6">

        <AvailableDonations
          donations={dashboard?.recentDonations || []}
          formatDate={formatDate}
          onViewAll={() => navigate("/ngo/browse")}
          onViewDonation={(id) =>
            navigate(`/ngo/donation/${id}`)
          }
        />

        <NGORequests
          requests={dashboard?.recentRequests || []}
          formatPickupTime={formatPickupTime}
          onViewAll={() => navigate("/ngo/requests")}
          onViewRequest={(id) =>
            navigate(`/ngo/requests?id=${id}`)
          }
        />
      </div>
    </div>
  );
}
