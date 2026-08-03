import { useEffect, useMemo, useState } from "react";
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

  const user = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem("user") || "{}");
    } catch {
      return {};
    }
  }, []);

  const [loading, setLoading] = useState(true);

  const [stats, setStats] = useState([
    {
      label: "Total Donations",
      value: 0,
      icon: CreditCard,
      color: "blue",
    },
    {
      label: "Pending Donations",
      value: 0,
      icon: Users2,
      color: "amber",
    },
    {
      label: "Completed Donations",
      value: 0,
      icon: CheckCircle2,
      color: "emerald",
    },
    {
      label: "Meals Donated",
      value: 0,
      icon: CalendarDays,
      color: "violet",
    },
  ]);

  const [activeDonations, setActiveDonations] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);

  const formatDateTime = (date) =>
    date
      ? new Date(date).toLocaleString("en-IN")
      : "-";

  const formatDate = (date) =>
    date
      ? new Date(date).toLocaleDateString("en-IN")
      : "-";

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);

        const [
          reports,
          donations,
          requests,
        ] = await Promise.all([
          api.get("/reports"),
          api.get("/donations/my-donations"),
          api.get("/donations/requests"),
        ]);

        const report = reports.data.data;

        setStats([
          {
            label: "Total Donations",
            value: report.totalDonations,
            icon: CreditCard,
            color: "blue",
          },
          {
            label: "Pending Donations",
            value: report.pendingDonations,
            icon: Users2,
            color: "amber",
          },
          {
            label: "Completed Donations",
            value: report.completedDonations,
            icon: CheckCircle2,
            color: "emerald",
          },
          {
            label: "Meals Donated",
            value: report.totalMealsDonated,
            icon: CalendarDays,
            color: "violet",
          },
        ]);

        setActiveDonations(
          donations.data.data || []
        );

        setRecentRequests(
          requests.data.data || []
        );
      } catch (error) {
        console.error(
          "Dashboard Error:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, []);
  return (
    <div className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6 space-y-6">

      {/* Header */}
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Donor Dashboard
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Welcome back,&nbsp;
            <span className="font-semibold text-gray-800">
              {user?.name || "Donor"}
            </span>
            . Here's an overview of your donations.
          </p>
        </div>

        <button
          onClick={() => navigate("/create-donation")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#16A34A] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#15803D]"
        >
          <PlusCircle size={18} />
          Create Donation
        </button>

      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        {stats.map(
          ({
            label,
            value,
            icon: Icon,
            color,
          }) => (
            <div
              key={label}
              className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition hover:shadow-md"
            >

              <div className="flex items-center justify-between">

                <div>

                  <p className="text-sm text-gray-500">
                    {label}
                  </p>

                  {loading ? (
                    <div className="mt-3 h-8 w-16 animate-pulse rounded bg-gray-200" />
                  ) : (
                    <h2 className="mt-2 text-3xl font-bold text-gray-900">
                      {value}
                    </h2>
                  )}

                </div>

                <div
                  className={`flex h-12 w-12 items-center justify-center rounded-xl ${colorMap[color]}`}
                >
                  <Icon size={22} />
                </div>

              </div>

            </div>
          )
        )}

      </div>

      {/* Active Donations */}
      {/* Active Donations */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            My Active Donations
          </h2>

          <button
            onClick={() => navigate("/my-donations")}
            className="flex items-center gap-1 text-sm font-medium text-[#16A34A] hover:underline"
          >
            View All
            <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">

            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-3">Food Item</th>
                <th>Quantity</th>
                <th>Pickup Before</th>
                <th>Requests</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-500"
                  >
                    Loading donations...
                  </td>
                </tr>
              ) : activeDonations.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="py-12 text-center text-gray-500"
                  >
                    No active donations found.
                  </td>
                </tr>
              ) : (
                activeDonations.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4">
                      <p className="font-semibold text-gray-800">
                        {row.foodName}
                      </p>

                      <p className="text-xs text-gray-500">
                        {row.category}
                      </p>
                    </td>

                    <td>{row.quantity}</td>

                    <td>
                      {formatDateTime(row.pickupTime)}
                    </td>

                    <td>
                      {row.requestCount ?? 0}
                    </td>

                    <td>
                      <span className="inline-flex items-center rounded-full bg-[#16A34A]/10 px-3 py-1 text-xs font-medium capitalize text-[#16A34A]">
                        {row.status}
                      </span>
                    </td>

                    <td>
                      <button className="rounded-lg p-2 hover:bg-gray-100">
                        <ChevronRight
                          size={18}
                          className="text-gray-500"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

        <div className="mb-5 flex items-center justify-between">

          <h2 className="text-lg font-semibold text-gray-900">
            Recent Requests
          </h2>

          <button
            onClick={() => navigate("/requests")}
            className="flex items-center gap-1 text-sm font-medium text-[#16A34A] hover:underline"
          >
            View All
            <ChevronRight size={16} />
          </button>

        </div>

        <div className="overflow-x-auto">
          <table className="min-w-[700px] w-full text-sm">

            <thead>
              <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                <th className="py-3">NGO</th>
                <th>Donation</th>
                <th>Requested On</th>
                <th>Status</th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    Loading requests...
                  </td>
                </tr>
              ) : recentRequests.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="py-12 text-center text-gray-500"
                  >
                    No recent requests found.
                  </td>
                </tr>
              ) : (
                recentRequests.map((row) => (
                  <tr
                    key={row._id}
                    className="border-b border-gray-100 hover:bg-gray-50 transition"
                  >
                    <td className="py-4 font-semibold text-gray-800">
                      {row.ngoId?.organizationName ||
                        "N/A"}
                    </td>

                    <td>
                      {row.donationId?.foodName ||
                        "N/A"}
                    </td>

                    <td>
                      {formatDate(
                        row.requestedAt
                      )}
                    </td>

                    <td>
                      <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium capitalize text-amber-700">
                        {row.status}
                      </span>
                    </td>

                    <td>
                      <button className="rounded-lg p-2 hover:bg-gray-100">
                        <ChevronRight
                          size={18}
                          className="text-gray-500"
                        />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>

          </table>
        </div>
      </div>
    </div>
  );
}