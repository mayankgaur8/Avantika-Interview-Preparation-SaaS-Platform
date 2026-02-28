import React from 'react';
import { Link } from 'react-router-dom';
import { Lock, Sparkles } from 'lucide-react';
import { useSubscription, PlanLevel } from '../../hooks/useSubscription';

interface FeatureGateProps {
  requiredLevel: PlanLevel;
  feature?: string;
  children: React.ReactNode;
  /** Show blurred content behind the lock, instead of hiding it */
  blur?: boolean;
}

/**
 * Wraps content that requires a specific plan level.
 * If the user doesn't have access, shows a locked state with an upgrade prompt.
 */
export const FeatureGate: React.FC<FeatureGateProps> = ({
  requiredLevel,
  feature,
  children,
  blur = true,
}) => {
  const { hasAccess } = useSubscription();

  if (hasAccess(requiredLevel)) return <>{children}</>;

  const planLabel = requiredLevel.charAt(0).toUpperCase() + requiredLevel.slice(1);

  return (
    <div className="relative">
      {/* Blurred background content */}
      {blur && (
        <div className="pointer-events-none select-none filter blur-sm opacity-40" aria-hidden>
          {children}
        </div>
      )}

      {/* Lock overlay */}
      <div
        className={`
          flex flex-col items-center justify-center gap-4 text-center
          ${blur ? 'absolute inset-0' : 'py-16'}
        `}
      >
        <div className="p-4 rounded-2xl bg-slate-800/90 border border-slate-700 shadow-xl backdrop-blur-sm">
          <div className="p-3 rounded-xl bg-purple-600/20 border border-purple-500/30 mb-3 inline-flex">
            <Lock size={24} className="text-purple-400" />
          </div>
          <div className="flex items-center gap-1.5 mb-1">
            <Sparkles size={14} className="text-purple-400" />
            <span className="text-xs font-semibold text-purple-400 uppercase tracking-wider">
              {planLabel} Feature
            </span>
          </div>
          <p className="text-sm text-white font-semibold mb-1">
            {feature ?? 'This feature'} is locked
          </p>
          <p className="text-xs text-slate-400 mb-4 max-w-xs">
            Upgrade to {planLabel} or higher to unlock this.
          </p>
          <Link
            to="/pricing"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-sm font-semibold transition-colors"
          >
            <Sparkles size={14} />
            Upgrade to {planLabel}
          </Link>
        </div>
      </div>
    </div>
  );
};
