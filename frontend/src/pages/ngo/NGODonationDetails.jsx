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
    }, [id]);

    const handleRequestDonation = async () => {
        const quantity = Number(requestedQuantity);

        if (!Number.isInteger(quantity) || quantity < 1) {
            alert("Please enter a valid quantity.");
            return;
        }

        if (quantity > (donation.remainingQuantity ?? 0)) {
            alert(
                `Only ${donation.remainingQuantity ?? 0} meal(s) are currently available.`
            );
            return;
        }

        try {
            setSubmitting(true);

            const response = await createDonationRequest({
                donationId: id,
                requestedQuantity: quantity,
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
                        <p className="text-sm text-gray-500">Available Quantity</p>

                        <p className="font-semibold">
                            {donation.remainingQuantity ?? 0} remaining
                        </p>

                        <p className="text-xs text-gray-400">
                            Original quantity: {donation.quantity}
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
                    {(donation.remainingQuantity ?? 0) > 0 ? (
                        <>
                            <h2 className="mb-4 text-lg font-semibold text-gray-900">
                                Request this Donation
                            </h2>

                            <div className="space-y-4">
                                <div>
                                    <label
                                        htmlFor="requestedQuantity"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Requested Quantity
                                    </label>

                                    <input
                                        id="requestedQuantity"
                                        type="number"
                                        min="1"
                                        max={donation.remainingQuantity}
                                        step="1"
                                        value={requestedQuantity}
                                        onChange={(e) =>
                                            setRequestedQuantity(e.target.value)
                                        }
                                        placeholder="Enter number of meals"
                                        disabled={submitting}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2
                        outline-none transition
                        focus:border-[#16A34A]
                        focus:ring-2 focus:ring-[#16A34A]/10
                        disabled:cursor-not-allowed disabled:bg-gray-100"
                                    />

                                    <p className="mt-1.5 text-xs text-gray-500">
                                        Available: {donation.remainingQuantity} meal(s)
                                    </p>
                                </div>

                                <div>
                                    <label
                                        htmlFor="requestMessage"
                                        className="mb-2 block text-sm font-medium text-gray-700"
                                    >
                                        Message (Optional)
                                    </label>

                                    <textarea
                                        id="requestMessage"
                                        rows={4}
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        placeholder="Add a note for the donor..."
                                        disabled={submitting}
                                        className="w-full rounded-lg border border-gray-300 px-4 py-2
                        outline-none transition
                        focus:border-[#16A34A]
                        focus:ring-2 focus:ring-[#16A34A]/10
                        disabled:cursor-not-allowed disabled:bg-gray-100"
                                    />
                                </div>

                                <button
                                    type="button"
                                    onClick={handleRequestDonation}
                                    disabled={submitting || !donation.remainingQuantity}
                                    className="w-full rounded-lg bg-[#16A34A] px-6 py-3
                    font-semibold text-white transition
                    hover:bg-[#15803D]
                    disabled:cursor-not-allowed disabled:opacity-60
                    sm:w-auto"
                                >
                                    {submitting ? "Submitting..." : "Request Donation"}
                                </button>
                            </div>
                        </>
                    ) : (
                        <div className="rounded-xl border border-gray-200 bg-gray-50 p-4">
                            <h2 className="text-lg font-semibold text-gray-900">
                                Donation No Longer Available
                            </h2>

                            <p className="mt-1 text-sm text-gray-500">
                                All available food from this donation has already been
                                allocated.
                            </p>
                        </div>
                    )}
                </div>
            </div>

        </div>
    );
}