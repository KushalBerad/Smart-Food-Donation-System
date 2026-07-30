import api from "./api";

export const getImpactStatistics = async () => {
    const response = await api.get("/reports");
    return response.data;
};