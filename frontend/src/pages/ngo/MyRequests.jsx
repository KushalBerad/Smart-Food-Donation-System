import { ClipboardList, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyRequests } from "../../services/ngoService";

const statusBadge = {
  accepted: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20",
  pending: "bg-amber-50 text-amber-600 border border-amber-200",
  rejected: "bg-red-50 text-red-600 border border-red-200",
  completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
  cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function MyRequests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const navigate = useNavigate();

  const fetchRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const params = { page, limit: 10 };
      if (statusFilter) params.status = statusFilter;
      const data = await getMyRequests(params);
      if (data.success) {
        setRequests(data.requests || []);
        setTotalPages(data.totalPages || 1);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchRequests(); }, [page, statusFilter]);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">My Requests</h1>
          <p className="mt-1 text-sm text-gray-500">
            Check every donation request submitted by your NGO.
          </p>
        </div>
        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
          className="bg-gray-50 border border-gray-200 
          rounded-xl px-3 py-2 text-sm text-gray-700 outline-none 
          focus:border-[#16A34A] focus:ring-2 focus:ring-[#16A34A]/10"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="accepted">Accepted</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">

            <Loader2
              size={28}
              className="animate-spin text-[#16A34A]"
            />

            <p className="text-sm text-gray-500">
              Loading requests...
            </p>

          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 py-6 
          text-center text-sm font-medium text-red-600">
            {error}</div>
        ) : requests.length === 0 ? (
          <div className="text-center py-12">
            <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No donation requests found.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[650px]">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="py-2.5 font-medium pl-2">Donation</th>
                    <th className="py-2.5 font-medium">Donor</th>
                    <th className="py-2.5 font-medium">Quantity</th>
                    <th className="py-2.5 font-medium">Requested On</th>
                    <th className="py-2.5 font-medium">Status</th>
                    <th className="py-2.5 font-medium text-right pr-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((req) => (
                    <tr key={req._id}
                      className="border-b border-gray-100 last:border-0 transition hover:bg-gray-50">
                      <td className="py-3.5 pl-2 font-medium text-gray-900">{req.donation?.foodName}</td>
                      <td className="py-3.5 text-gray-600">{req.donor?.organizationName}</td>
                      <td className="py-3.5 text-gray-600">{req.requestedQuantity}</td>
                      <td className="py-3.5 text-gray-600">{formatDate(req.requestedAt)}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusBadge[req.status] || statusBadge.pending}`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="py-3.5 text-right pr-2">
                        <button
                          onClick={() => navigate(`/ngo/requests/${req._id}`)}
                          className="inline-flex items-center gap-2 
                          rounded-lg border border-[#16A34A] px-4 py-2 text-sm 
                          font-semibold text-[#16A34A] 
                          transition hover:bg-[#16A34A] hover:text-white"
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
