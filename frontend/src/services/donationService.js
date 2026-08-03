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