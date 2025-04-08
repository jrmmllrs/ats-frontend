import api from "../api/axios";

export const fetchJobs = async (setJobsData) => {
    const { data } = await api.get(`/jobs`);
    setJobsData(data.data);
}

export const fetchIndustriesCount = async (setIndustriesCount) => {
    const { data } = await api.get(`/jobs/industries/count`);
    setIndustriesCount(data.data.count);
}

export const fetchOpenJobsCount = async (setOpenJobsCount) => {
    const { data } = await api.get(`/jobs/open/count`);
    setOpenJobsCount(data.data.count);
}

export const fetchCloseJobsCount = async (setCloseJobsCount) => {
    const { data } = await api.get(`/jobs/close/count`);
    setCloseJobsCount(data.data.count);
}

export const searchJobs = async (searchVal, setJobsData) => {
    if (searchVal != ""){
        const { data } = await api.get(`/jobs/search/${searchVal}`);
        setJobsData(data.data);
    }
    else {
        fetchJobs(setJobsData);
    }
}

export const getCloseJobs = async (setJobsData) => {
    const { data } = await api.get(`/jobs/close`);
    setJobsData(data.data);
} 

export const getOpenJobs = async (setJobsData) => {
    const { data } = await api.get(`/jobs/open`);
    setJobsData(data.data);
}