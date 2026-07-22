import { Navigate, Route, Routes } from "react-router-dom";

import DonorRegister from "../pages/auth/DonorRegister";
import ForgotPassword from "../pages/auth/ForgotPassword";
import Login from "../pages/auth/Login";
import NgoRegister from "../pages/auth/NgoRegister";
import Register from "../pages/auth/Register";

const AppRoutes = () => {
    return (
        <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />

            <Route path="/login" element={<Login />} />

            <Route path="/register" element={<Register />} />

            <Route path="/register/donor" element={<DonorRegister />} />

            <Route path="/register/ngo" element={<NgoRegister />} />

            <Route
                path="/forgot-password"
                element={<ForgotPassword />}
            />
        </Routes>
    );
};

export default AppRoutes;