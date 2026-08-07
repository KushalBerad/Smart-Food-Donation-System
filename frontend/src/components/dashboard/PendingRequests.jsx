import { ChevronRight } from "lucide-react";
import EmptyState from "./EmptyState";
export default function PendingRequests({
    loading,
    requests,
    formatDate,
    onViewAll,
}) {
    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between">
                <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                        Pending Requests
                    </h2>
                    <p className="mt-1 text-sm text-gray-500">
                        Latest requests awaiting your response.
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
            {loading ? (
                <div className="py-12 text-center text-gray-500">
                    Loading requests...
                </div>
            ) : requests.length === 0 ? (
                <EmptyState
                    title="No Pending Requests"
                    description="Your donations haven't received any requests yet."
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
                                    items-center
                                    justify-between
                                    rounded-xl
                                    border
                                    border-gray-100
                                    p-4
                                    transition
                                    hover:border-green-200
                                    hover:bg-green-50/30
                                "
                            >
                                <div>
                                    <h3 className="font-semibold text-gray-900">
                                        {request.ngoId?.organizationName || "N/A"}
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500">
                                        {request.donationId?.foodName || "N/A"}
                                    </p>
                                    <p className="mt-2 text-xs text-gray-400">
                                        Requested on {formatDate(request.requestedAt)}
                                    </p>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className="inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-medium capitalize text-amber-700">
                                        {request.status}
                                    </span>
                                    <button
                                        type="button"
                                        className="rounded-lg p-2 hover:bg-gray-100"
                                    >
                                        <ChevronRight
                                            size={18}
                                            className="text-gray-500"
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