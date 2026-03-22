import { LOCAL_FEATURE_TOGGLES } from '../config/localAccessConfig';
import { getUnleashFrontendConfig } from '../config/unleashConfig';
import type { FeatureToggleAdapter } from './featureToggleAdapter';
import { HybridFeatureToggleAdapter } from './hybridFeatureToggleAdapter';
import { LocalFeatureToggleAdapter } from './localFeatureToggleAdapter';
import { UnleashFeatureToggleAdapter } from './unleashFeatureToggleAdapter';

export const createFeatureToggleAdapter = (): FeatureToggleAdapter => {
  const localAdapter = new LocalFeatureToggleAdapter(LOCAL_FEATURE_TOGGLES);
  const unleashConfig = getUnleashFrontendConfig();

  if (!unleashConfig) {
    return localAdapter;
  }

  const remoteAdapter = new UnleashFeatureToggleAdapter(unleashConfig);

  return new HybridFeatureToggleAdapter(remoteAdapter, localAdapter);
};
