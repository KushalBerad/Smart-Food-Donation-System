import api from "./api";

export const registerUser = async (payload) => {
    const response = await api.post("/auth/register", payload);
    return response.data;
};

export const loginUser = async (payload) => {
    const response = await api.post("/auth/login", payload);
    return response.data;
};

export const getProfile = async () => {
    const response = await api.get("/auth/profile");
    return response.data;
};

export const updateProfile = async (payload) => {
    const response = await api.put("/auth/profile", payload);
    return response.data;
};

export const forgotPassword = async (email) => {
    const { data } = await api.post("/auth/forgot-password", {
        email,
    });

    return data;
};

export const resetPassword = async (token, password) => {
    const { data } = await api.post(
        `/auth/reset-password/${token}`,
        {
            password,
        }
    );

    return data;
};