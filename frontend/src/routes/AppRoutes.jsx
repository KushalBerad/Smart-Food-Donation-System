import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ProtectedRoute from "../components/auth/ProtectedRoute";
import DashboardLayout from "../layouts/DashboardLayout";
import NGODashboardLayout from "../layouts/NGODashboardLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ResetPassword from "../pages/auth/ResetPassword";
import Home from "../pages/public/Home";

// Donor Pages
import CreateDonation from "../pages/donor/CreateDonation";
import DonorDashboard from "../pages/donor/DonorDashboard";
import DonorDonationDetails from "../pages/donor/DonorDonationDetails";
import DonorHistory from "../pages/donor/DonorHistory";
import DonorHistoryDetails from "../pages/donor/DonorHistoryDetails";
import DonorProfile from "../pages/donor/DonorProfile";
import DonorReports from "../pages/donor/DonorReports";
import DonorRequestDetails from "../pages/donor/DonorRequestDetails";
import DonorRequests from "../pages/donor/DonorRequests";
import MyDonations from "../pages/donor/MyDonations";

// NGO Pages
import BrowseDonations from "../pages/ngo/BrowseDonations";
import MyRequests from "../pages/ngo/MyRequests";
import NGODashboard from "../pages/ngo/NGODashboard";
import NGODonationDetails from "../pages/ngo/NGODonationDetails";
import NGOHistory from "../pages/ngo/NGOHistory";
import NGOProfile from "../pages/ngo/NGOProfile";
import NGOReports from "../pages/ngo/NGOReports";
import NGORequestDetails from "../pages/ngo/NGORequestDetails";

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

                <Route
                    path="/reset-password/:token"
                    element={<ResetPassword />}
                />

                {/* ================= Donor ================= */}

                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonorDashboard />
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
                    path="/edit-donation/:id"
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
                                <DonorDonationDetails />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/donor-donations/:id"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonorDonationDetails />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/requests"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonorRequests />
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
                                <DonorReports />
                            </DashboardLayout>
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/history"
                    element={
                        <ProtectedRoute role="donor">
                            <DashboardLayout>
                                <DonorHistory />
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
                                <DonorProfile />
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
                                <NGODonationDetails />
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