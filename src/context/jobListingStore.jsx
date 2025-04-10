import { create } from "zustand";

const jobStore = create((set) => ({
    jobsData: [],
    isGearModalOpen: false,
    activeTab: null,
    setActiveTab: (payload) => set({ activeTab: payload }),
    setJobsData: (payload) => set({ jobsData: payload }),
    setIsGearModalOpen: (payload) => set({ isGearModalOpen: payload })
}));

export default jobStore;