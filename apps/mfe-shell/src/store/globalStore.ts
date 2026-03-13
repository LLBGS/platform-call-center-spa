import { create } from 'zustand';

import type {
  FeatureToggleSnapshot,
  GlobalAppState,
  User,
  UserAllowList,
} from '@call-center-platform/shared-types';

interface GlobalStoreState extends GlobalAppState {
  isHydrating: boolean;
  lastUpdatedAt: string | null;
  actions: {
    toggleDarkMode: () => void;
    setCurrentUser: (user: User | null) => void;
    setFeatureToggles: (featureToggles: FeatureToggleSnapshot) => void;
    setAllowList: (allowList: UserAllowList | null) => void;
    hydrateAccessControl: (payload: {
      featureToggles: FeatureToggleSnapshot;
      allowList: UserAllowList | null;
      blockedRoutePaths: string[];
    }) => void;
    setHydrating: (isHydrating: boolean) => void;
  };
}

const createTimestamp = (): string => new Date().toISOString();

export const useGlobalStore = create<GlobalStoreState>((set) => ({
  isDarkMode: false,
  currentUser: null,
  featureToggles: {},
  allowList: null,
  blockedRoutePaths: [],
  isHydrated: false,
  isHydrating: false,
  lastUpdatedAt: null,
  actions: {
    toggleDarkMode: () =>
      set((state) => ({
        isDarkMode: !state.isDarkMode,
      })),
    setCurrentUser: (user: User | null) =>
      set({
        currentUser: user,
      }),
    setFeatureToggles: (featureToggles: FeatureToggleSnapshot) =>
      set({
        featureToggles,
        lastUpdatedAt: createTimestamp(),
      }),
    setAllowList: (allowList: UserAllowList | null) =>
      set({
        allowList,
        lastUpdatedAt: createTimestamp(),
      }),
    hydrateAccessControl: ({ featureToggles, allowList, blockedRoutePaths }) =>
      set({
        featureToggles,
        allowList,
        blockedRoutePaths,
        isHydrated: true,
        isHydrating: false,
        lastUpdatedAt: createTimestamp(),
      }),
    setHydrating: (isHydrating: boolean) =>
      set({
        isHydrating,
      }),
  },
}));
