import { create } from 'zustand';

interface GlobalState {
  isDarkMode: boolean;
  currentUser: string | null;
  featureToggles: Record<string, boolean>;
  toggleDarkMode: () => void;
  setCurrentUser: (user: string | null) => void;
  setFeatureToggle: (key: string, value: boolean) => void;
}

export const useGlobalStore = create<GlobalState>((set) => ({
  isDarkMode: false,
  currentUser: null,
  featureToggles: {},
  toggleDarkMode: () => set((state) => ({ isDarkMode: !state.isDarkMode })),
  setCurrentUser: (user: string | null) => set({ currentUser: user }),
  setFeatureToggle: (key: string, value: boolean) =>
    set((state) => ({
      featureToggles: {
        ...state.featureToggles,
        [key]: value,
      },
    })),
}));
