import api from "../api/axios";

export const fetchSetups = async (setSetupData) => {
    const { data } = await api.get('/setups')
    console.log(data);
    setSetupData(data.data)
}