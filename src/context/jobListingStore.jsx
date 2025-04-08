import { create } from "zustand";

const jobStore = create((set) => ({
    jobsData: [],
    isGearModalOpen: false,
    setJobsData: (payload) => set({ jobsData: payload }),
    setIsGearModalOpen: (payload) => set({ isGearModalOpen: payload })
}));

export default jobStore;