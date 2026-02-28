import { useStore } from '../store/useStore';

export type PlanLevel = 'free' | 'basic' | 'pro' | 'enterprise';

const HIERARCHY: Record<PlanLevel, number> = {
  free: 0,
  basic: 1,
  pro: 2,
  enterprise: 3,
};

/**
 * Returns subscription state and helper methods for feature gating.
 */
export function useSubscription() {
  const { subscription, isAuthenticated } = useStore();

  const currentLevel: PlanLevel = subscription?.planLevel ?? 'free';
  const isActive = Boolean(subscription && subscription.status === 'active');

  function hasAccess(requiredLevel: PlanLevel): boolean {
    if (!isAuthenticated) return false;
    if (requiredLevel === 'free') return true;
    if (!isActive) return false;
    return HIERARCHY[currentLevel] >= HIERARCHY[requiredLevel];
  }

  return {
    subscription,
    isActive,
    currentLevel,
    hasAccess,
    isPro: hasAccess('pro'),
    isBasic: hasAccess('basic'),
    isEnterprise: hasAccess('enterprise'),
  };
}
