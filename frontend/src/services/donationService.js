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

export const createDonation = async (data) => {
  const token = localStorage.getItem("token");

  const res = await axios.post(`${API_URL}/create`, data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
};
export const getMyDonations = async (
  status = "",
  page = 1,
  limit = 20
) => {

  const token = localStorage.getItem("token");

  const response = await axios.get(
    `${API_URL}/my-donations`,
    {
      params: {
        status,
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

export const getPendingRequests = async () => {
  const token = localStorage.getItem("token");

  const response = await axios.get(
    "http://localhost:5000/api/v1/donations/requests",
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};

export const respondToRequest = async (id, action) => {
  const token = localStorage.getItem("token");

  const url =
    action === "accept"
      ? `http://localhost:5000/api/v1/donations/requests/${id}/accept`
      : `http://localhost:5000/api/v1/donations/requests/${id}/reject`;

  const response = await axios.patch(
    url,
    {},
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    }
  );

  return response.data;
};