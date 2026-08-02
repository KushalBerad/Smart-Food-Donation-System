import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    acceptRequest,
    getRequestDetails,
    rejectRequest,
} from "../../services/donorService";

const statusBadge = {
    pending: "bg-amber-50 text-amber-600 border border-amber-200",
    accepted: "bg-green-50 text-green-600 border border-green-200",
    rejected: "bg-red-50 text-red-600 border border-red-200",
    completed: "bg-blue-50 text-blue-600 border border-blue-200",
    cancelled: "bg-gray-100 text-gray-500 border border-gray-200",
};

function formatDate(date) {
    if (!date) return "—";

    return new Date(date).toLocaleString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    });
}

export default function RequestDetails() {

    const { id } = useParams();
    const navigate = useNavigate();

    const [request, setRequest] = useState(null);

    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);

    const [error, setError] = useState("");

    useEffect(() => {
        fetchRequest();
    }, []);

    const fetchRequest = async () => {

        try {

            setLoading(true);
            setError("");

            const data = await getRequestDetails(id);

            if (data.success) {
                setRequest(data.data);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load request."
            );

        } finally {

            setLoading(false);

        }
    };

    const handleAccept = async () => {

        try {

            setProcessing(true);

            const response = await acceptRequest(id);

            alert(response.message);

            navigate("/requests");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to accept request."
            );

        } finally {

            setProcessing(false);

        }
    };

    const handleReject = async () => {

        try {

            setProcessing(true);

            const response = await rejectRequest(id);

            alert(response.message);

            navigate("/requests");

        } catch (err) {

            alert(
                err.response?.data?.message ||
                "Failed to reject request."
            );

        } finally {

            setProcessing(false);

        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <Loader2
                    size={32}
                    className="animate-spin text-[#16A34A]"
                />
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 text-center text-red-500">
                {error}
            </div>
        );
    }

        return (
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <div className="flex items-center justify-between mb-6">

                    <h1 className="text-2xl font-bold text-gray-900">
                        Request Details
                    </h1>

                    <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${
                            statusBadge[request?.status] || statusBadge.pending
                        }`}
                    >
                        {request?.status}
                    </span>

                </div>

                {/* Donation Information */}

                <div className="mb-8">

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Donation Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">Food Name</p>
                            <p className="font-semibold">
                                {request?.donationId?.foodName || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Category</p>
                            <p className="font-semibold">
                                {request?.donationId?.category || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Available Quantity</p>
                            <p className="font-semibold">
                                {request?.donationId?.quantity || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Pickup Address</p>
                            <p className="font-semibold">
                                {request?.donationId?.pickupAddress || "—"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* NGO Information */}

                <div className="mb-8">

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        NGO Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">Organization</p>
                            <p className="font-semibold">
                                {request?.ngoId?.organizationName || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Contact Person</p>
                            <p className="font-semibold">
                                {request?.ngoId?.contactPerson || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-semibold">
                                {request?.ngoId?.phone || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold">
                                {request?.ngoId?.email || "—"}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Request Information */}

                <div className="mb-8">

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Request Information
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                        <div>
                            <p className="text-sm text-gray-500">Requested Quantity</p>
                            <p className="font-semibold">
                                {request?.requestedQuantity || "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">Requested On</p>
                            <p className="font-semibold">
                                {formatDate(request?.requestedAt)}
                            </p>
                        </div>

                    </div>

                </div>

                {/* Message */}

                <div className="mb-8">

                    <p className="text-sm text-gray-500 mb-2">
                        Message
                    </p>

                    <div className="rounded-xl bg-gray-50 border border-gray-200 p-4">

                        {request?.message?.trim()
                            ? request.message
                            : "No message provided."}

                    </div>

                </div>

                {/* Action Buttons */}

                {request?.status === "pending" && (

                    <div className="flex justify-end gap-3 pt-6 border-t border-gray-200">

                        <button
                            onClick={handleReject}
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-medium hover:bg-red-100 disabled:opacity-50"
                        >
                            {processing ? "Processing..." : "Reject"}
                        </button>

                        <button
                            onClick={handleAccept}
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white font-medium hover:bg-[#15803D] disabled:opacity-50"
                        >
                            {processing ? "Processing..." : "Accept"}
                        </button>

                    </div>

                )}

            </div>

        </div>
    );
}