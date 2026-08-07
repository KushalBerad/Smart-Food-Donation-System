import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DonationStatusTracker from "../../components/dashboard/DonationStatusTracker";
import DonationActions from "../../components/donation/DonationActions";
import DonationRequests from "../../components/donation/DonationRequests";
import DonationStatusCard from "../../components/donation/DonationStatusCard";
import FoodInformationCard from "../../components/donation/FoodInformationCard";
import PickupInformationCard from "../../components/donation/PickupInformationCard";

import {
    getDonationById,
    getDonationRequests,
} from "../../services/donationService";

export default function DonationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [donation, setDonation] = useState(null);
    const [requests, setRequests] = useState([]);

    const formatDateTime = (date) => {
        if (!date) return "—";

        return new Date(date).toLocaleString(
            "en-IN",
            {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "numeric",
                minute: "2-digit",
            }
        );
    };
    useEffect(() => {
        const fetchDonationDetails = async () => {
            try {
                setLoading(true);
                setError("");

                const [
                    donationResponse,
                    requestsResponse,
                ] = await Promise.all([
                    getDonationById(id),
                    getDonationRequests(id),
                ]);

                setDonation(
                    donationResponse.data
                );

                setRequests(
                    requestsResponse.data || []
                );

            } catch (err) {
                console.error(err);

                setError(
                    err.response?.data?.message ||
                    "Failed to load donation details."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchDonationDetails();
    }, [id]);

    // const handleEdit = (donation) => {
    //     navigate(
    //         `/edit-donation/${donation._id}`
    //     );
    // };

    const handleDelete = (donation) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this donation?"
        );

        if (!confirmed) return;

        console.log(
            "Delete Donation:",
            donation._id
        );
    };

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <p className="text-gray-500">
                    Loading donation details...
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <div className="rounded-2xl bg-white p-8 shadow">

                    <p className="font-medium text-red-600">
                        {error}
                    </p>

                </div>

            </div>
        );
    }

    if (!donation) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-gray-50">

                <p className="text-gray-500">
                    Donation not found.
                </p>

            </div>
        );
    }
    return (
        <div className="min-h-screen bg-gray-50 p-4 sm:p-6">

            <div className="mx-auto max-w-7xl space-y-6">

                <button
                    type="button"
                    onClick={() => navigate("/my-donations")}
                    className="text-sm font-medium text-[#16A34A] transition hover:underline"
                >
                    ← Back to My Donations
                </button>

                <DonationStatusCard
                    donation={donation}
                    requestCount={requests.length}
                    formatDateTime={formatDateTime}
                />

                <DonationStatusTracker
                    status={donation?.status}
                />

                <FoodInformationCard
                    donation={donation}
                />

                <PickupInformationCard
                    donation={donation}
                    formatDateTime={formatDateTime}
                />

                <DonationRequests
                    requests={requests}
                    formatDateTime={formatDateTime}
                    onViewAll={() =>
                        navigate("/requests")
                    }
                    onViewRequest={(requestId) =>
                        navigate(
                            `/requests/${requestId}`
                        )
                    }
                />

                <DonationActions
                    donation={donation}
                    // onEdit={handleEdit}
                    onDelete={handleDelete}
                />

            </div>

        </div>
    );
}