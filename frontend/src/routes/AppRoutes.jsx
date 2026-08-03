import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import NGODashboardLayout from "../layouts/NGODashboardLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Home from "../pages/public/Home";

// Donor Pages
import CreateDonation from "../pages/donor/CreateDonation";
import Dashboard from "../pages/donor/Dashboard";
import History from "../pages/donor/DonorHistory";
import Profile from "../pages/donor/DonorProfile";
import DonorHistoryDetails from "../pages/donor/HistoryDetails";
import MyDonations from "../pages/donor/MyDonations";
import Reports from "../pages/donor/Reports";
import DonorRequestDetails from "../pages/donor/RequestDetails";
import Requests from "../pages/donor/Requests";

// NGO Pages
import BrowseDonations from "../pages/ngo/BrowseDonations";
import NGODashboard from "../pages/ngo/Dashboard";
import DonationDetails from "../pages/ngo/DonationDetails";
import NGOHistory from "../pages/ngo/History";
import MyRequests from "../pages/ngo/MyRequests";
import NGOProfile from "../pages/ngo/Profile";
import NGOReports from "../pages/ngo/Reports";
import NGORequestDetails from "../pages/ngo/RequestDetails";

//Shared Pages
import HelpSupport from "../pages/shared/HelpSupport";
import Notifications from "../pages/shared/Notifications";
import Settings from "../pages/shared/Settings";

function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>

                <Route
                    path="/"
                    element={<Home />}
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
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <Dashboard />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/create-donation"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <CreateDonation />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/my-donations"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <MyDonations />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/donations/:id"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonationDetails />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/requests"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <Requests />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/requests/:id"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonorRequestDetails />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/reports"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <Reports />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <History />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history/:id"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonorHistoryDetails />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <Profile />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/help-support"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <HelpSupport />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/settings"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <Settings />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/notifications"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <Notifications />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                {/* ================= NGO ================= */}

                <Route
                    path="/ngo/dashboard"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <NGODashboard />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/browse"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <BrowseDonations />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/requests"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <MyRequests />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/history"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <NGOHistory />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/notifications"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <Notifications />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/profile"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <NGOProfile />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/reports"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <NGOReports />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/donation/:id"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <DonationDetails />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/requests/:id"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <NGORequestDetails />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/help-support"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <HelpSupport />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/ngo/settings"
                    element={
                        <ProtectedRoute role="ngo">
                            <NGODashboardLayout>
                                <Settings />
                            </NGODashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="*"
                    element={<Navigate to="/" replace />}
                />


            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;