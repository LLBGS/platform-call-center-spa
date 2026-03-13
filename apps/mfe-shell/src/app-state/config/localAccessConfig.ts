import type {
  FeatureToggleSnapshot,
  RouteAccessRule,
  User,
  UserAllowList,
} from '@call-center-platform/shared-types';

export const DEFAULT_LOCAL_USER: User = {
  id: 'agent-001',
  name: 'Agente Demo',
  email: 'agente.demo@call-center.local',
};

export const LOCAL_FEATURE_TOGGLES: FeatureToggleSnapshot = {
  'call-center.dashboard': true,
  'call-center.legacy': true,
  'call-center.canary': false,
};

export const LOCAL_ALLOW_LISTS: Record<string, UserAllowList> = {
  'agent-001': {
    userId: 'agent-001',
    featureKeys: ['call-center.dashboard', 'call-center.legacy'],
  },
  'agent-canary': {
    userId: 'agent-canary',
    featureKeys: [
      'call-center.dashboard',
      'call-center.legacy',
      'call-center.canary',
    ],
  },
};

export const LOCAL_ROUTE_RULES: RouteAccessRule[] = [
  {
    path: '/call-center/canary',
    featureKey: 'call-center.canary',
    fallbackPath: '/call-center',
  },
];
