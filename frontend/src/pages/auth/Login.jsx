import { useState } from "react";
import { Link } from "react-router-dom";

import AuthButton from "../../components/auth/AuthButton";
import AuthInput from "../../components/auth/AuthInput";
import AuthLayout from "../../components/auth/AuthLayout";
import Logo from "../../components/auth/Logo";
import PasswordInput from "../../components/auth/PasswordInput";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [loading, setLoading] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = (event) => {
        event.preventDefault();

        setLoading(true);

        console.log(formData);

        setTimeout(() => {
            setLoading(false);
        }, 1000);
    };

    return (
        <AuthLayout
            title="Welcome Back"
            subtitle="Login to continue to FoodRescue"
        >
            <Logo />

            <form onSubmit={handleSubmit}>
                <AuthInput
                    label="Email Address"
                    type="email"
                    name="email"
                    value={formData.email}
                    placeholder="Enter your email"
                    onChange={handleChange}
                />

                <PasswordInput
                    label="Password"
                    name="password"
                    value={formData.password}
                    placeholder="Enter your password"
                    onChange={handleChange}
                />

                <div className="flex justify-end mb-6">
                    <Link
                        to="/forgot-password"
                        className="text-sm text-green-600 hover:underline"
                    >
                        Forgot Password?
                    </Link>
                </div>

                <AuthButton
                    type="submit"
                    loading={loading}
                >
                    Login
                </AuthButton>
            </form>

            <div className="text-center mt-8">
                <span className="text-gray-600">
                    Don't have an account?
                </span>

                <Link
                    to="/register"
                    className="ml-2 font-semibold text-green-600 hover:underline"
                >
                    Register
                </Link>
            </div>
        </AuthLayout>
    );
};

export default Login;