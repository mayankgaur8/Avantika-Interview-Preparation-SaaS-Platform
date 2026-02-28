import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, X } from 'lucide-react';
import { useSubscription, PlanLevel } from '../../hooks/useSubscription';

interface UpgradeBannerProps {
  requiredLevel?: PlanLevel;
  feature?: string;
  dismissible?: boolean;
}

export const UpgradeBanner: React.FC<UpgradeBannerProps> = ({
  requiredLevel = 'pro',
  feature,
  dismissible = true,
}) => {
  const [dismissed, setDismissed] = React.useState(false);
  const { hasAccess } = useSubscription();

  if (hasAccess(requiredLevel) || dismissed) return null;

  const planLabel = requiredLevel.charAt(0).toUpperCase() + requiredLevel.slice(1);

  return (
    <div className="flex items-center gap-3 px-4 py-2.5 bg-gradient-to-r from-purple-900/60 to-blue-900/60 border border-purple-500/30 rounded-xl mb-4">
      <Sparkles size={16} className="text-purple-400 shrink-0" />
      <p className="flex-1 text-sm text-slate-200">
        {feature
          ? <><span className="font-semibold">{feature}</span> requires a {planLabel} plan.</>
          : <>Upgrade to <span className="font-semibold">{planLabel}</span> to unlock all features.</>
        }
      </p>
      <Link
        to="/pricing"
        className="shrink-0 px-3 py-1 rounded-lg bg-purple-600 hover:bg-purple-500 text-white text-xs font-semibold transition-colors"
      >
        Upgrade
      </Link>
      {dismissible && (
        <button
          onClick={() => setDismissed(true)}
          className="shrink-0 text-slate-500 hover:text-slate-300 transition-colors"
          aria-label="Dismiss"
        >
          <X size={14} />
        </button>
      )}
    </div>
  );
};
