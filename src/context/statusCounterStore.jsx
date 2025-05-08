import { create } from 'zustand';
import { initialStages } from '../data/stages';

const statusCounterStore = create((set) => ({
  stages: initialStages,
  setStages: (payload) => set({ stages: payload }),
}));

export default statusCounterStore;