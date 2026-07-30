import api from "./api";

// Dashboard aggregate stats + recent data
export const getDashboardStats = async () => {
    const response = await api.get("/ngo/dashboard");
    return response.data;
};

// Browse available donations (paginated)
export const getAvailableDonations = async (params = {}) => {
    const response = await api.get("/ngo/donations", { params });
    return response.data;
};

// Submit a donation request
export const createDonationRequest = async (payload) => {
    const response = await api.post("/ngo/request", payload);
    return response.data;
};

// Get NGO's own requests (paginated)
export const getMyRequests = async (params = {}) => {
    const response = await api.get("/requests/my", { params });
    return response.data;
};

// Get NGO history (paginated)
export const getNGOHistory = async (params = {}) => {
    const response = await api.get("/ngo/history", { params });
    return response.data;
};

// Get NGO profile
export const getNGOProfile = async () => {
    const response = await api.get("/ngo/profile");
    return response.data;
};

// Update NGO profile
export const updateNGOProfile = async (payload) => {
    const response = await api.put("/ngo/profile", payload);
    return response.data;
};
