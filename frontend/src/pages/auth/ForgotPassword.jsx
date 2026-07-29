import { Mail } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import Logo from "../../components/auth/Logo";

import {
    BORDER,
    GREEN,
    GREEN_DARK,
    PAGE_BG,
    TEXT_DARK,
    TEXT_MUTED,
} from "../../utils/constants";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);

    const gradientStyle = {
        backgroundImage: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
    };

    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        setError("");

        if (!email.trim()) {
            setError("Email is required");
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!emailRegex.test(email)) {
            setError("Enter a valid email address");
            return;
        }

        // Backend API will be connected later
        setSubmitted(true);
    };

    return (
        <AuthLayout
            pageBg={PAGE_BG}
            border={BORDER}
        >
            <Logo
                title="FoodRescue"
                subtitle="Share Food, Help People"
                gradientStyle={gradientStyle}
                textDark={TEXT_DARK}
                textMuted={TEXT_MUTED}
            />

            <h1
                className="text-center text-[22px] font-bold mt-2"
                style={{ color: TEXT_DARK }}
            >
                Forgot Password
            </h1>

            <p
                className="text-center text-[13px] mt-2 mb-6"
                style={{ color: TEXT_MUTED }}
            >
                Enter your registered email address.
            </p>

            {submitted ? (
                <div className="space-y-5">
                    <div className="rounded-lg border border-green-300 bg-green-50 p-4 text-center text-green-700">
                        Password reset link sent successfully.
                    </div>

                    <Link
                        to="/auth/login"
                        className="block text-center font-semibold"
                        style={{ color: GREEN }}
                    >
                        Back to Login
                    </Link>
                </div>
            ) : (
                <form
                    onSubmit={handleSubmit}
                    className="space-y-5"
                >
                    <div>
                        <label
                            className="block text-[13px] font-semibold mb-2"
                            style={{ color: TEXT_DARK }}
                        >
                            Email Address
                        </label>

                        <AuthInput
                            Icon={Mail}
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            hasError={!!error}
                            required
                        />
                        {error && (
                            <p className="text-red-500 text-xs mt-2">
                                {error}
                            </p>
                        )}
                    </div>

                    <AuthButton
                        type="submit"
                        style={gradientStyle}
                    >
                        Send Reset Link
                    </AuthButton>

                    <div className="text-center">
                        <Link
                            to="/auth/login"
                            className="font-semibold"
                            style={{ color: GREEN }}
                        >
                            Back to Login
                        </Link>
                    </div>
                </form>
            )}
        </AuthLayout>
    );
}