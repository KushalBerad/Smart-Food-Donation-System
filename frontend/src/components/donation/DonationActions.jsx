import {
    Pencil,
    Trash2,
} from "lucide-react";

export default function DonationActions({
    donation,
    onEdit,
    onDelete,
}) {
    return (
        <section className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-semibold text-gray-900">
                Donation Actions
            </h2>
            <p className="mt-1 text-sm text-gray-500">
                Manage this donation using the available actions.
            </p>
            <div className="mt-6 flex flex-col gap-4 sm:flex-row">
                <button
                    type="button"
                    onClick={() => onEdit(donation)}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-[#16A34A]
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-[#16A34A]
                        transition
                        hover:bg-[#16A34A]
                        hover:text-white
                    "
                >
                    <Pencil size={18} />
                    Edit Donation
                </button>
                <button
                    type="button"
                    onClick={() => onDelete(donation)}
                    className="
                        inline-flex
                        items-center
                        justify-center
                        gap-2
                        rounded-xl
                        border
                        border-red-500
                        px-5
                        py-3
                        text-sm
                        font-semibold
                        text-red-600
                        transition
                        hover:bg-red-500
                        hover:text-white
                    "
                >
                    <Trash2 size={18} />
                    Delete Donation
                </button>
            </div>
        </section>
    );
}