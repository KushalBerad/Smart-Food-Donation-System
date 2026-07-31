import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Dashboard from "../pages/donor/Dashboard";
import DashboardLayout from "../layouts/DashboardLayout";
import CreateDonation from "../pages/donor/CreateDonation";
import MyDonations from "../pages/donor/MyDonations";
import ManageRequests from "../pages/donor/ManageRequests";
import DonorHistory from "../pages/donor/DonorHistory";
import Profile from "../pages/donor/Profile";

import NGODashboard from "../pages/ngo/Dashboard";
import BrowseDonations from "../pages/ngo/BrowseDonations";
import MyRequests from "../pages/ngo/MyRequests";
import NGOHistory from "../pages/ngo/History";
import NGOProfile from "../pages/ngo/Profile";
import NGODashboardLayout from "../layouts/NGODashboardLayout";


function AppRoutes() {
    return (
        <BrowserRouter>
            <Routes>
                <Route
                    path="/"
                    element={<Navigate to="/home" replace />}
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

                {/* Donor Routes */}
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
                     path="/requests"
                      element={
                        <DashboardLayout>
                        <ManageRequests />
                        </DashboardLayout>
                    }
                />
                 <Route
                    path="/history"
                     element={
                             <DashboardLayout>
                             <DonorHistory />
                            </DashboardLayout>
                             }
                 />
                <Route path="/profile" 
                        element={
                             <DashboardLayout>
                             <Profile />
                            </DashboardLayout>} 
                />

                {/* NGO Routes */}
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