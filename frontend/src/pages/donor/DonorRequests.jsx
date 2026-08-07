import { ClipboardList, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getPendingRequests } from "../../services/donorService";

const statusBadge = {
    accepted: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20",
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
    completed: "bg-blue-50 text-blue-600 border border-blue-200",
    cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
};

function formatDate(dateStr) {
    if (!dateStr) return "—";
    return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

export default function Requests() {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const navigate = useNavigate();

    const fetchRequests = async () => {
        try {
            setLoading(true);
            setError("");
            const params = { page, limit: 10 };
            const data = await getPendingRequests(params);
            if (data.success) {
                setRequests(data.data || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err) {
            setError(err.response?.data?.message || "Failed to load requests");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchRequests(); }, [page]);

    return (
        <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between">
                <div>
                    <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Incoming Requests</h1>
                    <p className="text-sm text-gray-500 mt-1">Review requests received from NGOs</p>
                </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-5">
                {loading ? (
                    <div className="flex items-center justify-center py-12">
                        <Loader2 size={28} className="animate-spin text-[#16A34A]" />
                    </div>
                ) : error ? (
                    <div className="text-center py-12 text-red-500 text-sm">{error}</div>
                ) : requests.length === 0 ? (
                    <div className="text-center py-12">
                        <ClipboardList size={40} className="mx-auto text-gray-300 mb-3" />
                        <p className="text-gray-400 text-sm">No requests found.</p>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm min-w-[650px]">
                                <thead>
                                    <tr className="text-left text-gray-400 text-xs uppercase tracking-wide border-b border-gray-100">
                                        <th className="py-2.5 font-medium pl-2">Donation</th>
                                        <th className="py-2.5 font-medium">NGO</th>
                                        <th className="py-2.5 font-medium">Quantity</th>
                                        <th className="py-2.5 font-medium">Requested On</th>
                                        <th className="py-2.5 font-medium">Status</th>
                                        <th className="py-2.5 font-medium text-right pr-2">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {requests.map((req) => (
                                        <tr key={req._id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/70 transition-colors">
                                            <td className="py-3.5 pl-2 font-medium text-gray-900">{req.donationId?.foodName}</td>
                                            <td className="py-3.5 text-gray-600">{req.ngoId?.organizationName}</td>
                                            <td className="py-3.5 text-gray-600">{req.requestedQuantity}</td>
                                            <td className="py-3.5 text-gray-600">{formatDate(req.requestedAt)}</td>
                                            <td className="py-3.5">
                                                <span className={`inline-flex items-center text-xs font-medium px-2.5 py-1 rounded-full capitalize ${statusBadge[req.status] || statusBadge.pending}`}>
                                                    {req.status}
                                                </span>
                                            </td>
                                            <td className="py-3.5 text-right pr-2">
                                                <button
                                                    onClick={() => navigate(`/requests/${req._id}`)}
                                                    className="inline-flex items-center px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition"
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
