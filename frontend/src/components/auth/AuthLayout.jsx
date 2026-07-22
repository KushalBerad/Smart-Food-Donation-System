import Logo from "./Logo";

const AuthLayout = ({ title, subtitle, children }) => {
    return (
        <div className="min-h-screen bg-slate-100 flex items-center justify-center px-4 py-10">
            <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

                <Logo />

                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-center text-gray-800">
                        {title}
                    </h2>

                    <p className="mt-2 text-center text-gray-500">
                        {subtitle}
                    </p>
                </div>

                {children}

            </div>
        </div>
    );
};

export default AuthLayout;