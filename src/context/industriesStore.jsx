import { create } from "zustand";

const industriesStore = create((set) => ({
    industries: [],
    setIndustries: (payload) => set({ industries: payload}),
}))

export default industriesStore;