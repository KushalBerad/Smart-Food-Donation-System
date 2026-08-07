import {
    FileText,
    Package,
    Tag,
    UtensilsCrossed,
} from "lucide-react";

export default function FoodInformationCard({
    donation,
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
                Food Information
            </h2>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
                <div className="flex items-start gap-3">
                    <Package
                        size={20}
                        className="mt-1 text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Food Name
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {donation?.foodName || "—"}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Tag
                        size={20}
                        className="mt-1 text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Category
                        </p>
                        <p className="mt-1 font-medium capitalize text-gray-900">
                            {donation?.category || "—"}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <UtensilsCrossed
                        size={20}
                        className="mt-1 text-[#16A34A]"
                    />
                    <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Quantity
                        </p>
                        <p className="mt-1 font-medium text-gray-900">
                            {donation?.quantity || "—"}
                        </p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <FileText
                        size={20}
                        className="mt-1 text-[#16A34A]"
                    />
                    {/* <div>
                        <p className="text-xs uppercase tracking-wide text-gray-500">
                            Meal Type
                        </p>
                        <p className="mt-1 font-medium capitalize text-gray-900">
                            {donation?.mealType || "—"}
                        </p>
                    </div> */}
                </div>
            </div>
            <div className="mt-8 rounded-xl bg-gray-50 p-4">
                <p className="text-xs uppercase tracking-wide text-gray-500">
                    Description
                </p>
                <p className="mt-2 text-sm leading-6 text-gray-700">
                    {donation?.description ||
                        "No description provided."}
                </p>
            </div>
        </section>
    );
}