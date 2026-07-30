import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

import { getImpactStatistics } from "../../services/reportService";

export default function NGOReports() {

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

            setError(
                err.response?.data?.message ||
                "Failed to load reports."
            );

        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <Loader2 className="animate-spin text-green-600" size={32} />
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
        <div className="flex-1 p-4 sm:p-6 bg-gray-50 min-h-screen">

            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Reports & Impact
                </h1>

                <p className="text-sm text-gray-500">
                    Track your NGO impact.
                </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

                {cards.map((card) => (

                    <div
                        key={card.title}
                        className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6"
                    >

                        <p className="text-sm text-gray-500">
                            {card.title}
                        </p>

                        <h2 className="mt-2 text-3xl font-bold text-green-600">
                            {card.value}
                        </h2>

                    </div>

                ))}

            </div>

        </div>
    );
}