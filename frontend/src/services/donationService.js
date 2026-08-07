import api from "./api";

/* ---------------- Donations ---------------- */

export const getMyDonations = async (
    status = "",
    page = 1,
    limit = 10
) => {
    const response = await api.get("/donations/my-donations", {
        params: {
            status,
            page,
            limit,
        },
    });

    return response.data;
};

/* ---------------- History ---------------- */

export const getDonorHistory = async (
    type = "all",
    page = 1,
    limit = 10
) => {
    const response = await api.get("/donations/history", {
        params: {
            type,
            page,
            limit,
        },
    });

    return response.data;
};

export const getHistoryById = async (id) => {
    const response = await api.get(
        `/donations/history/${id}`
    );

    return response.data;
};

/* ---------------- Create Donation ---------------- */

export const createDonation = async (data) => {
    const response = await api.post(
        "/donations/create",
        data
    );

    return response.data;
};

/* ---------------- Donation Details ---------------- */

export const getDonationById = async (id) => {
    const response = await api.get(
        `/donations/${id}`
    );

    return response.data;
};

export const getDonationRequests = async (id) => {
    const response = await api.get(
        `/donations/${id}/requests`
    );

    return response.data;
};

/* ---------------- Donation Actions ---------------- */

export const completeDonation = async (id) => {
    const response = await api.patch(
        `/donations/${id}/complete`
    );

    return response.data;
};

export const updateDonationStatus = async (
    id,
    status
) => {
    const response = await api.patch(
        `/donations/${id}/status`,
        { status }
    );

    return response.data;
};
