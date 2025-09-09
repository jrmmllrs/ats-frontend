import api from "./api";

export const fetchAppliedSources = async (setAppliedSourceData) => {
  const { data } = await api.get(`/company/sources/all`);
  setAppliedSourceData(data);
};

export const fetchDiscoveredSources = async (setDiscoveredSourceData) => {
  const { data } = await api.get(`/company/discovered/all`);
  setDiscoveredSourceData(data);
};
