import type { AccessEvaluation } from '@call-center-platform/shared-types';

import { useAppState } from '../../app-state/providers/AppStateProvider';
import { useFeatureToggle } from './useFeatureToggle';

const disabledFeatureAccess = (featureKey: string): AccessEvaluation => ({
  allowed: false,
  reason: 'feature-disabled',
  featureKey,
});

export const useFeatureAccess = (featureKey: string): AccessEvaluation => {
  const isEnabled = useFeatureToggle(featureKey);
  const { evaluateFeatureAccess } = useAppState();

  if (!isEnabled) {
    return disabledFeatureAccess(featureKey);
  }

  return evaluateFeatureAccess(featureKey);
};
