import {
    Eye,
    MapPin,
    PlusCircle,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";
// import { formatDateTime } from "../../utils/dateUtils";

export default function MyDonations() {
    const navigate = useNavigate();

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;
        const loadDonations = async () => {
            try {
                setLoading(true);
                const { data } = await api.get(
                    "/donations/my-donations"
                );
                if (mounted) {
                    setDonations(data.data || []);
                }
            } catch (error) {
                console.error(
                    "Failed to fetch donations:",
                    error
                );
            } finally {
                if (mounted) {
                    setLoading(false);
                }
            }
        };
        loadDonations();
        return () => {
            mounted = false;
        };
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-[#16A34A] border-t-transparent rounded-full animate-spin mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">
                        Loading donations...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6">
            {/* Header */}
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-900">
                        My Donations
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        View and manage all donations you've created.
                    </p>
                </div>

                <button
                    onClick={() => navigate("/create-donation")}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#16A34A] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#15803D]"
                >
                    <PlusCircle size={18} />
                    Create Donation
                </button>
            </div>

            {donations.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-white p-12 text-center">
                    <h2 className="text-lg font-semibold text-gray-800">
                        No Donations Yet
                    </h2>

                    <p className="mt-2 text-sm text-gray-500">
                        Create your first food donation to help NGOs.
                    </p>
                </div>
            ) : (
                <div className="grid gap-5">
                    {donations.map((donation) => (
                        <div
                            key={donation._id}
                            className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >

                            {/* Top Row */}
                            <div className="flex flex-wrap items-center justify-between gap-6">

                                <div>
                                    <p className="text-xs uppercase text-gray-500">Food</p>
                                    <p className="font-semibold text-lg">
                                        {donation.foodName}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-500">Quantity</p>
                                    <p className="font-semibold">
                                        {donation.quantity}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-500">Category</p>
                                    <p className="font-semibold capitalize">
                                        {donation.category}
                                    </p>
                                </div>

                                <div>
                                    <p className="text-xs uppercase text-gray-500">Pickup Time</p>
                                    <p className="font-semibold">
                                        {new Date(donation.pickupTime).toLocaleString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                            hour: "numeric",
                                            minute: "2-digit",
                                            hour12: true,
                                        })}
                                    </p>
                                </div>

                                <div>
                                    <span
                                        className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${donation.status === "accepted"
                                            ? "bg-green-100 text-green-700"
                                            : "bg-yellow-100 text-yellow-700"
                                            }`}
                                    >
                                        {donation.status.charAt(0).toUpperCase() +
                                            donation.status.slice(1)}
                                    </span>
                                </div>

                                <button
                                    onClick={() => navigate(`/donations/${donation._id}`)}
                                    className="inline-flex items-center gap-2 rounded-xl border border-[#16A34A]
                                                px-4 py-2 text-sm font-semibold text-[#16A34A]
                                                hover:bg-[#16A34A] hover:text-white transition"
                                >
                                    <Eye size={18} />
                                    View Details
                                </button>

                            </div>

                            {/* Address */}
                            <div className="mt-5 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                                <MapPin
                                    size={18}
                                    className="mt-0.5 text-[#16A34A]"
                                />
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                                        Pickup Address
                                    </p>
                                    <p className="mt-1 text-sm font-medium text-gray-800">
                                        {donation.pickupAddress}
                                    </p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}