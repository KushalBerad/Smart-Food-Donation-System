import api from "./api";

// Get all pending requests for donor
export const getPendingRequests = async (params = {}) => {
    const response = await api.get("/donations/requests", {
        params,
    });

    return response.data;
};

// Get request details
export const getRequestDetails = async (id) => {
    const response = await api.get(`/donations/requests/${id}`);

    return response.data;
};

// Accept NGO request
export const acceptRequest = async (id) => {
    const response = await api.patch(
        `/donations/requests/${id}/accept`
    );

    return response.data;
};

// Reject NGO request
export const rejectRequest = async (id) => {
    const response = await api.patch(
        `/donations/requests/${id}/reject`
    );

    return response.data;
};
