import { Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../services/api";

export default function MyDonations() {
    const navigate = useNavigate();

    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchDonations = async () => {
        try {
            const { data } = await api.get("/donations/my-donations");
            setDonations(data.data || []);
        } catch (error) {
            console.error("Failed to fetch donations:", error);
        } finally {
            setLoading(false);
        }
    };
        useEffect(() => {
        fetchDonations();
    }, []);

    if (loading) {
        return (
            <div className="p-6">
                <h1 className="text-xl font-semibold">Loading donations...</h1>
            </div>
        );
    }

    return (
        <div className="p-6 bg-gray-50 min-h-screen">
            <h1 className="text-2xl font-bold text-gray-900 mb-6">
                My Donations
            </h1>
            <div className="bg-white rounded-xl shadow border overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-100">
                        <tr>
                            <th className="text-left p-4">Food</th>
                            <th className="text-left p-4">Category</th>
                            <th className="text-left p-4">Quantity</th>
                            <th className="text-left p-4">Pickup Time</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-center p-4">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {donations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan="6"
                                    className="text-center py-8 text-gray-500"
                                >
                                    No donations found.
                                </td>
                            </tr>
                        ) : (
                            donations.map((donation) => (
                                <tr
                                    key={donation._id}
                                    className="border-t"
                                >
                                    <td className="p-4">
                                        {donation.foodName}
                                    </td>
                                    <td className="p-4">
                                        {donation.category}
                                    </td>
                                    <td className="p-4">
                                        {donation.quantity}
                                    </td>
                                    <td className="p-4">
                                        {new Date(donation.pickupTime).toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        {donation.status}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button
                                            onClick={() =>
                                                navigate(`/donations/${donation._id}`)
                                            }
                                            className="text-green-600 hover:text-green-700"
                                        >
                                            <Eye size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}