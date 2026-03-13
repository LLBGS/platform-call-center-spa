import type {
  FeatureToggle,
  FeatureToggleSnapshot,
} from '@call-center-platform/shared-types';

export interface FeatureToggleAdapter {
  getAll(): Promise<FeatureToggleSnapshot>;
  getByKey(key: string): Promise<boolean>;
  list(): Promise<FeatureToggle[]>;
}
