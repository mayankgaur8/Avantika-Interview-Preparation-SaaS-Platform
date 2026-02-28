import React from 'react';
import { Check, Zap, Crown, Building2, Gift } from 'lucide-react';
import { PlanDTO } from '../../services/api';
import { useSubscription } from '../../hooks/useSubscription';

interface PlanCardProps {
  plan: PlanDTO;
  onSelect: (plan: PlanDTO) => void;
  loading?: boolean;
}

const PLAN_META: Record<string, {
  icon: React.ReactNode;
  gradient: string;
  badge?: string;
  popular?: boolean;
}> = {
  free: {
    icon: <Gift size={20} className="text-slate-400" />,
    gradient: 'from-slate-700/50 to-slate-800/50',
  },
  basic: {
    icon: <Zap size={20} className="text-blue-400" />,
    gradient: 'from-blue-900/30 to-slate-800/50',
    badge: 'Starter',
  },
  pro: {
    icon: <Crown size={20} className="text-purple-400" />,
    gradient: 'from-purple-900/40 to-slate-800/50',
    badge: 'Most Popular',
    popular: true,
  },
  enterprise: {
    icon: <Building2 size={20} className="text-amber-400" />,
    gradient: 'from-amber-900/30 to-slate-800/50',
    badge: 'Teams',
  },
};

export const PlanCard: React.FC<PlanCardProps> = ({ plan, onSelect, loading }) => {
  const { subscription, currentLevel } = useSubscription();
  const meta = PLAN_META[plan.level] ?? PLAN_META.free;
  const isCurrent = subscription?.planId === plan.id;
  const priceDisplay = plan.amount === 0 ? 'Free' : `₹${plan.amount / 100}`;
  const period = plan.amount === 0 ? '' : '/month';

  return (
    <div
      className={`
        relative flex flex-col rounded-2xl border p-6 transition-all duration-200
        bg-gradient-to-b ${meta.gradient}
        ${meta.popular
          ? 'border-purple-500 shadow-lg shadow-purple-500/20 scale-[1.02]'
          : 'border-slate-700 hover:border-slate-600'
        }
        ${isCurrent ? 'ring-2 ring-green-500/50' : ''}
      `}
    >
      {/* Popular / badge ribbon */}
      {meta.badge && (
        <div className={`
          absolute -top-3 left-1/2 -translate-x-1/2
          px-3 py-0.5 rounded-full text-xs font-semibold
          ${meta.popular
            ? 'bg-purple-500 text-white'
            : 'bg-slate-700 text-slate-300 border border-slate-600'
          }
        `}>
          {meta.badge}
        </div>
      )}

      {isCurrent && (
        <div className="absolute -top-3 right-4 px-3 py-0.5 rounded-full text-xs font-semibold bg-green-600 text-white">
          Current Plan
        </div>
      )}

      {/* Header */}
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700">
          {meta.icon}
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">{plan.name}</h3>
          <p className="text-xs text-slate-400">
            {plan.amount === 0 ? 'Always free' : `${plan.durationDays}-day access`}
          </p>
        </div>
      </div>

      {/* Price */}
      <div className="mb-6">
        <div className="flex items-baseline gap-1">
          <span className="text-4xl font-black text-white">{priceDisplay}</span>
          {period && <span className="text-slate-400 text-sm">{period}</span>}
        </div>
        {plan.amount > 0 && (
          <p className="text-xs text-slate-500 mt-1">
            Billed monthly · INR · Cancel anytime
          </p>
        )}
      </div>

      {/* Features */}
      <ul className="flex-1 space-y-2.5 mb-6">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-2.5 text-sm text-slate-300">
            <Check size={14} className="text-green-400 mt-0.5 shrink-0" />
            {feature}
          </li>
        ))}
      </ul>

      {/* CTA */}
      <button
        onClick={() => onSelect(plan)}
        disabled={loading || isCurrent}
        className={`
          w-full py-2.5 rounded-xl font-semibold text-sm transition-all duration-150
          disabled:opacity-50 disabled:cursor-not-allowed
          ${isCurrent
            ? 'bg-green-600/20 text-green-400 border border-green-600/30 cursor-default'
            : meta.popular
              ? 'bg-purple-600 hover:bg-purple-500 text-white shadow-lg shadow-purple-600/30'
              : plan.amount === 0
                ? 'bg-slate-700 hover:bg-slate-600 text-white'
                : 'bg-blue-600 hover:bg-blue-500 text-white'
          }
        `}
      >
        {loading
          ? 'Processing...'
          : isCurrent
            ? 'Active'
            : plan.amount === 0
              ? 'Get Started Free'
              : `Upgrade to ${plan.name}`
        }
      </button>
    </div>
  );
};
