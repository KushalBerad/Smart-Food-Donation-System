import { CalendarDays, Clock3, Package, Users } from "lucide-react";

const statusColors = {
    available: "bg-green-100 text-green-700",
    pending: "bg-amber-100 text-amber-700",
    accepted: "bg-blue-100 text-blue-700",
    completed: "bg-gray-100 text-gray-700",
    expired: "bg-red-100 text-red-700",
};

export default function DonationStatusCard({
    donation,
    requestCount,
    formatDateTime,
}) {
    const status =
        donation?.status?.toLowerCase() || "available";

    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                        Donation Status
                    </h2>
                    <span
                        className={`mt-3 inline-flex rounded-full px-3 py-1 text-sm font-semibold capitalize ${statusColors[status] ||
                            statusColors.available
                            }`}
                    >
                        {status}
                    </span>
                </div>
                <Package
                    size={42}
                    className="text-[#16A34A]"
                />
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-3">
                <div className="flex items-center gap-3">
                    <CalendarDays
                        size={20}
                        className="text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Created On
                        </p>
                        <p className="font-medium text-gray-900">
                            {formatDateTime(
                                donation?.createdAt
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Clock3
                        size={20}
                        className="text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Pickup Before
                        </p>
                        <p className="font-medium text-gray-900">
                            {formatDateTime(
                                donation?.pickupTime
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Users
                        size={20}
                        className="text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Requests
                        </p>
                        <p className="font-medium text-gray-900">
                            {requestCount}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}