export interface User {
  id: string;
  name: string;
  email: string;
}

export interface Call {
  id: string;
  customerId: string;
  agentId?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  status: 'waiting' | 'active' | 'completed' | 'missed';
}

export interface FeatureToggle {
  key: string;
  enabled: boolean;
  description?: string;
}

export type FeatureToggleSnapshot = Record<string, boolean>;

export interface UserAllowList {
  userId: string;
  featureKeys: string[];
}

export interface RouteAccessRule {
  path: string;
  featureKey: string;
  fallbackPath?: string;
}

export type AccessDecisionReason =
  | 'allowed'
  | 'no-rule'
  | 'feature-disabled'
  | 'user-not-allowed'
  | 'no-user';

export interface AccessEvaluation {
  allowed: boolean;
  reason: AccessDecisionReason;
  featureKey?: string;
  routePath?: string;
  fallbackPath?: string;
}

export interface GlobalAppState {
  isDarkMode: boolean;
  currentUser: User | null;
  featureToggles: FeatureToggleSnapshot;
  allowList: UserAllowList | null;
  blockedRoutePaths: string[];
  isHydrated: boolean;
}
