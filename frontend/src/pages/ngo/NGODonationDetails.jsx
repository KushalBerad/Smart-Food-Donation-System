import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { createDonationRequest, getDonationDetails } from "../../services/ngoService";

export default function DonationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [requestedQuantity, setRequestedQuantity] = useState("");
    const [message, setMessage] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const [donation, setDonation] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchDonation = async () => {
        try {
            setLoading(true);

            const data = await getDonationDetails(id);

            if (data.success) {
                setDonation(data.data);
            }
        } catch (err) {
            console.error(err);
            setError(
                err.response?.data?.message ||
                "Failed to load donation."
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDonation();
    }, []);

    const handleRequestDonation = async () => {
        if (!requestedQuantity.trim()) {
            alert("Please enter requested quantity.");
            return;
        }

        try {
            setSubmitting(true);

            const response = await createDonationRequest({
                donationId: id,
                requestedQuantity,
                message,
            });

            alert(response.message);

            navigate("/ngo/requests");

        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Failed to submit request."
            );

        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="flex min-h-[60vh] items-center justify-center">

                <div className="flex flex-col items-center gap-3">

                    <Loader2
                        size={32}
                        className="animate-spin text-[#16A34A]"
                    />

                    <p className="text-sm text-gray-500">
                        Loading donation details...
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
                    onClick={() => navigate("/ngo/browse")}
                    className="text-sm font-medium text-[#16A34A] transition hover:underline"
                >
                    ← Back to Browse Donations
                </button>

            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">

                <h1 className="text-2xl font-bold text-gray-900 mb-6">
                    Donation Details
                </h1>
                <p className="mb-6 text-sm text-gray-500">
                    Review donation details before submitting your request.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    <div>
                        <p className="text-sm text-gray-500">Food Name</p>
                        <p className="font-semibold">
                            {donation.foodName}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Category</p>
                        <p className="font-semibold">
                            {donation.category}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Quantity</p>
                        <p className="font-semibold">
                            {donation.quantity}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Pickup Address</p>
                        <p className="font-semibold">
                            {donation.pickupAddress}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Donor</p>
                        <p className="font-semibold">
                            {donation.donorId?.organizationName ||
                                donation.donorId?.name}
                        </p>
                    </div>

                    <div>
                        <p className="text-sm text-gray-500">Phone</p>
                        <p className="font-semibold">
                            {donation.donorId?.phone}
                        </p>
                    </div>

                </div>
                <div className="mt-10 border-t border-gray-200 pt-6">

                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                        Request this Donation
                    </h2>

                    <div className="space-y-4">

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Requested Quantity
                            </label>

                            <input
                                type="text"
                                value={requestedQuantity}
                                onChange={(e) => setRequestedQuantity(e.target.value)}
                                placeholder="Example: 20 Meals"
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                outline-none focus:border-[#16A34A]
                                focus:ring-2
                                focus:ring-[#16A34A]/10"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Message (Optional)
                            </label>

                            <textarea
                                rows={4}
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Add a note for the donor..."
                                className="w-full rounded-lg border border-gray-300 px-4 py-2 
                                outline-none focus:ring-2 focus:border-[#16A34A]
                                focus:ring-[#16A34A]/10"
                            />
                        </div>

                        <button
                            onClick={handleRequestDonation}
                            disabled={submitting}
                            className="bg-[#16A34A] hover:bg-[#15803D]
                            text-white w-full sm:w-auto px-6 py-3 rounded-lg font-semibold transition disabled:opacity-60"
                        >
                            {submitting ? "Submitting..." : "Request Donation"}
                        </button>

                    </div>

                </div>
            </div>

        </div>
    );
}