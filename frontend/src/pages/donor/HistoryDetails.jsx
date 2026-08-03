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
            <div className="flex justify-center py-20">
                <Loader2
                    size={30}
                    className="animate-spin text-[#16A34A]"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center py-20 text-red-500">
                {error}
            </div>
        );
    }

    return (
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="flex items-center justify-between mb-8">

                    <h1 className="text-3xl font-bold">
                        History Details
                    </h1>

                    <span
                        className={`px-3 py-1 rounded-full text-sm capitalize
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

                <h2 className="text-xl font-semibold mb-5">
                    Donation Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div>
                        <p className="text-gray-500 text-sm">Food Name</p>
                        <p className="font-semibold">
                            {history.donationDetails?.foodName || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Category</p>
                        <p className="font-semibold">
                            {history.donationDetails?.category || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Quantity</p>
                        <p className="font-semibold">
                            {history.donationDetails?.quantity || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">Pickup Address</p>
                        <p className="font-semibold">
                            {history.donationDetails?.pickupAddress || "—"}
                        </p>
                    </div>

                </div>

                {/* NGO */}

                <h2 className="text-xl font-semibold mb-5">
                    NGO Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div>
                        <p className="text-gray-500 text-sm">
                            Organization
                        </p>
                        <p className="font-semibold">
                            {history.ngoName || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">
                            City
                        </p>
                        <p className="font-semibold">
                            {history.ngoCity || "—"}
                        </p>
                    </div>

                </div>

                {/* Request */}

                <h2 className="text-xl font-semibold mb-5">
                    Request Information
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">

                    <div>
                        <p className="text-gray-500 text-sm">
                            Requested Quantity
                        </p>

                        <p className="font-semibold">
                            {history.requestedQuantity || "—"}
                        </p>
                    </div>

                    <div>
                        <p className="text-gray-500 text-sm">
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

                    <p className="text-gray-500 text-sm mb-2">
                        Message
                    </p>

                    <div className="border rounded-xl p-4 bg-gray-50">

                        {history.message || "No message provided."}

                    </div>

                </div>

                {/* Feedback */}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    <div>

                        <p className="text-gray-500 text-sm">
                            Rating
                        </p>

                        <p className="font-semibold">
                            {history.rating || "Not Rated"}
                        </p>

                    </div>

                    <div>

                        <p className="text-gray-500 text-sm">
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