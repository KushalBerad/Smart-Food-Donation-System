import {
    Clock3,
    MapPin,
    Phone,
} from "lucide-react";

export default function PickupInformationCard({
    donation,
    formatDateTime,
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
                Pickup Information
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                    <Clock3
                        size={20}
                        className="mt-1 text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Pickup Time
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {formatDateTime(
                                donation?.pickupTime
                            )}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Phone
                        size={20}
                        className="mt-1 text-[#16A34A]"
                    />
                    {/* <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Contact Number
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {donation?.contactNumber || "—"}
                        </p>
                    </div> */}
                </div>
            </div>
            <div className="mt-8 flex items-start gap-3 rounded-xl bg-gray-50 p-4">
                <MapPin
                    size={20}
                    className="mt-1 text-[#16A34A]"
                />
                <div>
                    <p className="text-xs uppercase tracking-wide text-gray-500">
                        Pickup Address
                    </p>
                    <p className="mt-2 text-sm leading-6 text-gray-700">
                        {donation?.pickupAddress || "No pickup address provided."}
                    </p>
                </div>
            </div>
        </section>
    );
}