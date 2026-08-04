import AuthPanel from "./AuthPanel";
import HeroPanel from "./HeroPanel";

function AuthLayout({ children }) {
    return (
        <div
            className="
                min-h-screen
                w-full
                bg-white
                lg:grid
                lg:grid-cols-[46%_54%]
            "
        >
            {/* Left Side */}
            <HeroPanel />

            {/* Right Side */}
            <AuthPanel>
                {children}
            </AuthPanel>
        </div>
    );
}

export default AuthLayout;