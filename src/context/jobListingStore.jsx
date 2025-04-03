import { create } from "zustand";

const jobStore = create((set) => ({
    jobsData: [],
    setJobsData: (payload) => set({ jobsData: payload })
}));

export default jobStore;