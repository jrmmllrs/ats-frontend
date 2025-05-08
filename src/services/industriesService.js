import api from "./api";

export const fetchIndustries = async (setIndustries) => {
    const { data } = await api.get(`/industries/hr`);
    setIndustries(data.data);
}

export const addIndustry = async (setIndustries, industryData) => {
    await api.post(`/industries`, industryData);
    fetchIndustries(setIndustries);
}

export const editIndustry = async (setIndustries, industryData, industryId) => {
    await api.put('/industries/'+industryId, industryData);
    fetchIndustries(setIndustries);
}