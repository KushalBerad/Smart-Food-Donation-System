import { ChevronRight } from "lucide-react";

import EmptyState from "./EmptyState";

const statusBadge = {
    accepted:
        "bg-[#16A34A]/10 text-[#16A34A] border border-[#16A34A]/20",
    pending:
        "bg-amber-50 text-amber-600 border border-amber-200",
    rejected:
        "bg-red-50 text-red-600 border border-red-200",
    completed:
        "bg-blue-50 text-blue-600 border border-blue-200",
    cancelled:
        "bg-gray-100 text-gray-500 border border-gray-200",
};

export default function NGORequests({
    requests,
    formatPickupTime,
    onViewAll,
    onViewRequest,
}) {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        My Requests
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Latest requests submitted by your NGO.
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
            {requests.length === 0 ? (
                <EmptyState
                    title="No Requests Yet"
                    description="Browse available donations and submit your first request."
                />
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full min-w-[720px] text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 text-left text-xs font-semibold uppercase tracking-wide text-gray-500">
                                <th className="py-3">
                                    Donation
                                </th>
                                <th>
                                    Donor
                                </th>
                                <th>
                                    Status
                                </th>
                                <th>
                                    Pickup
                                </th>
                                <th />
                            </tr>
                        </thead>
                        <tbody>
                            {requests
                                .slice(0, 3)
                                .map((request) => (
                                    <tr
                                        key={request._id}
                                        className="border-b border-gray-100 transition hover:bg-gray-50"
                                    >
                                        <td className="py-4">
                                            <p className="font-medium text-gray-900">
                                                {request.donation?.foodName}
                                            </p>
                                        </td>
                                        <td>
                                            {request.donor?.organizationName}
                                        </td>
                                        <td>
                                            <span
                                                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-medium capitalize ${statusBadge[
                                                    request.status
                                                    ] ||
                                                    statusBadge.pending
                                                    }`}
                                            >
                                                {request.status}
                                            </span>
                                        </td>
                                        <td>
                                            {request.status ===
                                                "accepted" ||
                                                request.status ===
                                                "completed"
                                                ? formatPickupTime(
                                                    request.donation
                                                        ?.pickupTime
                                                )
                                                : "—"}
                                        </td>
                                        <td>
                                            <button
                                                type="button"
                                                onClick={() =>
                                                    onViewRequest(
                                                        request._id
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