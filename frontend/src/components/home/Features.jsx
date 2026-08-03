import {
    BarChart3,
    Bell,
    Clock,
    MapPinned,
    ShieldCheck,
    Users,
} from "lucide-react";

const features = [
    {
        icon: ShieldCheck,
        title: "Verified NGOs",
    },
    {
        icon: Bell,
        title: "Real-Time Notifications",
    },
    {
        icon: MapPinned,
        title: "Location Based Donations",
    },
    {
        icon: BarChart3,
        title: "Impact Reports",
    },
    {
        icon: Clock,
        title: "Quick Request Approval",
    },
    {
        icon: Users,
        title: "Community Driven",
    },
];

export default function Features() {
    return (
        <section
            id="features"
            className="py-20 bg-white"
        >
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">
                    Features
                </h2>

                <p className="text-center text-gray-500 mt-3 mb-12">
                    Everything needed to make food donation simple and transparent.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                    {features.map((feature) => {
                        const Icon = feature.icon;

                        return (
                            <div
                                key={feature.title}
                                className="border rounded-2xl p-8 hover:shadow-lg transition"
                            >
                                <Icon
                                    size={34}
                                    className="text-[#16A34A]"
                                />

                                <h3 className="mt-5 text-xl font-semibold">
                                    {feature.title}
                                </h3>
                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}