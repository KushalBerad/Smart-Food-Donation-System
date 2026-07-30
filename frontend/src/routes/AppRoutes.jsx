import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";

import DashboardLayout from "../layouts/DashboardLayout";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import CreateDonation from "../pages/donor/CreateDonation";
import Dashboard from "../pages/donor/Dashboard";
import MyDonations from "../pages/donor/MyDonations";

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
                    path="*"
                    element={<Navigate to="/auth/login" replace />}
                />
            </Routes>
        </BrowserRouter>
    );
}

export default AppRoutes;