import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getDonorHistory,
} from "../../services/donationService";

const statusBadge = {
    accepted: "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20",
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
    completed: "bg-blue-50 text-blue-600 border border-blue-200",
    cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
    expired: "bg-gray-100 text-gray-600 border border-gray-300",
};

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

export default function DonorHistory() {

    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const [type, setType] = useState("all");

    const fetchHistory = async () => {

        try {
            setLoading(true);
            const data = await getDonorHistory(
                type,
                page,
                10
            );

            if (data.success) {

                setHistory(data.data || []);
                setTotalPages(data.totalPages || 1);
            }
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, [page, type]);

    const viewDetails = (id) => {
        navigate(`/history/${id}`);
    };
    return (
        <div className="flex-1 p-4 sm:p-6 space-y-6 bg-gray-50 min-h-screen">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                <h1 className="text-2xl font-bold">
                    Donation History
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                    View all completed donation activities
                </p>
            </div>
            <div className="flex gap-3">
                {["all", "donation", "request"].map((item) => (
                    <button
                        key={item}
                        onClick={() => {
                            setType(item);
                            setPage(1);
                        }}
                        className={`px-4 py-2 rounded-xl text-sm font-medium transition ${type === item
                            ? "bg-[#16A34A] text-white"
                            : "bg-white border border-gray-200"
                            }`}
                    >
                        {item.charAt(0).toUpperCase() + item.slice(1)}
                    </button>
                ))}
            </div>
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader2
                            className="animate-spin text-[#16A34A]"
                            size={28}
                        />
                    </div>
                ) : history.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                        No history found.
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-[700px]">
                            <thead>
                                <tr className="border-b border-gray-100 text-left text-xs uppercase text-gray-400">
                                    <th className="py-3">
                                        Food
                                    </th>
                                    <th>
                                        NGO
                                    </th>
                                    <th>
                                        Quantity
                                    </th>
                                    <th>
                                        Date
                                    </th>
                                    <th>
                                        Status
                                    </th>
                                    <th className="text-right">
                                        Action
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {history.map((item) => (
                                    <tr
                                        key={item._id}
                                        className="border-b border-gray-50"
                                    >
                                        <td className="py-4">
                                            {item.foodName}
                                        </td>
                                        <td>
                                            {item.ngoName}
                                        </td>
                                        <td>
                                            {item.quantity}
                                        </td>
                                        <td>
                                            {formatDate(item.date)}
                                        </td>
                                        <td>
                                            <span
                                                className={`px-2.5 py-1 rounded-full text-xs capitalize ${statusBadge[item.status]
                                                    }`}
                                            >
                                                {item.status}
                                            </span>
                                        </td>
                                        <td className="text-right">
                                            <button
                                                onClick={() => viewDetails(item._id)}
                                                className="px-3 py-1.5 rounded-lg border border-gray-200 hover:bg-gray-50 text-sm"
                                            >
                                                View
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
                {totalPages > 1 && (
                    <div className="flex justify-center gap-3 mt-6">
                        <button
                            disabled={page === 1}
                            onClick={() =>
                                setPage(page - 1)
                            }
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Previous
                        </button>
                        <span className="flex items-center">
                            {page} / {totalPages}
                        </span>
                        <button
                            disabled={page === totalPages}
                            onClick={() =>
                                setPage(page + 1)
                            }
                            className="px-4 py-2 border rounded-lg disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}