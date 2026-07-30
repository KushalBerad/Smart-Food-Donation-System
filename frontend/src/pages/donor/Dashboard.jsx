import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  CreditCard,
  PlusCircle,
  Users2,
} from "lucide-react";

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-[#16A34A]/10 text-[#16A34A]",
  violet: "bg-violet-50 text-violet-600",
};

export default function DonorDashboard() {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user") || "{}");
  const [stats, setStats] = useState([
    {
      label: "Active Donations",
      value: 0,
      icon: CreditCard,
      color: "blue",
    },
    {
      label: "Pending Requests",
      value: 0,
      icon: Users2,
      color: "amber",
    },
    {
      label: "Completed",
      value: 0,
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      label: "Today's Pickups",
      value: 0,
      icon: CalendarDays,
      color: "violet",
    },
  ]);
  const [activeDonations, setActiveDonations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  useEffect(() => {
    console.log("Dashboard useEffect running");
    const fetchDashboardStats = async () => {
      try {
        console.log("Calling /reports");
        const { data } = await api.get("/reports");
        console.log("Reports API Response:", data);
        console.log("Stats:", data.data);

        setStats([
          {
            label: "Total Donations",
            value: data.data.totalDonations,
            icon: CreditCard,
            color: "blue",
          },
          {
            label: "Pending Donations",
            value: data.data.pendingDonations,
            icon: Users2,
            color: "amber",
          },
          {
            label: "Completed Donations",
            value: data.data.completedDonations,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "Meals Donated",
            value: data.data.totalMealsDonated,
            icon: CalendarDays,
            color: "violet",
          },
        ]);
        const donationsResponse = await api.get("/donations/my-donations");
        console.log("My Donations:", donationsResponse.data);
        setActiveDonations(donationsResponse.data.data || []);

        const requestsResponse = await api.get("/donations/requests");
        console.log("Requests:", requestsResponse.data);
        setRecentRequests(requestsResponse.data.data || []);

      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
      }
    };
    fetchDashboardStats();
  }, []);


  return (
  <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
    {/* Header */}
    <div className="flex items-start justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
          Donor Dashboard
        </h1>

        <p className="text-sm text-gray-500 mt-1">
          Welcome back,
          <span className="font-medium text-gray-700">
            {" "}
            {user?.name || "Donor"}
          </span>
          ! Here's what's happening with your donations.
        </p>
      </div>

      <button
        onClick={() => navigate("/create-donation")}
        className="flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap shadow-lg shadow-[#16A34A]/30 transition-all active:scale-[0.97]"
      >
        <PlusCircle size={18} />
        Create Donation
      </button>
    </div>

    {/* Stats */}
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map(({ label, value, icon: Icon, color }) => (
        <div
          key={label}
          className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow"
        >
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${colorMap[color]}`}
          >
            <Icon size={22} />
          </div>

          <div>
            <p className="text-2xl font-bold">{value}</p>
            <p className="text-xs text-gray-500">{label}</p>
          </div>
        </div>
      ))}
    </div>

    {/* Active Donations */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-gray-900">
          My Active Donations
        </h2>

        <button className="text-sm text-[#16A34A] flex items-center gap-1">
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs">
              <th className="py-3 text-left">Food Item</th>
              <th className="py-3 text-left">Quantity</th>
              <th className="py-3 text-left">Pickup Before</th>
              <th className="py-3 text-left">Requests</th>
              <th className="py-3 text-left">Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {activeDonations.length === 0 ? (
              <tr>
                <td
                  colSpan={6}
                  className="py-10 text-center text-gray-500"
                >
                  No active donations found.
                </td>
              </tr>
            ) : (
              activeDonations.map((row) => (
                <tr
                  key={row._id}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-4">
                    <p className="font-medium">
                      {row.foodName}
                    </p>

                    <p className="text-xs text-gray-400">
                      {row.foodType}
                    </p>
                  </td>

                  <td>{row.quantity}</td>

                  <td>
                    {row.pickupTime
                      ? new Date(row.pickupTime).toLocaleString()
                      : "-"}
                  </td>

                  <td>{row.requestCount ?? 0}</td>

                  <td>
                    <span className="inline-flex items-center gap-2 bg-[#16A34A]/10 text-[#16A34A] px-2 py-1 rounded-full text-xs">
                      <span className="w-2 h-2 rounded-full bg-[#16A34A]" />
                      {row.status}
                    </span>
                  </td>

                  <td>
                    <ChevronRight
                      size={16}
                      className="text-gray-400"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>

    {/* Recent Requests */}
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold">
          Recent Requests
        </h2>

        <button className="text-sm text-[#16A34A] flex items-center gap-1">
          View All
          <ChevronRight size={16} />
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm min-w-[700px]">
          <thead>
            <tr className="border-b border-gray-100 text-gray-500 uppercase text-xs">
              <th className="py-3 text-left">NGO Name</th>
              <th className="py-3 text-left">Donation</th>
              <th className="py-3 text-left">Requested On</th>
              <th className="py-3 text-left">Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {recentRequests.length === 0 ? (
              <tr>
                <td
                  colSpan={5}
                  className="py-10 text-center text-gray-500"
                >
                  No requests found.
                </td>
              </tr>
            ) : (
              recentRequests.map((row) => (
                <tr
                  key={row.ngo}
                  className="border-b border-gray-50 hover:bg-gray-50"
                >
                  <td className="py-4 font-medium">{row.ngo}</td>
                  <td>{row.donation}</td>
                  <td>{row.requestedOn}</td>
                  <td>
                    <span className="inline-flex items-center gap-2 bg-amber-50 text-amber-600 px-2 py-1 rounded-full text-xs">
                      <span className="w-2 h-2 rounded-full bg-amber-500" />
                      {row.status}
                    </span>
                  </td>
                  <td>
                    <ChevronRight
                      size={16}
                      className="text-gray-400"
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  </div>
)}
