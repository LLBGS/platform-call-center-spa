import React from 'react';

import type {
  AccessEvaluation,
  RouteAccessRule,
  User,
} from '@call-center-platform/shared-types';

import { useGlobalStore } from '../../store/globalStore';
import { LocalAllowListAdapter } from '../adapters/localAllowListAdapter';
import { LocalFeatureToggleAdapter } from '../adapters/localFeatureToggleAdapter';
import {
  DEFAULT_LOCAL_USER,
  LOCAL_ALLOW_LISTS,
  LOCAL_FEATURE_TOGGLES,
  LOCAL_ROUTE_RULES,
} from '../config/localAccessConfig';
import {
  AccessControlService,
  type AccessControlSnapshot,
} from '../services/accessControlService';

export interface AppStateContextValue {
  routeRules: RouteAccessRule[];
  refreshAccessState: () => Promise<void>;
  evaluateFeatureAccess: (featureKey: string) => AccessEvaluation;
  evaluateRouteAccess: (routePath: string) => AccessEvaluation;
}

export interface AppStateProviderProps {
  children: React.ReactNode;
  initialUser?: User;
}

const AppStateContext = React.createContext<AppStateContextValue | null>(null);

const createEmptySnapshot = (): AccessControlSnapshot => ({
  featureToggles: {},
  allowList: null,
  blockedRoutePaths: [],
});

export const AppStateProvider: React.FC<AppStateProviderProps> = ({
  children,
  initialUser = DEFAULT_LOCAL_USER,
}) => {
  const currentUser = useGlobalStore((state) => state.currentUser);
  const allowList = useGlobalStore((state) => state.allowList);
  const actions = useGlobalStore((state) => state.actions);
  const [service] = React.useState(
    () =>
      new AccessControlService({
        featureToggleAdapter: new LocalFeatureToggleAdapter(
          LOCAL_FEATURE_TOGGLES
        ),
        allowListAdapter: new LocalAllowListAdapter(LOCAL_ALLOW_LISTS),
        routeRules: LOCAL_ROUTE_RULES,
      })
  );

  React.useEffect(() => {
    if (!currentUser && initialUser) {
      actions.setCurrentUser(initialUser);
    }
  }, [actions, currentUser, initialUser]);

  React.useEffect(() => {
    let isActive = true;

    if (!currentUser && initialUser) {
      return () => {
        isActive = false;
      };
    }

    actions.setHydrating(true);

    service
      .hydrate(currentUser?.id ?? null)
      .then((snapshot) => {
        if (!isActive) {
          return;
        }

        actions.hydrateAccessControl(snapshot);
      })
      .catch((error: unknown) => {
        if (!isActive) {
          return;
        }

        console.error('Falha ao hidratar feature toggles e allow list.', error);
        actions.hydrateAccessControl(createEmptySnapshot());
      });

    return () => {
      isActive = false;
    };
  }, [actions, currentUser, initialUser, service]);

  const refreshAccessState = async (): Promise<void> => {
    actions.setHydrating(true);

    try {
      const snapshot = await service.hydrate(currentUser?.id ?? null);
      actions.hydrateAccessControl(snapshot);
    } catch (error) {
      console.error('Falha ao atualizar feature toggles e allow list.', error);
      actions.hydrateAccessControl(createEmptySnapshot());
    }
  };

  const contextValue: AppStateContextValue = {
    routeRules: service.getRouteRules(),
    refreshAccessState,
    evaluateFeatureAccess: (featureKey: string) =>
      service.evaluateFeatureAccess(
        featureKey,
        currentUser?.id ?? null,
        allowList
      ),
    evaluateRouteAccess: (routePath: string) =>
      service.evaluateRouteAccess(
        routePath,
        currentUser?.id ?? null,
        allowList
      ),
  };

  return (
    <AppStateContext.Provider value={contextValue}>
      {children}
    </AppStateContext.Provider>
  );
};

export const useAppState = (): AppStateContextValue => {
  const context = React.useContext(AppStateContext);

  if (!context) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return context;
};
