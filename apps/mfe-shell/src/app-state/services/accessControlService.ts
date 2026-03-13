import type {
  AccessEvaluation,
  FeatureToggleSnapshot,
  RouteAccessRule,
  UserAllowList,
} from '@call-center-platform/shared-types';

import type { AllowListAdapter } from '../adapters/allowListAdapter';
import type { FeatureToggleAdapter } from '../adapters/featureToggleAdapter';

export interface AccessControlSnapshot {
  featureToggles: FeatureToggleSnapshot;
  allowList: UserAllowList | null;
  blockedRoutePaths: string[];
}

export interface AccessControlServiceOptions {
  featureToggleAdapter: FeatureToggleAdapter;
  allowListAdapter: AllowListAdapter;
  routeRules: RouteAccessRule[];
}

export class AccessControlService {
  private featureToggles: FeatureToggleSnapshot = {};

  private readonly allowLists = new Map<string, UserAllowList | null>();

  constructor(private readonly options: AccessControlServiceOptions) {}

  getRouteRules(): RouteAccessRule[] {
    return [...this.options.routeRules];
  }

  async hydrate(userId: string | null): Promise<AccessControlSnapshot> {
    const [featureToggles, allowList] = await Promise.all([
      this.options.featureToggleAdapter.getAll(),
      userId
        ? this.options.allowListAdapter.getByUserId(userId)
        : Promise.resolve(null),
    ]);

    this.featureToggles = featureToggles;

    if (userId) {
      this.allowLists.set(userId, allowList);
    }

    return {
      featureToggles,
      allowList,
      blockedRoutePaths: this.getBlockedRoutes(userId, allowList),
    };
  }

  evaluateFeatureAccess(
    featureKey: string,
    userId: string | null,
    allowListOverride?: UserAllowList | null
  ): AccessEvaluation {
    const isEnabled = this.featureToggles[featureKey] ?? false;

    if (!isEnabled) {
      return {
        allowed: false,
        reason: 'feature-disabled',
        featureKey,
      };
    }

    if (!userId) {
      return {
        allowed: false,
        reason: 'no-user',
        featureKey,
      };
    }

    const allowList = allowListOverride ?? this.allowLists.get(userId) ?? null;

    if (!allowList?.featureKeys.includes(featureKey)) {
      return {
        allowed: false,
        reason: 'user-not-allowed',
        featureKey,
      };
    }

    return {
      allowed: true,
      reason: 'allowed',
      featureKey,
    };
  }

  evaluateRouteAccess(
    routePath: string,
    userId: string | null,
    allowListOverride?: UserAllowList | null
  ): AccessEvaluation {
    const routeRule = this.findRouteRule(routePath);

    if (!routeRule) {
      return {
        allowed: true,
        reason: 'no-rule',
        routePath,
      };
    }

    const featureAccess = this.evaluateFeatureAccess(
      routeRule.featureKey,
      userId,
      allowListOverride
    );

    return {
      ...featureAccess,
      routePath,
      fallbackPath: routeRule.fallbackPath,
    };
  }

  private findRouteRule(routePath: string): RouteAccessRule | undefined {
    const normalizedPath = this.normalizePath(routePath);

    return [...this.options.routeRules]
      .sort((left, right) => right.path.length - left.path.length)
      .find(
        (rule) =>
          normalizedPath === rule.path || normalizedPath.startsWith(rule.path)
      );
  }

  private getBlockedRoutes(
    userId: string | null,
    allowListOverride?: UserAllowList | null
  ): string[] {
    return this.options.routeRules
      .filter(
        (rule) =>
          !this.evaluateRouteAccess(rule.path, userId, allowListOverride)
            .allowed
      )
      .map((rule) => rule.path);
  }

  private normalizePath(routePath: string): string {
    if (!routePath) {
      return '/';
    }

    return routePath.endsWith('/') && routePath !== '/'
      ? routePath.slice(0, -1)
      : routePath;
  }
}
