import React from 'react';

import { useFeatureAccess } from './feature-flags/hooks/useFeatureAccess';
import { useRouteGuard } from './feature-flags/hooks/useRouteAccess';
import { useGlobalStore } from './store/globalStore';

const USER_TARGETED_FEATURE_KEY = 'componente-allow-list';

const UserTargetedWidget: React.FC = () => (
  <div className="shell-targeted-widget">
    <h3>Novo componente liberado por allow list</h3>
    <p>
      Este bloco aparece apenas quando o userId do localStorage existe na lista
      retornada de IDs permitidos para a feature.
    </p>
  </div>
);

export const App: React.FC = () => {
  const currentUser = useGlobalStore((state) => state.currentUser);
  const featureToggles = useGlobalStore((state) => state.featureToggles);
  const allowList = useGlobalStore((state) => state.allowList);
  const blockedRoutePaths = useGlobalStore((state) => state.blockedRoutePaths);
  const isHydrated = useGlobalStore((state) => state.isHydrated);
  const isHydrating = useGlobalStore((state) => state.isHydrating);
  const lastUpdatedAt = useGlobalStore((state) => state.lastUpdatedAt);
  const canaryAccess = useFeatureAccess('call-center.canary');
  const userTargetedAccess = useFeatureAccess(USER_TARGETED_FEATURE_KEY);
  const routeAccess = useRouteGuard('/call-center');

  React.useEffect(() => {
    console.log('[mfe-shell] feature flag debug', {
      userId: currentUser?.id ?? null,
      featureKey: USER_TARGETED_FEATURE_KEY,
      featureValue: featureToggles[USER_TARGETED_FEATURE_KEY] ?? null,
      access: userTargetedAccess,
      isHydrated,
      isHydrating,
    });
  }, [
    currentUser?.id,
    featureToggles,
    isHydrated,
    isHydrating,
    userTargetedAccess,
  ]);

  return (
    <div className="shell-app">
      <h1>MFE Shell Application</h1>
      <p>Global State, Feature Toggles & Allow List Manager</p>
      <div className="shell-panel shell-panel--highlight">
        <h3>Access Control Snapshot</h3>
        <p>
          User: {currentUser?.name ?? 'anonymous'} ({currentUser?.id ?? 'none'})
        </p>
        <p>
          Hydration: {isHydrating ? 'loading' : isHydrated ? 'ready' : 'idle'}
        </p>
        <p>
          Current route: {routeAccess.routePath ?? window.location.pathname}
        </p>
        <p>
          Canary access:{' '}
          {canaryAccess.allowed ? 'allowed' : canaryAccess.reason}
        </p>
        <p>
          User targeted widget:{' '}
          {userTargetedAccess.allowed ? 'allowed' : userTargetedAccess.reason}
        </p>
        <p>
          Route guard: {routeAccess.allowed ? 'allowed' : routeAccess.reason}
        </p>
        <p>Last update: {lastUpdatedAt ?? 'not loaded yet'}</p>
      </div>

      {userTargetedAccess.allowed ? <UserTargetedWidget /> : null}

      <div className="shell-panel">
        <h3>Global State:</h3>
        <pre>
          {JSON.stringify(
            {
              currentUser,
              featureToggles,
              allowList,
              blockedRoutePaths,
              isHydrated,
              isHydrating,
              lastUpdatedAt,
            },
            null,
            2
          )}
        </pre>
      </div>
    </div>
  );
};

export default App;
