import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { getRequestDetails } from "../../services/ngoService";

const statusBadge = {
    pending: "bg-amber-50 text-amber-600",
    accepted: "bg-green-50 text-green-600",
    rejected: "bg-red-50 text-red-600",
    completed: "bg-emerald-50 text-emerald-700 border border-emerald-200",
};

export default function RequestDetails() {
    const { id } = useParams();

    const [request, setRequest] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchRequest = async () => {
        try {
            setLoading(true);

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

    useEffect(() => {
        fetchRequest();
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
                        Loading request details...
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

            <div className="mb-5">

                <button
                    onClick={() => window.history.back()}
                    className="text-sm font-medium text-[#16A34A] transition hover:underline"
                >
                    ← Back to My Requests
                </button>

            </div>

            <div className="bg-white rounded-2xl 
            shadow-sm border border-gray-100 p-6 sm:p-8">

                <h1 className="text-2xl font-bold mb-6">
                    Request Details
                </h1>
                <p className="mb-6 text-sm text-gray-500">
                    Review the details and current status of your donation request.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-gray-500">
                            Food Name
                        </p>

                        <p className="font-semibold">
                            {request.donationId?.foodName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Quantity Requested
                        </p>

                        <p className="font-semibold">
                            {request.requestedQuantity}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            NGO
                        </p>

                        <p className="font-semibold">
                            {request.ngoId?.organizationName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Phone
                        </p>

                        <p className="font-semibold">
                            {request.ngoId?.phone}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Status
                        </p>

                        <span
                            className={`inline-flex px-3 py-1 rounded-full text-sm font-medium capitalize ${statusBadge[request.status]}`}
                        >
                            {request.status}
                        </span>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">
                            Requested On
                        </p>

                        <p className="font-semibold">
                            {new Date(request.requestedAt).toLocaleString("en-IN", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                                hour: "numeric",
                                minute: "2-digit",
                                hour12: true,
                            })}
                        </p>
                    </div>

                </div>

                <div className="mt-8">

                    <p className="text-sm text-gray-500 mb-2">
                        Message
                    </p>

                    <div className="min-h-[100px] rounded-xl border border-gray-200 
                                    bg-gray-50 p-4 text-sm text-gray-700">
                        {request.message || "No message provided."}
                    </div>

                </div>

            </div>

        </div>
    );
}