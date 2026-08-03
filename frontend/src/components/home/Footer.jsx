export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300">

            <div className="max-w-7xl mx-auto px-6 py-14 grid md:grid-cols-3 gap-10">

                {/* Brand */}

                <div>

                    <h2 className="text-2xl font-bold text-white">
                        FoodRescue
                    </h2>

                    <p className="mt-4 leading-7 text-gray-400">
                        Connecting food donors with NGOs to reduce food
                        waste and help communities.
                    </p>

                </div>

                {/* Links */}

                <div>

                    <h3 className="font-semibold text-white mb-4">
                        Quick Links
                    </h3>

                    <ul className="space-y-3">

                        <li>
                            <a href="#features" className="hover:text-white">
                                Features
                            </a>
                        </li>

                        <li>
                            <a href="#how" className="hover:text-white">
                                How It Works
                            </a>
                        </li>

                        <li>
                            <a href="#mission" className="hover:text-white">
                                Mission
                            </a>
                        </li>

                    </ul>

                </div>

                {/* Contact */}

                <div>

                    <h3 className="font-semibold text-white mb-4">
                        Contact
                    </h3>

                    <p>support@foodrescue.com</p>

                    <p className="mt-2">
                        +91 98765 43210
                    </p>

                </div>

            </div>

            <div className="border-t border-gray-800 py-5 text-center text-sm text-gray-500">

                © {new Date().getFullYear()} FoodRescue.
                All rights reserved.

            </div>

        </footer>
    );
}