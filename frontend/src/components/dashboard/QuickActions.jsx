import {
    Clock3,
    FolderOpen,
    PlusCircle,
} from "lucide-react";

export default function QuickActions({
    onCreateDonation,
    onMyDonations,
    onHistory,
}) {
    const actions = [
        {
            title: "Create Donation",
            description: "Donate surplus food",
            icon: PlusCircle,
            onClick: onCreateDonation,
            color: "bg-green-50 text-green-600",
        },
        {
            title: "My Donations",
            description: "View active donations",
            icon: FolderOpen,
            onClick: onMyDonations,
            color: "bg-blue-50 text-blue-600",
        },
        {
            title: "History",
            description: "Completed donations",
            icon: Clock3,
            onClick: onHistory,
            color: "bg-violet-50 text-violet-600",
        },
    ];

    return (
        <section className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">

            <div className="mb-5">
                <h2 className="text-lg font-semibold text-gray-900">
                    Quick Actions
                </h2>

                <p className="mt-1 text-sm text-gray-500">
                    Frequently used shortcuts.
                </p>
            </div>

            <div className="grid gap-4 md:grid-cols-3">

                {actions.map(
                    ({
                        title,
                        description,
                        icon: Icon,
                        onClick,
                        color,
                    }) => (
                        <button
                            key={title}
                            type="button"
                            onClick={onClick}
                            className="
                                flex
                                items-center
                                gap-4
                                rounded-xl
                                border
                                border-gray-100
                                p-4
                                text-left
                                transition-all
                                hover:border-green-200
                                hover:shadow-sm
                            "
                        >
                            <div
                                className={`
                                    flex
                                    h-12
                                    w-12
                                    items-center
                                    justify-center
                                    rounded-xl
                                    ${color}
                                `}
                            >
                                <Icon size={22} />
                            </div>

                            <div>
                                <h3 className="font-semibold text-gray-900">
                                    {title}
                                </h3>

                                <p className="text-sm text-gray-500">
                                    {description}
                                </p>
                            </div>
                        </button>
                    )
                )}

            </div>

        </section>
    );
}