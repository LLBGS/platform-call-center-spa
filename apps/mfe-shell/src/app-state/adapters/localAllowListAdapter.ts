import type { UserAllowList } from '@call-center-platform/shared-types';

import type { AllowListAdapter } from './allowListAdapter';

export class LocalAllowListAdapter implements AllowListAdapter {
  constructor(
    private readonly allowedUserIdsByFeature: Record<string, string[]>
  ) {}

  async getByUserId(userId: string): Promise<UserAllowList | null> {
    const featureKeys = Object.entries(this.allowedUserIdsByFeature)
      .filter(([, allowedUserIds]) => allowedUserIds.includes(userId))
      .map(([featureKey]) => featureKey);

    if (featureKeys.length === 0) {
      return null;
    }

    return {
      userId,
      featureKeys,
    };
  }

  async getAllowedUserIdsByFeature(featureKey: string): Promise<string[]> {
    return this.allowedUserIdsByFeature[featureKey] ?? [];
  }

  async isFeatureAllowed(userId: string, featureKey: string): Promise<boolean> {
    const allowedUserIds = await this.getAllowedUserIdsByFeature(featureKey);

    return allowedUserIds.includes(userId);
  }
}
