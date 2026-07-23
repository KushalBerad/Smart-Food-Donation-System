import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import Logo from "../../components/auth/Logo";
import PasswordInput from "../../components/auth/PasswordInput";

import {
    BORDER,
    GREEN,
    GREEN_DARK,
    PAGE_BG,
    TEXT_DARK,
    TEXT_MUTED,
} from "../../utils/constants";

import { loginUser } from "../../services/authService";
import { validateEmail } from "../../utils/validators";

export default function Login() {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const gradientStyle = {
        backgroundImage: `linear-gradient(135deg, ${GREEN}, ${GREEN_DARK})`,
    };

    const handleChange = (name, value) => {
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

        if (errors[name]) {
            setErrors((prev) => ({
                ...prev,
                [name]: null,
            }));
        }

        if (serverError) {
            setServerError("");
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.email.trim()) {
            newErrors.email = "Email is required";
        } else if (!validateEmail(formData.email)) {
            newErrors.email = "Enter a valid email";
        }

        if (!formData.password.trim()) {
            newErrors.password = "Password is required";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            setLoading(true);
            setServerError("");

            const response = await loginUser({
                email: formData.email,
                password: formData.password,
            });

            if (!response.success) {
                throw new Error(response.message);
            }

            localStorage.setItem("token", response.token);
            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

            navigate("/dashboard");

        } catch (error) {
            setServerError(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );
        } finally {
            setLoading(false);
        }
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
                className="text-center text-[22px] font-bold mt-2 mb-1"
                style={{ color: TEXT_DARK }}
            >
                Welcome Back
            </h1>

            <p
                className="text-center text-[13px] mb-6"
                style={{ color: TEXT_MUTED }}
            >
                Login to your account
            </p>

            {serverError && (
                <div className="mb-4 rounded-lg border border-red-500 bg-red-100 px-3 py-2 text-sm text-red-700">
                    {serverError}
                </div>
            )}

            <form
                onSubmit={handleSubmit}
                className="space-y-4"
            >
                <div>
                    <label
                        className="text-[13px] font-semibold mb-1.5 block"
                        style={{ color: TEXT_DARK }}
                    >
                        Email Address
                    </label>

                    <AuthInput
                        Icon={Mail}
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                            handleChange("email", e.target.value)
                        }
                        hasError={!!errors.email}
                    />

                    {errors.email && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div>
                    <label
                        className="text-[13px] font-semibold mb-1.5 block"
                        style={{ color: TEXT_DARK }}
                    >
                        Password
                    </label>

                    <PasswordInput
                        Icon={Lock}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                            handleChange("password", e.target.value)
                        }
                        hasError={!!errors.password}
                        showPassword={showPassword}
                        onToggle={() =>
                            setShowPassword((prev) => !prev)
                        }
                    />

                    {errors.password && (
                        <p className="text-red-500 text-xs mt-1">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="flex justify-end">
                    <Link
                        to="/auth/forgot-password"
                        className="text-sm font-medium"
                        style={{ color: GREEN }}
                    >
                        Forgot Password?
                    </Link>
                </div>

                <AuthButton
                    type="submit"
                    disabled={loading}
                    style={gradientStyle}
                >
                    {loading ? "Logging in..." : "Login"}
                </AuthButton>
            </form>

            <div
                className="text-center text-[13px] mt-5"
                style={{ color: TEXT_MUTED }}
            >
                Don't have an account?{" "}
                <Link
                    to="/auth/register"
                    className="font-semibold"
                    style={{ color: GREEN }}
                >
                    Register
                </Link>
            </div>
        </AuthLayout>
    );
}