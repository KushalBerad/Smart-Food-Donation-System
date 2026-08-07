import {
    ChevronRight,
    Users,
} from "lucide-react";

import EmptyState from "../dashboard/EmptyState";

const statusColors = {
    pending:
        "bg-amber-100 text-amber-700",
    accepted:
        "bg-green-100 text-green-700",
    rejected:
        "bg-red-100 text-red-700",
    completed:
        "bg-blue-100 text-blue-700",
};

export default function DonationRequests({
    requests,
    onViewRequest,
    onViewAll,
    formatDateTime,
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        NGO Requests
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        NGOs interested in this donation.
                    </p>
                </div>
                {requests.length > 3 && (
                    <button
                        type="button"
                        onClick={onViewAll}
                        className="text-sm font-medium text-[#16A34A] hover:underline"
                    >
                        View All
                    </button>
                )}
            </div>
            {requests.length === 0 ? (
                <EmptyState
                    title="No Requests Yet"
                    description="No NGO has requested this donation yet."
                />
            ) : (
                <div className="space-y-4">
                    {requests
                        .slice(0, 3)
                        .map((request) => (
                            <div
                                key={request._id}
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    rounded-xl
                                    border
                                    border-gray-200
                                    p-5
                                    md:flex-row
                                    md:items-center
                                    md:justify-between
                                "
                            >
                                <div className="flex items-center gap-4">
                                    <div
                                        className="
                                            flex
                                            h-11
                                            w-11
                                            items-center
                                            justify-center
                                            rounded-full
                                            bg-green-100
                                        "
                                    >
                                        <Users
                                            size={20}
                                            className="text-[#16A34A]"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900">
                                            {request.ngo?.organizationName ||
                                                "NGO"}
                                        </h3>
                                        <p className="mt-1 text-sm text-gray-500">
                                            Requested on{" "}
                                            {formatDateTime(
                                                request.createdAt
                                            )}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-semibold capitalize ${statusColors[
                                            request.status
                                            ] ||
                                            statusColors.pending
                                            }`}
                                    >
                                        {request.status}
                                    </span>
                                    <button
                                        type="button"
                                        onClick={() =>
                                            onViewRequest(
                                                request._id
                                            )
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-lg
                                            border
                                            border-[#16A34A]
                                            px-4
                                            py-2
                                            text-sm
                                            font-medium
                                            text-[#16A34A]
                                            transition
                                            hover:bg-[#16A34A]
                                            hover:text-white
                                        "
                                    >
                                        View
                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>
                                </div>
                            </div>
                        ))}
                </div>
            )}
        </section>
    );
}