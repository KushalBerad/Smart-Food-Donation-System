import {
  Filter,
  Loader2,
  Package,
  Search
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAvailableDonations } from "../../services/ngoService";

function formatDate(dateStr) {
  if (!dateStr) return "—";
  const d = new Date(dateStr);
  const now = new Date();
  const isToday = d.toDateString() === now.toDateString();
  const time = d.toLocaleTimeString("en-IN", { hour: "numeric", minute: "2-digit", hour12: true });
  if (isToday) return `Today, ${time}`;
  return d.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) + `, ${time}`;
}

export default function BrowseDonations() {
  const navigate = useNavigate();
  const [donations, setDonations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchDonations = async () => {
    try {
      setLoading(true);
      setError("");
      const params = { page, limit: 10, category };
      if (search.trim()) params.search = search.trim();
      const data = await getAvailableDonations(params);
      if (data.success) {
        setDonations(data.donations || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load donations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDonations(); }, [page, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    fetchDonations();
  };

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Browse Donations</h1>
        <p className="text-sm text-gray-500 mt-1">Find available food donations near you</p>
      </div>

      {/* Search & Filter */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col sm:flex-row gap-3">
        <form onSubmit={handleSearch} className="flex-1 flex gap-2">
          <div className="flex-1 flex items-center gap-2 bg-gray-50 rounded-xl px-3 py-2.5 border border-gray-200">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by food name or location..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 bg-transparent border-none outline-none text-sm text-gray-700"
            />
          </div>
          <button type="submit" className="px-4 py-2 bg-[#16A34A] text-white text-sm font-medium rounded-xl hover:bg-[#15803D] transition">
            Search
          </button>
        </form>
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={category}
            onChange={(e) => { setCategory(e.target.value); setPage(1); }}
            className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none"
          >
            <option value="all">All Categories</option>
            <option value="veg">Veg</option>
            <option value="non-veg">Non-Veg</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      {/* Results */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 size={28} className="animate-spin text-[#16A34A]" />
          </div>
        ) : error ? (
          <div className="text-center py-12 text-red-500 text-sm">{error}</div>
        ) : donations.length === 0 ? (
          <div className="text-center py-12 text-gray-400 text-sm">No donations found.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[700px]">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="py-2.5 font-medium pl-2">Food Name</th>
                    <th className="py-2.5 font-medium">Category</th>
                    <th className="py-2.5 font-medium">Donor</th>
                    <th className="py-2.5 font-medium">Quantity</th>
                    <th className="py-2.5 font-medium">Location</th>
                    <th className="py-2.5 font-medium">Expiry</th>
                    <th className="py-2.5 font-medium text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {donations.map((d) => (
                    <tr key={d._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 pl-2">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center shrink-0">
                            <Package size={16} className="text-amber-500" />
                          </div>
                          <span className="font-medium text-gray-900">{d.foodName}</span>
                        </div>
                      </td>
                      <td className="py-3.5">
                        <span className="inline-flex items-center text-xs font-medium px-2 py-1 rounded-full bg-gray-100 text-gray-600 capitalize">{d.category}</span>
                      </td>
                      <td className="py-3.5 text-gray-600">{d.donor?.organizationName}</td>
                      <td className="py-3.5 text-gray-600">{d.quantity}</td>
                      <td className="py-3.5 text-gray-600">{d.donor?.city}</td>
                      <td className="py-3.5 text-gray-600">{formatDate(d.expiryAt)}</td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => navigate(`/ngo/donation/${d._id}`)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
                        >
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">Previous</button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages} className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition">Next</button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
