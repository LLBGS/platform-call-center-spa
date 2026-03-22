import type { UserAllowList } from '@call-center-platform/shared-types';

export interface AllowListAdapter {
  getByUserId(userId: string): Promise<UserAllowList | null>;
  getAllowedUserIdsByFeature(featureKey: string): Promise<string[]>;
  isFeatureAllowed(userId: string, featureKey: string): Promise<boolean>;
}
