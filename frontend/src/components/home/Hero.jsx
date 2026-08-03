import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function Hero() {
    const navigate = useNavigate();

    return (
        <section className="bg-gradient-to-br from-green-50 to-white">

            <div className="max-w-7xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-12 items-center">

                {/* Left */}

                <div>

                    <span className="inline-block bg-green-100 text-[#16A34A] px-4 py-2 rounded-full text-sm font-medium mb-5">
                        Reduce Food Waste • Feed More Lives
                    </span>

                    <h1 className="text-5xl font-extrabold text-gray-900 leading-tight">

                        Connecting

                        <span className="text-[#16A34A]">
                            {" "}Food Donors{" "}
                        </span>

                        with NGOs

                    </h1>

                    <p className="mt-6 text-lg text-gray-600 leading-8">

                        FoodRescue helps restaurants, event organizers and
                        individuals donate surplus food to verified NGOs,
                        reducing food waste while helping people in need.

                    </p>

                    <div className="mt-8 flex gap-4">

                        <button
                            onClick={() => navigate("/auth/register")}
                            className="bg-[#16A34A] hover:bg-green-700 text-white px-7 py-3 rounded-xl flex items-center gap-2 transition"
                        >
                            Get Started

                            <ArrowRight size={18} />

                        </button>

                        <button
                            onClick={() => navigate("/auth/login")}
                            className="border border-gray-300 hover:bg-gray-100 px-7 py-3 rounded-xl transition"
                        >
                            Login
                        </button>

                    </div>

                </div>

                {/* Right */}

                <div className="flex justify-center">

                    <img
                        src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=900"
                        alt="Food Donation"
                        className="rounded-3xl shadow-2xl object-cover h-[450px] w-full max-w-lg"
                    />

                </div>

            </div>

        </section>
    );
}