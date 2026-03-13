import React from 'react';

import type { AccessEvaluation } from '@call-center-platform/shared-types';

import { useAppState } from '../../app-state/providers/AppStateProvider';

const ROUTING_EVENTS = ['popstate', 'hashchange', 'single-spa:routing-event'];

const getCurrentPath = (): string => window.location.pathname;

const useCurrentPath = (): string => {
  const [currentPath, setCurrentPath] = React.useState(getCurrentPath);

  React.useEffect(() => {
    const handleRouteChange = (): void => {
      setCurrentPath(getCurrentPath());
    };

    ROUTING_EVENTS.forEach((eventName) => {
      window.addEventListener(eventName, handleRouteChange);
    });

    return () => {
      ROUTING_EVENTS.forEach((eventName) => {
        window.removeEventListener(eventName, handleRouteChange);
      });
    };
  }, []);

  return currentPath;
};

export const useRouteAccess = (routePath?: string): AccessEvaluation => {
  const currentPath = useCurrentPath();
  const { evaluateRouteAccess } = useAppState();

  return evaluateRouteAccess(routePath ?? currentPath);
};

export const useRouteGuard = (fallbackPath?: string): AccessEvaluation => {
  const routeAccess = useRouteAccess();

  React.useEffect(() => {
    if (routeAccess.allowed) {
      return;
    }

    const targetPath = fallbackPath ?? routeAccess.fallbackPath ?? '/';

    if (window.location.pathname === targetPath) {
      return;
    }

    window.history.replaceState(window.history.state, '', targetPath);
    window.dispatchEvent(new PopStateEvent('popstate'));
  }, [fallbackPath, routeAccess.allowed, routeAccess.fallbackPath]);

  return routeAccess;
};
