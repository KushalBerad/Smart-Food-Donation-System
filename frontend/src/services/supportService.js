import api from "./api";

export const createSupportTicket = async (ticketData) => {
    const { data } = await api.post(
        "/support",
        ticketData
    );

    return data;
};

export const getMySupportTickets = async () => {
    const { data } = await api.get(
        "/support"
    );

    return data;
};