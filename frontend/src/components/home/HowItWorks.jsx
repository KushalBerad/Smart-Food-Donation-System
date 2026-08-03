import {
    CheckCircle,
    Handshake,
    Package,
    UserPlus,
} from "lucide-react";

const steps = [
    {
        icon: UserPlus,
        title: "Register",
        description:
            "Create a donor or NGO account in a few minutes.",
    },
    {
        icon: Package,
        title: "Create Donation",
        description:
            "Donors post surplus food with quantity and pickup details.",
    },
    {
        icon: Handshake,
        title: "NGO Requests",
        description:
            "Verified NGOs browse and request available donations.",
    },
    {
        icon: CheckCircle,
        title: "Pickup & Delivery",
        description:
            "Donation is collected and marked as completed.",
    },
];

export default function HowItWorks() {
    return (
        <section
            id="how"
            className="py-20 bg-gray-50"
        >
            <div className="max-w-7xl mx-auto px-6">

                <h2 className="text-4xl font-bold text-center">
                    How It Works
                </h2>

                <p className="text-center text-gray-500 mt-3 mb-12">
                    A simple process that connects donors and NGOs.
                </p>

                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">

                    {steps.map((step) => {
                        const Icon = step.icon;

                        return (
                            <div
                                key={step.title}
                                className="bg-white rounded-2xl p-8 shadow-sm text-center"
                            >
                                <div className="w-14 h-14 rounded-full bg-green-100 mx-auto flex items-center justify-center">
                                    <Icon
                                        size={28}
                                        className="text-[#16A34A]"
                                    />
                                </div>

                                <h3 className="mt-5 font-semibold text-xl">
                                    {step.title}
                                </h3>

                                <p className="mt-3 text-gray-600">
                                    {step.description}
                                </p>
                            </div>
                        );
                    })}

                </div>

            </div>
        </section>
    );
}