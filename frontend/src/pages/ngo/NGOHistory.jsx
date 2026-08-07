import { History as HistoryIcon, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { getNGOHistory } from "../../services/ngoService";

const statusBadge = {
  completed: "bg-[#16A34A]/20 text-[#16A34A]",
  expired: "bg-amber-50 text-amber-600",
  cancelled: "bg-red-50 text-red-600",
};

function formatDate(dateStr) {
  if (!dateStr) return "—";
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function NGOHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const fetch = async () => {
      try {
        setLoading(true);
        const data = await getNGOHistory({ page, limit: 10 });
        if (data.success) {
          setHistory(data.history || []);
          setTotalPages(data.totalPages || 1);
        }
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [page]);

  return (
    <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">History</h1>
        <p className="text-sm text-gray-500 mt-1">
          View completed, expired and cancelled donation requests.
        </p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
        {loading ? (
          <div className="flex flex-col items-center justify-center gap-3 py-12">

            <Loader2
              size={28}
              className="animate-spin text-[#16A34A]"
            />

            <p className="text-sm text-gray-500">
              Loading history...
            </p>

          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 py-6 
          text-center text-sm font-medium text-red-600">
            {error}
          </div>
        ) : history.length === 0 ? (
          <div className="text-center py-12">
            <HistoryIcon size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-400 text-sm">No history records yet.</p>
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm min-w-[600px]">
                <thead>
                  <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                    <th className="py-2.5 font-medium pl-2">Food Name</th>
                    <th className="py-2.5 font-medium">Donor</th>
                    <th className="py-2.5 font-medium">Quantity</th>
                    <th className="py-2.5 font-medium">Completed On</th>
                    <th className="py-2.5 font-medium">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((h) => (
                    <tr key={h._id} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/70 transition-colors">
                      <td className="py-3.5 pl-2 font-semibold text-gray-900">{h.foodName}</td>
                      <td className="py-3.5 text-gray-600">{h.donorName}</td>
                      <td className="py-3.5 text-gray-600">{h.quantity}</td>
                      <td className="py-3.5 text-gray-600">{formatDate(h.completedAt)}</td>
                      <td className="py-3.5">
                        <span className={`inline-flex items-center text-xs font-semibold px-2.5 py-1 rounded-full capitalize ${statusBadge[h.finalStatus] || "bg-gray-100 text-gray-500"}`}>
                          {h.finalStatus}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-4 pt-4 border-t border-gray-100">
                <button onClick={() => setPage(Math.max(1, page - 1))} disabled={page <= 1}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50/70 transition">
                  Previous
                </button>
                <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(Math.min(totalPages, page + 1))} disabled={page >= totalPages}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-xl disabled:opacity-40 hover:bg-gray-50/70 transition">
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
