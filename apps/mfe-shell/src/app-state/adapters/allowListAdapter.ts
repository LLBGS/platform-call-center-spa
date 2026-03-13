import type { UserAllowList } from '@call-center-platform/shared-types';

export interface AllowListAdapter {
  getByUserId(userId: string): Promise<UserAllowList | null>;
  isFeatureAllowed(userId: string, featureKey: string): Promise<boolean>;
}
