import api from "../api/axios";

export const fetchIndustries = async (setIndustries) => {
    const { data } = await api.get(`/industries/hr`);
    setIndustries(data.data);
}