import type {
  FeatureToggleSnapshot,
  RouteAccessRule,
  User,
} from '@call-center-platform/shared-types';

export const DEFAULT_LOCAL_USER: User = {
  id: 'agente-001',
  name: 'Agente Demo',
  email: 'agente.demo@call-center.local',
};

export const LOCAL_FEATURE_TOGGLES: FeatureToggleSnapshot = {
  'call-center.dashboard': true,
  'call-center.legacy': true,
  'call-center.canary': false,
  'componente-allow-list': true,
};

export const LOCAL_ALLOWED_USER_IDS_BY_FEATURE: Record<string, string[]> = {
  'call-center.dashboard': ['agente-001', 'supervisor-002', 'admin-003'],
  'call-center.legacy': ['agente-001', 'supervisor-002', 'admin-003'],
  'call-center.canary': ['supervisor-002'],
  'componente-allow-list': ['agente-001', 'supervisor-002', 'admin-003'],
};

export const LOCAL_ROUTE_RULES: RouteAccessRule[] = [
  {
    path: '/call-center/canary',
    featureKey: 'call-center.canary',
    fallbackPath: '/call-center',
  },
];
