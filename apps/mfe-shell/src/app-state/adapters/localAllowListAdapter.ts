import type { UserAllowList } from '@call-center-platform/shared-types';

import type { AllowListAdapter } from './allowListAdapter';

export class LocalAllowListAdapter implements AllowListAdapter {
  constructor(private readonly allowLists: Record<string, UserAllowList>) {}

  async getByUserId(userId: string): Promise<UserAllowList | null> {
    return this.allowLists[userId] ?? null;
  }

  async isFeatureAllowed(userId: string, featureKey: string): Promise<boolean> {
    const allowList = await this.getByUserId(userId);

    return allowList?.featureKeys.includes(featureKey) ?? false;
  }
}
