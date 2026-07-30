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
import Reports from "../pages/donor/Reports";

// NGO Pages
import BrowseDonations from "../pages/ngo/BrowseDonations";
import NGODashboard from "../pages/ngo/Dashboard";
import DonationDetails from "../pages/ngo/DonationDetails";
import NGOHistory from "../pages/ngo/History";
import MyRequests from "../pages/ngo/MyRequests";
import NGOProfile from "../pages/ngo/Profile";
import NGOReports from "../pages/ngo/Reports";
import RequestDetails from "../pages/ngo/RequestDetails";

//Shared Pages
import HelpSupport from "../pages/shared/HelpSupport";
import Settings from "../pages/shared/Settings";

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

                <Route
                    path="/reports"
                    element={
                        <DashboardLayout>
                            <Reports />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/help-support"
                    element={
                        <DashboardLayout>
                            <HelpSupport />
                        </DashboardLayout>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <DashboardLayout>
                            <Settings />
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
                    path="/ngo/reports"
                    element={
                        <NGODashboardLayout>
                            <NGOReports />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/donation/:id"
                    element={
                        <NGODashboardLayout>
                            <DonationDetails />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/requests/:id"
                    element={
                        <NGODashboardLayout>
                            <RequestDetails />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/help-support"
                    element={
                        <NGODashboardLayout>
                            <HelpSupport />
                        </NGODashboardLayout>
                    }
                />

                <Route
                    path="/ngo/settings"
                    element={
                        <NGODashboardLayout>
                            <Settings />
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