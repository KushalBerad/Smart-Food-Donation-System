import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

import {
  CalendarDays,
  Clock3,
  HandHeart,
  Users2,
} from "lucide-react";
import ActiveDonations from "../../components/dashboard/ActiveDonations";
import DashboardHeader from "../../components/dashboard/DashboardHeader";
import PendingRequests from "../../components/dashboard/PendingRequests";
// import QuickActions from "../../components/dashboard/QuickActions";
import StatCard from "../../components/dashboard/StatCard";


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
      label: "Active Donations",
      value: 0,
      icon: HandHeart,
      color: "blue",
    },
    {
      label: "Pending Requests",
      value: 0,
      icon: Users2,
      color: "amber",
    },
    {
      label: "Meals Donated",
      value: 0,
      icon: CalendarDays,
      color: "emerald",
    },
    {
      label: "Expiring Soon",
      value: 0,
      icon: Clock3,
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
        const donationsData = donations.data.data || [];
        const requestsData = requests.data.data || [];

        const expiringSoon = donationsData.filter((donation) => {
          if (!donation.pickupTime) return false;

          const now = new Date();
          const pickup = new Date(donation.pickupTime);

          const hours =
            (pickup - now) / (1000 * 60 * 60);

          return hours > 0 && hours <= 24;
        }).length;

        setStats([
          {
            label: "Active Donations",
            value: donationsData.length,
            icon: HandHeart,
            color: "blue",
          },
          {
            label: "Pending Requests",
            value: requestsData.filter(
              (request) =>
                request.status?.toLowerCase() ===
                "pending"
            ).length,
            icon: Users2,
            color: "amber",
          },
          {
            label: "Meals Donated",
            value: report.totalMealsDonated,
            icon: CalendarDays,
            color: "emerald",
          },
          {
            label: "Expiring Soon",
            value: expiringSoon,
            icon: Clock3,
            color: "violet",
          },
        ]);

        setActiveDonations(donationsData);
        setRecentRequests(requestsData);
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
      <DashboardHeader
        title="Donor Dashboard"
        userName={user?.name || "Donor"}
        buttonText="Create Donation"
        onCreateDonation={() =>
          navigate("/create-donation")
        }
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

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

      {/* <QuickActions
        onCreateDonation={() =>
          navigate("/create-donation")
        }
        onMyDonations={() =>
          navigate("/my-donations")
        }
        onHistory={() =>
          navigate("/history")
        }
      /> */}

      <PendingRequests
        loading={loading}
        requests={recentRequests}
        formatDate={formatDate}
        onViewAll={() =>
          navigate("/requests")
        }
      />

      <ActiveDonations
        loading={loading}
        donations={activeDonations}
        formatDateTime={formatDateTime}
        onViewAll={() => navigate("/my-donations")}
        onViewDonation={(id) =>
          navigate(`/donations/${id}`)
        }
      />
    </div>
  );
}