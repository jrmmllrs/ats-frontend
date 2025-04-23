import { create } from 'zustand';

const useUserStore = create((set, get) => ({
  user: null,
  setUser: (user) => set({ user }),

  // Check if user has a specific feature enabled
  hasFeature: (featureName) => {
    const featureMap = get().user?.feature_names || {};
    return Object.values(featureMap).includes(featureName);
  },
}));

export default useUserStore;
