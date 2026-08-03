import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
    children,
    role,
}) {
    const token = localStorage.getItem("token");

    let user;

    try {
        user = JSON.parse(
            localStorage.getItem("user") || "{}"
        );
    } catch {
        localStorage.removeItem("user");
        localStorage.removeItem("token");

        return (
            <Navigate
                to="/auth/login"
                replace
            />
        );
    }

    if (!token) {
        return (
            <Navigate
                to="/auth/login"
                replace
            />
        );
    }

    if (role && user.role !== role) {
        return (
            <Navigate
                to="/"
                replace
            />
        );
    }

    return children;
}