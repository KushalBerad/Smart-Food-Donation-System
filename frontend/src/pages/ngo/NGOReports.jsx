import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getImpactStatistics } from "../../services/reportService";

export default function NGOReports() {

    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const fetchStatistics = async () => {
        try {

            setLoading(true);
            const response = await getImpactStatistics();

            if (response.success) {
                setStats(response.data);
            }

        } catch (err) {

            setError(
                err.response?.data?.message ||
                "Failed to load reports."
            );

        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStatistics();
    }, []);


    if (loading) {
        return (
            <div className="flex flex-col items-center gap-3">

                <Loader2
                    size={28}
                    className="animate-spin text-[#16A34A]"
                />

                <p className="text-sm text-gray-500">
                    Loading reports...
                </p>

            </div>
        );
    }

    if (error) {
        return (
            <div className="text-center text-red-500 p-6">
                {error}
            </div>
        );
    }

    const cards = [
        {
            title: "Total Requests",
            value: stats.totalRequests,
        },
        {
            title: "Meals Received",
            value: stats.totalMealsReceived,
        },
        {
            title: "Completed Requests",
            value: stats.completedRequests,
        },
        {
            title: "Pending Requests",
            value: stats.pendingRequests,
        },
        {
            title: "Accepted Requests",
            value: stats.acceptedRequests,
        },
        {
            title: "Rejected Requests",
            value: stats.rejectedRequests,
        },
        {
            title: "Donations Interacted",
            value: stats.totalDonationsInteracted,
        },
    ];

    return (
        <div className="flex-1 min-h-screen bg-gray-50 p-4 sm:p-6">

            <div className="space-y-6">

                {/* Header */}

                <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

                    <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                        Reports &amp; Impact
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Monitor your organization's donation requests and overall impact.
                    </p>

                </div>

                {/* Statistics */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">

                    {cards.map((card) => (

                        <div
                            key={card.title}
                            className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition hover:shadow-md"
                        >

                            <p className="text-sm text-gray-500">
                                {card.title}
                            </p>

                            <h2 className="mt-2 text-3xl font-bold text-[#16A34A]">
                                {card.value}
                            </h2>

                        </div>

                    ))}

                </div>

            </div>

        </div>
    );
}