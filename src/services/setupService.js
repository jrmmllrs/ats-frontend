import api from "./api";

export const fetchSetups = async (setSetupData) => {
  const { data } = await api.get("/setups");
  setSetupData(data.data);
};

export const addSetup = async (setSetupData, setupData) => {
  await api.post("/setups", setupData);
  fetchSetups(setSetupData);
};

export const editSetup = async (setSetupData, setupData, setupId) => {
  await api.put("/setups/" + setupId, setupData);
  fetchSetups(setSetupData);
};
