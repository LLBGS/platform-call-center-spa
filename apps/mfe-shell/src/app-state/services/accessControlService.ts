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
  remoteUserTargetedFeatures?: string[];
}

export class AccessControlService {
  private featureToggles: FeatureToggleSnapshot = {};

  private readonly allowedUserIdsByFeature = new Map<string, Set<string>>();

  constructor(private readonly options: AccessControlServiceOptions) {}

  getRouteRules(): RouteAccessRule[] {
    return [...this.options.routeRules];
  }

  async hydrate(userId: string | null): Promise<AccessControlSnapshot> {
    if (this.options.featureToggleAdapter.setUserIdContext) {
      await this.options.featureToggleAdapter.setUserIdContext(userId);
    }

    const featureToggles = await this.options.featureToggleAdapter.getAll();
    const featureKeys = Object.keys(featureToggles);

    const allowedUserIdsEntries = await Promise.all(
      featureKeys.map(async (featureKey) => {
        const allowedUserIds =
          await this.options.allowListAdapter.getAllowedUserIdsByFeature(
            featureKey
          );

        return [featureKey, new Set(allowedUserIds)] as const;
      })
    );

    this.allowedUserIdsByFeature.clear();

    allowedUserIdsEntries.forEach(([featureKey, allowedUserIds]) => {
      this.allowedUserIdsByFeature.set(featureKey, allowedUserIds);
    });

    const allowList = this.createAllowList(userId, featureKeys);

    this.featureToggles = featureToggles;

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

    if (this.isRemoteUserTargetedFeature(featureKey)) {
      return {
        allowed: true,
        reason: 'allowed',
        featureKey,
      };
    }

    const allowList = allowListOverride ?? this.createAllowList(userId);

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

  private createAllowList(
    userId: string | null,
    featureKeysOverride?: string[]
  ): UserAllowList | null {
    if (!userId) {
      return null;
    }

    const featureKeys = (
      featureKeysOverride ?? Object.keys(this.featureToggles)
    ).filter((featureKey) => {
      const allowedUserIds = this.allowedUserIdsByFeature.get(featureKey);

      return allowedUserIds?.has(userId) ?? false;
    });

    if (featureKeys.length === 0) {
      return null;
    }

    return {
      userId,
      featureKeys,
    };
  }

  private isRemoteUserTargetedFeature(featureKey: string): boolean {
    return (
      this.options.remoteUserTargetedFeatures?.includes(featureKey) ?? false
    );
  }
}
