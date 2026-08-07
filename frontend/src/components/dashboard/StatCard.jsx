const colorMap = {
    blue: "bg-blue-50 text-blue-600",
    amber: "bg-amber-50 text-amber-600",
    emerald: "bg-[#16A34A]/10 text-[#16A34A]",
    violet: "bg-violet-50 text-violet-600",
};

export default function StatCard({
    label,
    value,
    icon: Icon,
    color,
    loading,
}) {
    return (
        <div
            className="
                rounded-2xl
                border
                border-gray-100
                bg-white
                p-5
                shadow-sm
                transition-shadow
                hover:shadow-md
            "
        >
            <div className="flex items-center justify-between">

                <div>

                    <p className="text-sm font-medium text-gray-500">
                        {label}
                    </p>

                    {loading ? (

                        <div
                            className="
                                mt-3
                                h-8
                                w-16
                                animate-pulse
                                rounded
                                bg-gray-200
                            "
                        />

                    ) : (

                        <h2 className="mt-2 text-3xl font-bold text-gray-900">
                            {value}
                        </h2>

                    )}

                </div>

                <div
                    className={`
                        flex
                        h-12
                        w-12
                        items-center
                        justify-center
                        rounded-xl
                        ${colorMap[color]}
                    `}
                >
                    <Icon size={22} />
                </div>

            </div>
        </div>
    );
}