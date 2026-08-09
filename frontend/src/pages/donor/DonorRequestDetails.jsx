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
    const [acceptQuantity, setAcceptQuantity] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        fetchRequest();
    }, [id]);

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
        const quantity = Number(acceptQuantity);

        if (!Number.isInteger(quantity) || quantity <= 0) {
            alert("Please enter a valid quantity.");
            return;
        }

        const remainingQuantity = Number(
            request?.donationId?.remainingQuantity
        );

        if (
            Number.isFinite(remainingQuantity) &&
            quantity > remainingQuantity
        ) {
            alert(
                `Cannot allocate more than ${remainingQuantity} units.`
            );
            return;
        }

        try {
            setProcessing(true);

            const response = await acceptRequest(id, quantity);

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
        <div className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6">
            <button
                type="button"
                onClick={() => navigate("/requests")}
                className="mb-5 text-sm font-semibold text-[#16A34A] transition hover:underline"
            >
                ← Back to Requests
            </button>
            <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Request Details
                        </h1>
                        <p className="mt-1 text-sm text-gray-500">
                            Review this NGO request before accepting or rejecting it.
                        </p>
                    </div>
                    <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusBadge[request?.status] || statusBadge.pending
                            }`}
                    >
                        {request?.status}
                    </span>
                </div>

                {/* Donation Information */}
                <div className="mb-8">
                    <h2 className="mb-5 border-b border-gray-100 pb-3 text-lg font-semibold text-gray-900">
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
                                {request?.donationId?.remainingQuantity ?? "—"}
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
                            <p className="text-sm text-gray-500">
                                Requested Quantity
                            </p>

                            <p className="font-semibold">
                                {request?.requestedQuantity ?? "—"}
                            </p>
                        </div>

                        <div>
                            <p className="text-sm text-gray-500">
                                Fulfill Quantity
                            </p>

                            <input
                                type="number"
                                min="1"
                                max={request?.donationId?.remainingQuantity ?? undefined}
                                step="1"
                                value={acceptQuantity}
                                onChange={(e) => setAcceptQuantity(e.target.value)}
                                disabled={request?.status !== "pending" || processing}
                                placeholder="Enter quantity"
                                className="mt-1 w-full rounded-lg border border-gray-300
        px-3 py-2 text-sm outline-none
        focus:border-[#16A34A]
        focus:ring-2 focus:ring-[#16A34A]/10
        disabled:cursor-not-allowed disabled:bg-gray-100"
                            />

                            {request?.donationId?.remainingQuantity != null && (
                                <p className="mt-1 text-xs text-gray-400">
                                    Maximum available: {request.donationId.remainingQuantity}
                                </p>
                            )}
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
                    <p className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">
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
                            className="px-5 py-2.5 rounded-xl border border-red-200 bg-red-50 text-red-600 font-semibold hover:bg-red-100 disabled:opacity-50"
                        >
                            {processing ? "Processing..." : "Reject"}
                        </button>
                        <button
                            onClick={handleAccept}
                            disabled={processing}
                            className="px-5 py-2.5 rounded-xl bg-[#16A34A] text-white font-semibold hover:bg-[#15803D] disabled:opacity-50"
                        >
                            {processing ? "Processing..." : "Accept"}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}