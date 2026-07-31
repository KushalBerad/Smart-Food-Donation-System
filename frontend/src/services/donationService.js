import axios from "axios";

const API_URL = "http://localhost:5000/api/v1/donations";

export const getDonorHistory = async (
  type = "all",
  page = 1,
  limit = 10
) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/history`,
    {
      params: {
        type,
        page,
        limit,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const getHistoryById = async (id) => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/history/${id}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};