import { useGlobalStore } from '../../store/globalStore';

export const useFeatureToggle = (featureKey: string): boolean =>
  useGlobalStore((state) => state.featureToggles[featureKey] ?? false);
