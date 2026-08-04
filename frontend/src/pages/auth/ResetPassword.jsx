import { Lock } from "lucide-react";
import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import AuthAlert from "../../components/auth/AuthAlert";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";

import { resetPassword } from "../../services/authService";

import {
    GREEN,
    GREEN_DARK,
    TEXT_DARK,
} from "../../utils/constants";

export default function ResetPassword() {

    const navigate = useNavigate();

    const { token } = useParams();

    const [password, setPassword] =
        useState("");

    const [
        confirmPassword,
        setConfirmPassword,
    ] = useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState(false);

    const [
        showPassword,
        setShowPassword,
    ] = useState(false);

    const [
        showConfirmPassword,
        setShowConfirmPassword,
    ] = useState(false);

    const gradientStyle = {
        backgroundImage:
            `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
    };
    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        if (!password.trim()) {
            setError("Password is required.");
            return;
        }

        if (password.length < 6) {
            setError(
                "Password must be at least 6 characters."
            );
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        try {

            setLoading(true);

            await resetPassword(
                token,
                password
            );

            setSuccess(true);

            setTimeout(() => {

                navigate(
                    "/auth/login",
                    {
                        replace: true,
                    }
                );

            }, 2000);

        } catch (error) {

            setError(

                error.response?.data?.message ||

                "Unable to reset password."

            );

        } finally {

            setLoading(false);

        }

    };

    return (

        <AuthLayout>

            <AuthHeader
                title="Reset Password"
                subtitle="Create a new secure password for your account."
            />

            {success ? (

                <AuthAlert
                    type="success"
                    message="Password reset successfully. Redirecting to login..."
                />

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
                                New Password
                            </label>

                            <PasswordInput
                                Icon={Lock}
                                placeholder="Enter new password"
                                value={password}
                                onChange={(e) =>
                                    setPassword(
                                        e.target.value
                                    )
                                }
                                hasError={!!error}
                                showPassword={showPassword}
                                onToggle={() =>
                                    setShowPassword(
                                        (prev) => !prev
                                    )
                                }
                            />

                        </div>

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
                                Confirm Password
                            </label>

                            <PasswordInput
                                Icon={Lock}
                                placeholder="Confirm new password"
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(
                                        e.target.value
                                    )
                                }
                                hasError={!!error}
                                showPassword={
                                    showConfirmPassword
                                }
                                onToggle={() =>
                                    setShowConfirmPassword(
                                        (prev) => !prev
                                    )
                                }
                            />

                        </div>

                        <AuthButton
                            type="submit"
                            style={gradientStyle}
                            disabled={loading}
                        >
                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"}
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