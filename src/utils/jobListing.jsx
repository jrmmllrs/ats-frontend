import api from "../api/axios";

export const fetchJobs = async (setJobsData) => {
    const { data } = await api.get(`/jobs`);
    setJobsData(data.data);
}