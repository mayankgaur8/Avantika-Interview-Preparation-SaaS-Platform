import React, { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, TextareaHTMLAttributes, SelectHTMLAttributes } from 'react';
import { clsx } from 'clsx';
import { X } from 'lucide-react';

// ============================================================
// BUTTON
// ============================================================
interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'success' | 'outline';
  size?: 'xs' | 'sm' | 'md' | 'lg';
  loading?: boolean;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', loading, icon, iconRight, children, className, disabled, ...props }, ref) => {
    const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed select-none';

    const variants = {
      primary: 'bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white shadow-lg shadow-violet-600/20',
      secondary: 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700',
      ghost: 'text-slate-400 hover:text-white hover:bg-slate-800',
      danger: 'bg-red-600 hover:bg-red-700 text-white',
      success: 'bg-green-600 hover:bg-green-700 text-white',
      outline: 'border border-slate-600 hover:border-slate-500 text-slate-300 hover:text-white hover:bg-slate-800',
    };

    const sizes = {
      xs: 'text-xs px-2.5 py-1.5',
      sm: 'text-sm px-3 py-2',
      md: 'text-sm px-4 py-2.5',
      lg: 'text-base px-5 py-3',
    };

    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={clsx(base, variants[variant], sizes[size], className)}
        {...props}
      >
        {loading ? (
          <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
        ) : icon}
        {children}
        {!loading && iconRight}
      </button>
    );
  }
);
Button.displayName = 'Button';

// ============================================================
// CARD
// ============================================================
interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({ children, className, hover, onClick, padding = 'md' }) => {
  const paddings = { none: '', sm: 'p-3', md: 'p-5', lg: 'p-6' };
  return (
    <div
      onClick={onClick}
      className={clsx(
        'bg-slate-900 border border-slate-800 rounded-xl',
        paddings[padding],
        hover && 'cursor-pointer transition-all duration-200 hover:border-slate-600 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-slate-950/50',
        className
      )}
    >
      {children}
    </div>
  );
};

// ============================================================
// BADGE
// ============================================================
interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'easy' | 'medium' | 'hard' | 'expert' | 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'cyan' | 'orange';
  size?: 'sm' | 'md';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({ children, variant = 'default', size = 'sm', className }) => {
  const variants = {
    default: 'bg-slate-700 text-slate-300',
    easy: 'bg-green-400/10 text-green-400 border border-green-400/20',
    medium: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
    hard: 'bg-red-400/10 text-red-400 border border-red-400/20',
    expert: 'bg-purple-400/10 text-purple-400 border border-purple-400/20',
    blue: 'bg-blue-400/10 text-blue-400 border border-blue-400/20',
    green: 'bg-green-400/10 text-green-400 border border-green-400/20',
    yellow: 'bg-yellow-400/10 text-yellow-400 border border-yellow-400/20',
    red: 'bg-red-400/10 text-red-400 border border-red-400/20',
    purple: 'bg-purple-400/10 text-purple-400 border border-purple-400/20',
    cyan: 'bg-cyan-400/10 text-cyan-400 border border-cyan-400/20',
    orange: 'bg-orange-400/10 text-orange-400 border border-orange-400/20',
  };

  const sizes = {
    sm: 'text-xs px-2 py-0.5 rounded-md font-medium',
    md: 'text-sm px-2.5 py-1 rounded-lg font-medium',
  };

  return (
    <span className={clsx(variants[variant], sizes[size], className)}>
      {children}
    </span>
  );
};

// ============================================================
// PROGRESS BAR
// ============================================================
interface ProgressProps {
  value: number;
  max?: number;
  color?: 'blue' | 'green' | 'yellow' | 'red' | 'purple';
  size?: 'xs' | 'sm' | 'md';
  showLabel?: boolean;
  className?: string;
}

export const Progress: React.FC<ProgressProps> = ({
  value, max = 100, color = 'blue', size = 'sm', showLabel, className
}) => {
  const pct = Math.min(100, (value / max) * 100);
  const colors = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
    purple: 'bg-purple-500',
  };
  const sizes = { xs: 'h-1', sm: 'h-1.5', md: 'h-2.5' };

  return (
    <div className={clsx('w-full', className)}>
      {showLabel && (
        <div className="flex justify-between text-xs text-slate-400 mb-1">
          <span>{value}</span>
          <span>{pct.toFixed(0)}%</span>
        </div>
      )}
      <div className={clsx('w-full bg-slate-700/50 rounded-full', sizes[size])}>
        <div
          className={clsx('rounded-full transition-all duration-500', colors[color], sizes[size])}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};

// ============================================================
// INPUT
// ============================================================
interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  iconRight?: ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, iconRight, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">{icon}</span>}
        <input
          ref={ref}
          className={clsx(
            'input-base',
            icon && 'pl-9',
            iconRight && 'pr-9',
            error && 'border-red-500 focus:ring-red-500/50',
            className
          )}
          {...props}
        />
        {iconRight && <span className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{iconRight}</span>}
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

// ============================================================
// TEXTAREA
// ============================================================
interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ label, error, className, ...props }, ref) => (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
      <textarea
        ref={ref}
        className={clsx('input-base resize-none', error && 'border-red-500', className)}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
);
Textarea.displayName = 'Textarea';

// ============================================================
// SELECT
// ============================================================
interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  options: { value: string; label: string }[];
}

export const Select: React.FC<SelectProps> = ({ label, options, className, ...props }) => (
  <div className="w-full">
    {label && <label className="block text-sm font-medium text-slate-300 mb-1.5">{label}</label>}
    <select
      className={clsx('input-base cursor-pointer', className)}
      {...props}
    >
      {options.map((opt) => (
        <option key={opt.value} value={opt.value} className="bg-slate-800">
          {opt.label}
        </option>
      ))}
    </select>
  </div>
);

// ============================================================
// AVATAR
// ============================================================
interface AvatarProps {
  initials: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  color?: string;
  className?: string;
}

export const Avatar: React.FC<AvatarProps> = ({ initials, size = 'md', className }) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-xl',
  };

  return (
    <div className={clsx(
      'rounded-full bg-gradient-to-br from-violet-500 to-blue-500 flex items-center justify-center font-semibold text-white flex-shrink-0',
      sizes[size],
      className
    )}>
      {initials}
    </div>
  );
};

// ============================================================
// MODAL
// ============================================================
interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export const Modal: React.FC<ModalProps> = ({ open, onClose, title, children, size = 'md' }) => {
  if (!open) return null;

  const sizes = {
    sm: 'max-w-sm',
    md: 'max-w-lg',
    lg: 'max-w-2xl',
    xl: 'max-w-4xl',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      <div
        className={clsx('relative w-full bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl', sizes[size])}
        onClick={(e) => e.stopPropagation()}
      >
        {title && (
          <div className="flex items-center justify-between p-5 border-b border-slate-800">
            <h3 className="font-semibold text-white text-lg">{title}</h3>
            <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-slate-800">
              <X size={18} />
            </button>
          </div>
        )}
        <div className="p-5">{children}</div>
      </div>
    </div>
  );
};

// ============================================================
// STAT CARD
// ============================================================
interface StatCardProps {
  label: string;
  value: string | number;
  icon?: ReactNode;
  trend?: { value: number; positive: boolean };
  color?: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'cyan';
  subtitle?: string;
}

export const StatCard: React.FC<StatCardProps> = ({ label, value, icon, trend, color = 'blue', subtitle }) => {
  const colors = {
    blue: 'text-blue-400 bg-blue-400/10',
    green: 'text-green-400 bg-green-400/10',
    yellow: 'text-yellow-400 bg-yellow-400/10',
    purple: 'text-purple-400 bg-purple-400/10',
    red: 'text-red-400 bg-red-400/10',
    cyan: 'text-cyan-400 bg-cyan-400/10',
  };

  return (
    <Card className="stat-card">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-slate-400 font-medium">{label}</p>
          <p className="text-2xl font-bold text-white mt-1">{value}</p>
          {subtitle && <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>}
          {trend && (
            <p className={clsx('text-xs mt-1 font-medium', trend.positive ? 'text-green-400' : 'text-red-400')}>
              {trend.positive ? '↑' : '↓'} {Math.abs(trend.value)}% this week
            </p>
          )}
        </div>
        {icon && (
          <div className={clsx('p-2.5 rounded-xl', colors[color])}>
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
};

// ============================================================
// EMPTY STATE
// ============================================================
export const EmptyState: React.FC<{ icon?: ReactNode; title: string; description?: string; action?: ReactNode }> = ({
  icon, title, description, action
}) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    {icon && <div className="text-5xl mb-4">{icon}</div>}
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    {description && <p className="text-sm text-slate-400 max-w-xs mb-6">{description}</p>}
    {action}
  </div>
);

// ============================================================
// TOOLTIP
// ============================================================
export const Tooltip: React.FC<{ children: ReactNode; content: string }> = ({ children, content }) => (
  <div className="relative group">
    {children}
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-slate-700 text-white rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50">
      {content}
    </div>
  </div>
);

// ============================================================
// DIFFICULTY BADGE helper
// ============================================================
export const DifficultyBadge: React.FC<{ difficulty: string }> = ({ difficulty }) => {
  const map: Record<string, 'easy' | 'medium' | 'hard' | 'expert'> = {
    easy: 'easy', medium: 'medium', hard: 'hard', expert: 'expert'
  };
  return <Badge variant={map[difficulty] ?? 'default'}>{difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}</Badge>;
};

// ============================================================
// TAB BAR
// ============================================================
interface Tab { id: string; label: string; icon?: ReactNode }
interface TabBarProps { tabs: Tab[]; active: string; onChange: (id: string) => void; className?: string }

export const TabBar: React.FC<TabBarProps> = ({ tabs, active, onChange, className }) => (
  <div className={clsx('flex gap-1 bg-slate-800/50 p-1 rounded-xl', className)}>
    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => onChange(tab.id)}
        className={clsx(
          'flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200',
          active === tab.id
            ? 'bg-slate-700 text-white shadow'
            : 'text-slate-400 hover:text-slate-200 hover:bg-slate-700/50'
        )}
      >
        {tab.icon}
        {tab.label}
      </button>
    ))}
  </div>
);
