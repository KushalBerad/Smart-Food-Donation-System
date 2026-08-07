import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getImpactStatistics } from "../../services/reportService";

export default function Reports() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {

            setLoading(true);

            const response = await getImpactStatistics();

            if (response.success) {
                setStats(response.data);
            }

        } catch (err) {

            console.error(err);

            setError(
                err.response?.data?.message ||
                "Failed to load impact statistics."
            );

        } finally {
            setLoading(false);
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
                        Loading impact statistics...
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

    const cards = [
        {
            title: "Total Donations",
            value: stats.totalDonations,
        },
        {
            title: "Meals Donated",
            value: stats.totalMealsDonated,
        },
        {
            title: "Completed Donations",
            value: stats.completedDonations,
        },
        {
            title: "Pending Donations",
            value: stats.pendingDonations,
        },
        {
            title: "Accepted Requests",
            value: stats.acceptedRequests,
        },
        {
            title: "Rejected Requests",
            value: stats.rejectedRequests,
        },
    ];

    return (
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Reports & Impact
                </h1>

                <p className="text-sm text-gray-500 mt-1">
                    Check your overall donation contribution and community impact.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-5">

                {cards.map((card) => (

                    <div
                        key={card.title}
                        className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 transition hover:shadow-md"
                    >

                        <p className="text-sm font-medium text-gray-500">
                            {card.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-[#16A34A]">
                            {card.value}
                        </h2>

                    </div>

                ))}

            </div>

        </div>
    );
}