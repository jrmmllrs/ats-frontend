import api from "../api/axios";

export const fetchAppliedSources = async (setAppliedSourceData) => {
  const { data } = await api.get(`/company/sources/all`);
  console.log(data);

  setAppliedSourceData(data);
};

export const fetchDiscoveredSources = async (setDiscoveredSourceData) => {
  const { data } = await api.get(`/company/discovered/all`);
  setDiscoveredSourceData(data);
};
