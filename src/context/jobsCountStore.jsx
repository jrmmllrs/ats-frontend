import { create } from "zustand";

const JobCountStore = create((set) => ({
    industriesCount: 0,
    openJobsCount: 0,
    closeJobsCount: 0,
    setIndustriesCount: (payload) => set({ industriesCount: payload}),
    setOpenJobsCount: (payload) => set({ openJobsCount: payload }),
    setCloseJobsCount: (payload) => set({ closeJobsCount: payload }),
}));

export default JobCountStore;