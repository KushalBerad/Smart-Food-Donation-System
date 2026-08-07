import { Inbox } from "lucide-react";

export default function EmptyState({
    title = "Nothing to show",
    description = "There is no data available.",
}) {
    return (
        <div
            className="
        flex
        min-h-[170px]
        flex-col
        items-center
        justify-center
        rounded-2xl
        border
        border-dashed
        border-gray-200
        bg-gray-50
        px-8
        py-10
        text-center
    "
        >
            <div
                className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-full
                    bg-green-100
                "
            >
                <Inbox
                    size={22}
                    className="text-[#16A34A]"
                />
            </div>
            <h3 className="mt-4 text-lg font-semibold text-gray-900">
                {title}
            </h3>
            <p className="mt-1.5 max-w-sm text-sm leading-6 text-gray-500">
                {description}
            </p>
        </div>
    );
}
