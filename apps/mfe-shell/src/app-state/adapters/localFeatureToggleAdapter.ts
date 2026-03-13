import type {
  FeatureToggle,
  FeatureToggleSnapshot,
} from '@call-center-platform/shared-types';

import type { FeatureToggleAdapter } from './featureToggleAdapter';

export class LocalFeatureToggleAdapter implements FeatureToggleAdapter {
  constructor(private readonly featureToggles: FeatureToggleSnapshot) {}

  async getAll(): Promise<FeatureToggleSnapshot> {
    return { ...this.featureToggles };
  }

  async getByKey(key: string): Promise<boolean> {
    return this.featureToggles[key] ?? false;
  }

  async list(): Promise<FeatureToggle[]> {
    return Object.entries(this.featureToggles).map(([key, enabled]) => ({
      key,
      enabled,
    }));
  }
}
