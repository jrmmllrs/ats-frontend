import api from "../api/axios";

export const fetchSetups = async (setSetupData) => {
    const { data } = await api.get('/setups')
    setSetupData(data.data)
}

export const addSetup = async (setSetupData, setupData) => {
    await api.post('/setups', setupData);
    fetchSetups(setSetupData);
}