import type {
  FeatureToggle,
  FeatureToggleSnapshot,
} from '@call-center-platform/shared-types';

export interface FeatureToggleAdapter {
  setUserIdContext?: (userId: string | null) => Promise<void> | void;
  getAll(): Promise<FeatureToggleSnapshot>;
  getByKey(key: string): Promise<boolean>;
  list(): Promise<FeatureToggle[]>;
}
