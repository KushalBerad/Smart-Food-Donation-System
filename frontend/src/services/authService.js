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