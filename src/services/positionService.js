import api from "./api";

export const getPositions = async () => {
  try {
    const response = await api.get(`/company/positions/all`);
    return response.data.positions;
  } catch (error) {
    console.error("Error fetching positions:", error);
    return [];
  }
};
