import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getHistoryById } from "../../services/donationService";

export default function HistoryDetails() {

    const { id } = useParams();

    const [history, setHistory] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchHistory = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getHistoryById(id);

            if (data.success) {
                setHistory(data.data);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load history."
            );

        } finally {

            setLoading(false);

        }

    };

    useEffect(() => {
        fetchHistory();
    }, []);

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                    <Loader2
                        size={32}
                        className="animate-spin text-[#16A34A]"
                    />

                    <p className="text-sm text-gray-500">
                        Loading history details...
                    </p>

                </div>

            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="rounded-2xl border border-red-100 bg-white p-8 shadow-sm">

                    <p className="font-medium text-red-600">
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

            <button
                type="button"
                onClick={() => window.history.back()}
                className="mb-5 text-sm font-semibold text-[#16A34A] transition hover:underline"
            >
                ← Back to History
            </button>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">

                    <div>

                        <h1 className="text-2xl font-bold text-gray-900">
                            History Details
                        </h1>

                        <p className="mt-1 text-sm text-gray-500">
                            View the complete information about this completed donation.
                        </p>

                    </div>

                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize
                                ${history.status === "accepted"
                                ? "bg-green-100 text-green-700"
                                : history.status === "completed"
                                    ? "bg-blue-100 text-blue-700"
                                    : history.status === "rejected"
                                        ? "bg-red-100 text-red-700"
                                        : "bg-yellow-100 text-yellow-700"
                            }`}
                    >
                        {history.status}
                    </span>

                </div>

                {/* Donation */}

                <h2 className="mb-5 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
                    Donation Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">Food Name</p>
                        <p className="font-semibold">
                            {history.donationDetails?.foodName || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">Category</p>
                        <p className="font-semibold">
                            {history.donationDetails?.category || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">Quantity</p>
                        <p className="font-semibold">
                            {history.donationDetails?.quantity || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">Pickup Address</p>
                        <p className="font-semibold">
                            {history.donationDetails?.pickupAddress || "—"}
                        </p>
                    </div>

                </div>

                {/* NGO */}

                <h2 className="mb-5 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
                    NGO Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                            Organization
                        </p>
                        <p className="font-semibold">
                            {history.ngoName || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                            City
                        </p>
                        <p className="font-semibold">
                            {history.ngoCity || "—"}
                        </p>
                    </div>

                </div>

                {/* Request */}

                <h2 className="mb-5 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
                    Request Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                            Requested Quantity
                        </p>

                        <p className="font-semibold">
                            {history.requestedQuantity || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="mb-1 text-sm font-medium text-gray-500">
                            Date
                        </p>

                        <p className="font-semibold">
                            {history.date
                                ? new Date(history.date).toLocaleString()
                                : "—"}
                        </p>

                    </div>

                </div>

                {/* Message */}

                <div className="mb-8">

                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
                        Message
                    </p>

                    <div className="border rounded-xl p-4 bg-gray-50">

                        {history.message || "No message provided."}

                    </div>

                </div>

                {/* Feedback */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div>

                        <p className="mb-1 text-sm font-medium text-gray-500">
                            Rating
                        </p>

                        <p className="font-semibold">
                            {history.rating || "Not Rated"}
                        </p>

                    </div>

                    <div>

                        <p className="mb-1 text-sm font-medium text-gray-500">
                            Feedback
                        </p>

                        <p className="font-semibold">
                            {history.feedback || "No Feedback"}
                        </p>

                    </div>

                </div>

            </div>

        </div>
    );

}