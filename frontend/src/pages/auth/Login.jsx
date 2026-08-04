import { Lock, Mail } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import AuthAlert from "../../components/auth/AuthAlert";
import AuthButton from "../../components/auth/AuthButton";
import AuthFooter from "../../components/auth/AuthFooter";
import AuthHeader from "../../components/auth/AuthHeader";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import PasswordInput from "../../components/auth/PasswordInput";

import {
    GREEN,
    GREEN_DARK,
    TEXT_DARK,
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
        }
        else if (!validateEmail(formData.email)) {
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
                email: formData.email.trim().toLowerCase(),
                password: formData.password,
            });

            if (!response.success) {
                throw new Error(response.message);
            }

            localStorage.setItem(
                "token",
                response.token
            );

            localStorage.setItem(
                "user",
                JSON.stringify(response.data)
            );

            if (response.data.role === "ngo") {
                navigate("/ngo/dashboard", {
                    replace: true,
                });
            }
            else {
                navigate("/dashboard", {
                    replace: true,
                });
            }

        }
        catch (error) {

            setServerError(
                error.response?.data?.message ||
                error.message ||
                "Login failed"
            );

        }
        finally {
            setLoading(false);
        }

    };

    return (

        <AuthLayout>

            <AuthHeader
                title="Welcome Back"
                subtitle="Login to your FoodRescue account."
            />

            <AuthAlert
                type="error"
                message={serverError}
            />

            <form
                onSubmit={handleSubmit}
                className="space-y-6"
            >

                {/* Email */}

                <div>

                    <label
                        className="mb-2 block text-sm font-semibold"
                        style={{
                            color: TEXT_DARK,
                        }}
                    >
                        Email Address
                    </label>

                    <AuthInput
                        Icon={Mail}
                        type="email"
                        placeholder="Enter your email"
                        value={formData.email}
                        onChange={(e) =>
                            handleChange(
                                "email",
                                e.target.value
                            )
                        }
                        hasError={!!errors.email}
                    />

                    {errors.email && (

                        <p className="mt-2 text-xs text-red-500">
                            {errors.email}
                        </p>

                    )}

                </div>

                {/* Password */}

                <div>

                    <label
                        className="mb-2 block text-sm font-semibold"
                        style={{
                            color: TEXT_DARK,
                        }}
                    >
                        Password
                    </label>

                    <PasswordInput
                        Icon={Lock}
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={(e) =>
                            handleChange(
                                "password",
                                e.target.value
                            )
                        }
                        hasError={!!errors.password}
                        showPassword={showPassword}
                        onToggle={() =>
                            setShowPassword((prev) => !prev)
                        }
                    />

                    {errors.password && (

                        <p className="mt-2 text-xs text-red-500">
                            {errors.password}
                        </p>

                    )}

                </div>

                {/* Forgot Password */}

                <div className="flex justify-end">

                    <Link
                        to="/auth/forgot-password"
                        className="text-sm font-semibold hover:underline"
                        style={{
                            color: GREEN,
                        }}
                    >
                        Forgot Password?
                    </Link>

                </div>

                {/* Login Button */}

                <AuthButton
                    type="submit"
                    disabled={loading}
                    style={gradientStyle}
                >
                    {loading
                        ? "Logging in..."
                        : "Login"}
                </AuthButton>

            </form>

            <AuthFooter
                question="New to FoodRescue?"
                linkText="Create an account"
                linkTo="/auth/register"
            />

        </AuthLayout>

    );

}