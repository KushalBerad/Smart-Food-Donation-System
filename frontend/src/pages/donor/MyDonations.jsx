import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ChevronRight,
} from "lucide-react";

import { getMyDonations } from "../../services/donationService";
const filters = [
  "All",
  "Available",
  "Requested",
  "Accepted",
  "Completed",
  "Expired",
  "Cancelled",
];

const statusStyles = {
  available: "bg-sky-100 text-sky-700",
  requested: "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  expired: "bg-rose-100 text-rose-600",
  cancelled: "bg-gray-200 text-gray-600",
};

const formatStatus = (status) =>
  status
    ? status.charAt(0).toUpperCase() + status.slice(1)
    : "N/A";

const formatDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })
    : "N/A";

function DonationCard({ item }) {
  return (
    <button className="w-full flex items-center gap-4 bg-white rounded-xl px-5 py-4 shadow-sm hover:shadow-md transition text-left">
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-gray-800 truncate">
          {item.foodName}
        </p>

        <p className="text-sm text-gray-400 mt-1">
          {item.quantity} kg
          {item.status === "expired" ? (
            <span className="text-rose-500"> • Expired</span>
          ) : (
            <span> • Available</span>
          )}
        </p>
      </div>

      <div className="flex flex-col items-end gap-1">
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[item.status] ||
            "bg-gray-100 text-gray-700"
          }`}
        >
          {formatStatus(item.status)}
        </span>

        <span className="text-xs text-gray-400">
          {formatDate(item.createdAt)}
        </span>
      </div>

      <ChevronRight className="w-5 h-5 text-gray-300" />
    </button>
  );
}

export default function MyDonations() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDonations = async () => {
    try {
      setLoading(true);

      const status =
        activeFilter === "All"
          ? ""
          : activeFilter.toLowerCase();

      const response = await getMyDonations(status, 1, 20);

      if (response.success) {
        setDonations(response.data || []);
      }
    } catch (error) {
      console.log("My Donations Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [activeFilter]);

  return (
    <div className="min-h-screen bg-gray-50 w-full px-6 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 bg-white rounded-xl shadow-sm px-5 py-4">
        <button>
          <ArrowLeft className="w-6 h-6 text-gray-700" />
        </button>

        {/* Left aligned heading */}
        <h1 className="text-2xl font-bold text-[#16A34A]">
          My Donations
        </h1>
      </div>

      {/* Filters */}
      <div className="flex gap-3 py-5 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter)}
            className={`px-5 py-2 rounded-full text-sm font-medium whitespace-nowrap ${
              activeFilter === filter
                ? "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      {/* Donation List */}
      <div className="flex flex-col gap-4">
        {loading ? (
          <p className="text-center text-gray-400 py-10">
            Loading...
          </p>
        ) : donations.length === 0 ? (
          <p className="text-center text-gray-400 py-10">
            No donations found
          </p>
        ) : (
          donations.map((item) => (
            <DonationCard key={item._id} item={item} />
          ))
        )}
      </div>
    </div>
  );
}