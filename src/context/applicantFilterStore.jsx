import { create } from 'zustand';

const applicantFilterStore = create((set) => ({
  status: [],
  search: "",
  dateFilter:  "",
  dateFilterType: "month",
  selectedDate: "",
  selectedStatuses: [],
  setSelectedStatuses: (payload) => set({ selectedStatuses: payload }),
  setSelectedDate: (payload) => set({ selectedDate: payload }),
  setDateFilterType: (payload) => set({ dateFilterType: payload }),
  setDateFilter: (payload) => set({ dateFilter: payload }),
  setSearch: (payload) => set({ search: payload}),
  setStatus: (payload) => set((state) => {
    if (state.status.includes(payload)) {
      return { status: state.status.filter((status) => status !== payload) };
    } else {
      return { status: [...state.status, payload] };
    }
  }),
  setStatusStage: (payload) => set({ status: [...payload]}),
  clearStatus: () => set({ status: []})
}));

export default applicantFilterStore;
