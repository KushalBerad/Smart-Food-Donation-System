import { ChevronRight } from "lucide-react";

export default function ActiveDonations({
    loading,
    donations,
    formatDateTime,
    onViewAll,
    onViewDonation,
}) {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <h2 className="text-lg font-semibold text-gray-900">
                    My Active Donations
                </h2>
                <button
                    type="button"
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-sm font-medium text-[#16A34A] hover:underline"
                >
                    View All
                    <ChevronRight size={16} />
                </button>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full min-w-[700px] text-sm">
                    <thead>
                        <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                            <th className="py-3">
                                Food Item
                            </th>
                            <th>
                                Quantity
                            </th>
                            <th>
                                Pickup Before
                            </th>
                            <th>
                                Requests
                            </th>
                            <th>
                                Status
                            </th>
                            <th />
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-gray-500"
                                >
                                    Loading donations...
                                </td>
                            </tr>
                        ) : donations.length === 0 ? (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="py-12 text-center text-gray-500"
                                >
                                    No active donations found.
                                </td>
                            </tr>
                        ) : (
                            donations
                                .slice(0, 3)
                                .map((donation) => (
                                    <tr
                                        key={donation._id}
                                        className="border-b border-gray-100 transition hover:bg-gray-50"
                                    >
                                        <td className="py-4">
                                            <p className="font-semibold text-gray-800">
                                                {donation.foodName}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                {donation.category}
                                            </p>
                                        </td>
                                        <td>
                                            {donation.quantity}
                                        </td>
                                        <td>
                                            {formatDateTime(
                                                donation.pickupTime
                                            )}
                                        </td>
                                        <td>
                                            {donation.requestCount ?? 0}
                                        </td>
                                        <td>
                                            <span className="inline-flex items-center rounded-full bg-[#16A34A]/10 px-3 py-1 text-xs font-medium capitalize text-[#16A34A]">
                                                {donation.status}
                                            </span>
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() => onViewDonation(donation._id)}
                                                className="rounded-lg p-2 transition hover:bg-gray-100"
                                            >
                                                <ChevronRight
                                                    size={18}
                                                    className="text-gray-500"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    );
}