import { Mail } from "lucide-react";
import { useState } from "react";

import AuthAlert from "../../components/auth/AuthAlert";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";

import { forgotPassword } from "../../services/authService";

import {
    GREEN,
    GREEN_DARK,
    TEXT_DARK,
} from "../../utils/constants";

import { validateEmail } from "../../utils/validators";

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [submitted, setSubmitted] =
        useState(false);
    const [error, setError] =
        useState("");
    const gradientStyle = {
        backgroundImage:
            `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        if (!email.trim()) {
            setError("Email is required.");
            return;
        }
        if (!validateEmail(email)) {
            setError(
                "Enter a valid email address."
            );
            return;
        }
        try {
            setLoading(true);
            await forgotPassword(
                email.trim()
            );
            setSubmitted(true);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                "Unable to send reset link."
            );
        } finally {
            setLoading(false);
        }
    };
    return (
        <AuthLayout>
            <AuthHeader
                title="Forgot Password"
                subtitle="Enter your registered email address to receive a password reset link."
            />
            {submitted ? (
                <>
                    <AuthAlert
                        type="success"
                        message="Password reset link has been sent to your email."
                    />
                    <div className="mt-10">
                        <AuthButton
                            type="button"
                            style={gradientStyle}
                            onClick={() =>
                                window.location.assign("/auth/login")
                            }
                        >
                            Back to Login
                        </AuthButton>
                    </div>
                </>
            ) : (
                <>
                    <AuthAlert
                        type="error"
                        message={error}
                    />
                    <form
                        onSubmit={handleSubmit}
                        className="
                        mt-8
                        space-y-6
                    "
                    >
                        <div>
                            <label
                                className="
                                block
                                mb-2
                                text-sm
                                font-semibold
                            "
                                style={{
                                    color: TEXT_DARK,
                                }}
                            >
                                Email Address
                            </label>
                            <AuthInput
                                Icon={Mail}
                                type="email"
                                placeholder="Enter your registered email"
                                value={email}
                                onChange={(e) =>
                                    setEmail(
                                        e.target.value
                                    )
                                }
                                hasError={!!error}
                            />
                        </div>
                        <AuthButton
                            type="submit"
                            disabled={loading}
                            style={gradientStyle}
                        >
                            {loading
                                ? "Sending..."
                                : "Send Reset Link"}
                        </AuthButton>
                    </form>
                </>
            )}
            <AuthFooter
                question="Remember your password?"
                linkText="Back to Login"
                linkTo="/auth/login"
            />
        </AuthLayout>
    );
}