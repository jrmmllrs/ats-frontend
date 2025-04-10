import api from "../api/axios";

export const fetchIndustries = async (setIndustries) => {
    const { data } = await api.get(`/industries/hr`);
    setIndustries(data.data);
}

export const addIndustry = async (setIndustries, industryData) => {
    await api.post(`/industries`, industryData);
    fetchIndustries(setIndustries);
}