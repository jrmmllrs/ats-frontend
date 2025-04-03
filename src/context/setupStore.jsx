import { create } from "zustand";

const setupStore = create((set) => ({
    setupData: [],
    setSetupData: (payload) => set({ setupData: payload })
}))

export default setupStore; 