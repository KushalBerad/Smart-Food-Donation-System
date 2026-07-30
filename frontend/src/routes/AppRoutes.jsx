import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import NGODashboardLayout from "../layouts/NGODashboardLayout";

import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

// Donor Pages
import CreateDonation from "../pages/donor/CreateDonation";
import Dashboard from "../pages/donor/Dashboard";
import MyDonations from "../pages/donor/MyDonations";

// NGO Pages
import BrowseDonations from "../pages/ngo/BrowseDonations";
import NGODashboard from "../pages/ngo/Dashboard";
import NGOHistory from "../pages/ngo/History";
import MyRequests from "../pages/ngo/MyRequests";
import NGOProfile from "../pages/ngo/Profile";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Navigate to="/auth/login" replace />}
                />

                <Route
                    path="/auth/register"
                    element={<Register />}
                />

                <Route
                    path="/auth/login"
                    element={<Login />}
                />

                <Route
                    path="/auth/forgot-password"
                    element={<ForgotPassword />}
                />

                {/* ================= Donor ================= */}

                <Route
                    path="/dashboard"
                    element={
                        <DashboardLayout>
                            <Dashboard />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/create-donation"
                    element={
                        <DashboardLayout>
                            <CreateDonation />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/my-donations"
                    element={
                        <DashboardLayout>
                            <MyDonations />
                        </DashboardLayout>
                    }
                />

                {/* ================= NGO ================= */}

                <Route
                    path="/ngo/dashboard"
                    element={
                        <NGODashboardLayout>
                            <NGODashboard />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/browse"
                    element={
                        <NGODashboardLayout>
                            <BrowseDonations />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/requests"
                    element={
                        <NGODashboardLayout>
                            <MyRequests />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/history"
                    element={
                        <NGODashboardLayout>
                            <NGOHistory />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/profile"
                    element={
                        <NGODashboardLayout>
                            <NGOProfile />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/auth/login" replace />}
                />

            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;