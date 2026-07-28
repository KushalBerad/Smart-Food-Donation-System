import { useNavigate } from "react-router-dom";
import {
 
  CreditCard,
  Users2,
  CheckCircle2,
  CalendarDays,
  ChevronRight,
  PlusCircle,
  
} from "lucide-react";


const stats = [
  { label: "Active Donations", value: 3, icon: CreditCard, color: "blue" },
  { label: "Pending Requests", value: 2, icon: Users2, color: "amber" },
  { label: "Completed", value: 5, icon: CheckCircle2, color: "emerald" },
  { label: "Today's Pickups", value: 0, icon: CalendarDays, color: "violet" },
];

const colorMap = {
  blue: "bg-blue-50 text-blue-600",
  amber: "bg-amber-50 text-amber-600",
  emerald: "bg-[#16A34A]/10 text-[#16A34A]",
  violet: "bg-violet-50 text-violet-600",
};

const activeDonations = [
  {
    item: "Veg Biryani",
    type: "Cooked Food",
    quantity: "30 Meals",
    pickup: "16 May 2024, 08:00 PM",
    requests: 1,
    status: "Active",
  },
  {
    item: "Dal & Rice",
    type: "Cooked Food",
    quantity: "25 Meals",
    pickup: "16 May 2024, 07:00 PM",
    requests: 0,
    status: "Active",
  },
  {
    item: "Fruits",
    type: "Other",
    quantity: "10 Kg",
    pickup: "17 May 2024, 10:00 AM",
    requests: 1,
    status: "Active",
  },
];

const recentRequests = [
  {
    ngo: "Helping Hands NGO",
    donation: "Veg Biryani (30 Meals)",
    requestedOn: "15 May 2024, 11:30 AM",
    status: "Pending",
  },
  {
    ngo: "Care Foundation",
    donation: "Fruits (10 Kg)",
    requestedOn: "15 May 2024, 09:15 AM",
    status: "Pending",
  },
];

export default function DonorDashboard() {
   const navigate = useNavigate();
  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-start justify-between gap-4 bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <div className="flex items-start gap-3">
         
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">
              Donor Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Welcome back, <span className="font-medium text-gray-700">John</span>! Here's what's happening with your donations.
            </p>
          </div>
        </div>

        <button onClick={() => navigate("/create-donation")} className="flex items-center gap-2 bg-gradient-to-r from-[#22C55E] to-[#16A34A] hover:from-[#16A34A] hover:to-[#15803D] text-white text-sm font-semibold px-5 py-2.5 rounded-xl whitespace-nowrap shadow-lg shadow-[#16A34A]/30 transition-all active:scale-[0.97]">
          <PlusCircle size={18} />
          Create Donation
        </button>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div
            key={label}
            className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-3.5 hover:shadow-md transition-shadow"
          >
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${colorMap[color]}`}>
              <Icon size={22} strokeWidth={2.2} />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 leading-tight">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          </div>
        ))}
      </div>

      
      {/* Active Donations */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">My Active Donations</h2>
          <button className="text-sm text-[#16A34A] font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="py-2.5 font-medium">Food Item</th>
                <th className="py-2.5 font-medium">Quantity</th>
                <th className="py-2.5 font-medium">Pickup Before</th>
                <th className="py-2.5 font-medium">Requests</th>
                <th className="py-2.5 font-medium">Status</th>
                <th className="py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {activeDonations.map((row) => (
                <tr key={row.item} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5">
                    <p className="font-medium text-gray-900">{row.item}</p>
                    <p className="text-xs text-gray-400">{row.type}</p>
                  </td>
                  <td className="py-3.5 text-gray-600">{row.quantity}</td>
                  <td className="py-3.5 text-gray-600">{row.pickup}</td>
                  <td className="py-3.5 text-gray-600">{row.requests}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-[#16A34A]/10 text-[#16A34A] text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-300">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recent Requests */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-semibold text-gray-900">Recent Requests</h2>
          <button className="text-sm text-[#16A34A] font-medium flex items-center gap-1 hover:gap-1.5 transition-all">
            View All <ChevronRight size={16} />
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                <th className="py-2.5 font-medium">NGO Name</th>
                <th className="py-2.5 font-medium">Donation</th>
                <th className="py-2.5 font-medium">Requested On</th>
                <th className="py-2.5 font-medium">Status</th>
                <th className="py-2.5"></th>
              </tr>
            </thead>
            <tbody>
              {recentRequests.map((row) => (
                <tr key={row.ngo} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                  <td className="py-3.5 font-medium text-gray-900">{row.ngo}</td>
                  <td className="py-3.5 text-gray-600">{row.donation}</td>
                  <td className="py-3.5 text-gray-600">{row.requestedOn}</td>
                  <td className="py-3.5">
                    <span className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-600 text-xs font-medium px-2.5 py-1 rounded-full">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      {row.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-gray-300">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
