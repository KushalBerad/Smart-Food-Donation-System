import { ChevronRight, Package } from "lucide-react";

import EmptyState from "./EmptyState";

export default function AvailableDonations({
    donations,
    onViewAll,
    onViewDonation,
    formatDate,
}) {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Available Donations
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Newly available food donations near your NGO.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onViewAll}
                    className="flex items-center gap-1 text-sm font-medium text-[#16A34A] hover:underline"
                >
                    View All
                    <ChevronRight size={16} />
                </button>
            </div>
            {donations.length === 0 ? (
                <EmptyState
                    title="No Available Donations"
                    description="There are no food donations available at the moment."
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[760px] text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="py-3">
                                    Food
                                </th>
                                <th>
                                    Donor
                                </th>
                                <th>
                                    Quantity
                                </th>
                                <th>
                                    City
                                </th>
                                <th>
                                    Pickup Before
                                </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {donations
                                .slice(0, 3)
                                .map((donation) => (
                                    <tr
                                        key={donation._id}
                                        className="border-b border-gray-100 hover:bg-gray-50 transition"
                                    >
                                        <td className="py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-amber-50">
                                                    <Package
                                                        size={16}
                                                        className="text-amber-500"
                                                    />
                                                </div>
                                                <span className="font-medium text-gray-900">
                                                    {donation.foodName}
                                                </span>
                                            </div>
                                        </td>
                                        <td>
                                            {donation.donor?.organizationName}
                                        </td>
                                        <td>
                                            {donation.quantity}
                                        </td>
                                        <td>
                                            {donation.donor?.city}
                                        </td>
                                        <td>
                                            {formatDate(donation.expiryAt)}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewDonation(
                                                        donation._id
                                                    )
                                                }
                                                className="rounded-lg p-2 hover:bg-gray-100"
                                            >
                                                <ChevronRight
                                                    size={18}
                                                    className="text-gray-500"
                                                />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                        </tbody>
                    </table>
                </div>
            )}
        </section>
    );
}