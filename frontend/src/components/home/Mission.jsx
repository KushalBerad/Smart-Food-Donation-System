import { HeartHandshake } from "lucide-react";

export default function Mission() {
    return (
        <section
            id="mission"
            className="py-24 bg-gradient-to-r from-[#16A34A] to-green-700 text-white"
        >
            <div className="max-w-5xl mx-auto px-6 text-center">

                <div className="flex justify-center mb-6">
                    <HeartHandshake size={52} />
                </div>

                <h2 className="text-4xl font-bold">
                    Our Mission
                </h2>

                <p className="mt-8 text-xl leading-9 text-green-50">

                    Every day thousands of meals are wasted while many
                    people struggle to find food.

                </p>

                <p className="mt-6 text-lg leading-8 text-green-100">

                    FoodRescue bridges the gap between food donors and
                    verified NGOs, ensuring that surplus food reaches
                    those who need it most instead of ending up as waste.

                </p>

            </div>
        </section>
    );
}