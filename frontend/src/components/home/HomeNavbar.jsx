import { useNavigate } from "react-router-dom";
import foodDonationIcon from "../../assets/food_donation_icon.png";

export default function HomeNavbar() {

    const navigate = useNavigate();

    return (

        <nav className="sticky top-0 z-50 bg-white border-b border-gray-100">

            <div className="max-w-7xl mx-auto h-16 px-6 flex items-center justify-between">

                <button
                    className="flex items-center gap-3"
                    onClick={() => navigate("/")}
                >

                    <img
                        src={foodDonationIcon}
                        alt="Food Rescue"
                        className="w-12 h-12 object-contain"
                    />

                    <div>

                        <h1 className="font-bold text-lg">
                            FoodRescue
                        </h1>

                        <p className="text-xs text-gray-500">
                            Share Food, Help People
                        </p>

                    </div>

                </button>

                <div className="hidden md:flex items-center gap-8">

                    <a href="#features" className="text-gray-600 hover:text-[#16A34A]">
                        Features
                    </a>

                    <a href="#how" className="text-gray-600 hover:text-[#16A34A]">
                        How It Works
                    </a>

                    <a href="#mission" className="text-gray-600 hover:text-[#16A34A]">
                        Mission
                    </a>

                </div>

                <div className="flex gap-3">

                    <button
                        onClick={() => navigate("/auth/login")}
                        className="px-5 py-2 rounded-xl border border-gray-300 hover:bg-gray-50"
                    >
                        Login
                    </button>

                    <button
                        onClick={() => navigate("/auth/register")}
                        className="px-5 py-2 rounded-xl bg-[#16A34A] text-white hover:bg-green-700"
                    >
                        Register
                    </button>

                </div>

            </div>

        </nav>

    );

}