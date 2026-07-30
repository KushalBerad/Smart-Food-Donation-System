import {
  CheckCircle2,
  ChevronRight,
  ClipboardList,
  Loader2,
  Package,
  Truck,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getDashboardStats } from "../../services/ngoService";

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-[#16A34A]/10 text-[#16A34A]",
  violet: "bg-violet-50 text-violet-600",
};

const statusBadge = {
  accepted: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  completed: "bg-blue-50 text-blue-600 border border-blue-200",
  cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
};

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

function formatRequestDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
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
          sub: "New donations available",
          icon: Package,
          color: "blue",
        },
        {
          label: "My Requests",
          value: dashboard.stats.myRequests,
          sub: "Requests submitted",
          icon: ClipboardList,
          color: "amber",
        },
        {
          label: "Accepted Requests",
          value: dashboard.stats.acceptedRequests,
          sub: "Requests accepted",
          icon: CheckCircle2,
          color: "emerald",
        },
        {
          label: "Completed Pickups",
          value: dashboard.stats.completedPickups,
          sub: "Pickups completed",
          icon: Truck,
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
            className="mt-4 px-4 py-2 text-sm font-medium text-white bg-[#16A34A] rounded-lg hover:bg-[#15803D] transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          NGO Dashboard
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back,{" "}
          <span className="font-medium text-gray-700">{ngoName}</span>
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, sub, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow"
          >
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}
            >
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-xs text-gray-500 uppercase tracking-wide font-medium">
                {label}
              </p>
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                {value}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Available Donations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">
            Recent Available Donations
          </h2>
          <button
            onClick={() => navigate("/ngo/browse")}
            className="text-sm text-[#16A34A] font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            View All Donations <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="py-2.5 font-medium pl-2">Food Name</th>
                <th className="py-2.5 font-medium">Donor</th>
                <th className="py-2.5 font-medium">Quantity</th>
                <th className="py-2.5 font-medium">Location</th>
                <th className="py-2.5 font-medium">Expiry Time</th>
                <th className="py-2.5 font-medium text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentDonations?.length > 0 ? (
                dashboard.recentDonations.map((donation) => (
                  <tr
                    key={donation._id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3.5 pl-2">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                          <Package size={16} className="text-amber-500" />
                        </div>
                        <span className="font-medium text-gray-900">
                          {donation.foodName}
                        </span>
                      </div>
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {donation.donor?.organizationName}
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {donation.quantity}
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {donation.donor?.city}
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {formatDate(donation.expiryAt)}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() =>
                          navigate(`/ngo/donation/${donation._id}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="py-8 text-center text-gray-400 text-sm"
                  >
                    No available donations right now.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Request Status */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Request Status</h2>
          <button
            onClick={() => navigate("/ngo/requests")}
            className="text-sm text-[#16A34A] font-medium flex items-center gap-1 hover:gap-1.5 transition-all"
          >
            View All Requests <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[700px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="py-2.5 font-medium pl-2">Donation</th>
                <th className="py-2.5 font-medium">Requested On</th>
                <th className="py-2.5 font-medium">Status</th>
                <th className="py-2.5 font-medium">Pickup Time</th>
                <th className="py-2.5 font-medium text-right pr-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {dashboard.recentRequests?.length > 0 ? (
                dashboard.recentRequests.map((req) => (
                  <tr
                    key={req._id}
                    className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors"
                  >
                    <td className="py-3.5 pl-2 text-gray-900 font-medium">
                      {req.donation?.foodName} –{" "}
                      <span className="font-normal text-gray-500">
                        {req.donor?.organizationName}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {formatRequestDate(req.requestedAt)}
                    </td>
                    <td className="py-3.5">
                      <span
                        className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${
                          statusBadge[req.status] || statusBadge.pending
                        }`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="py-3.5 text-gray-600">
                      {req.status === "accepted" || req.status === "completed"
                        ? formatPickupTime(req.donation?.pickupTime)
                        : "—"}
                    </td>
                    <td className="py-3.5 text-right pr-2">
                      <button
                        onClick={() =>
                          navigate(`/ngo/requests?id=${req._id}`)
                        }
                        className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 hover:border-gray-300 transition-all"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="py-8 text-center text-gray-400 text-sm"
                  >
                    No requests yet. Browse available donations to get started.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
