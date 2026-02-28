import { Response, NextFunction } from 'express';
import { AuthRequest } from './auth';
import { getActiveSubscription } from '../services/subscription';
import { PLAN_HIERARCHY, PlanLevel } from '../../billing/src/types';

/**
 * Middleware that checks the user has an active subscription at or above `minLevel`.
 * Must be used after `requireAuth`.
 *
 * Usage:
 *   router.get('/premium', requireAuth, requireActiveSubscription('pro'), handler)
 */
export function requireActiveSubscription(minLevel: PlanLevel) {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    const sub = getActiveSubscription((req as AuthRequest).userId);

    if (!sub) {
      res.status(403).json({
        error: 'No active subscription',
        requiredPlan: minLevel,
        upgradeUrl: '/pricing',
      });
      return;
    }

    const userLevel = PLAN_HIERARCHY[sub.plan_level as PlanLevel] ?? -1;
    const required = PLAN_HIERARCHY[minLevel];

    if (userLevel < required) {
      res.status(403).json({
        error: `${minLevel} plan or higher required`,
        requiredPlan: minLevel,
        currentPlan: sub.plan_level,
        upgradeUrl: '/pricing',
      });
      return;
    }

    next();
  };
}
