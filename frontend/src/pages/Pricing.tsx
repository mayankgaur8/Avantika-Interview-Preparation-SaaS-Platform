import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Shield, Zap, CheckCircle2, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import { plansApi, paymentsApi, PlanDTO } from '../services/api';
import { PlanCard } from '../components/billing/PlanCard';
import { useStore } from '../store/useStore';
import { useRazorpay } from '../hooks/useRazorpay';
import logo from '../assets/logo.png';

type PaymentState = 'idle' | 'creating' | 'checkout' | 'verifying' | 'success' | 'error';

const Pricing: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated, user, setSubscription } = useStore();
  const { openCheckout } = useRazorpay();

  const [plans, setPlans] = useState<PlanDTO[]>([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [plansError, setPlansError] = useState('');

  const [payState, setPayState] = useState<PaymentState>('idle');
  const [activePlanId, setActivePlanId] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // ── Load plans ─────────────────────────────────────────────────────────────
  useEffect(() => {
    plansApi
      .list()
      .then(({ plans }) => setPlans(plans))
      .catch(() => setPlansError('Failed to load plans. Please refresh.'))
      .finally(() => setPlansLoading(false));
  }, []);

  // ── Handle plan selection ──────────────────────────────────────────────────
  const handleSelectPlan = useCallback(
    async (plan: PlanDTO) => {
      if (!isAuthenticated) {
        navigate('/login', { state: { from: '/pricing' } });
        return;
      }

      setActivePlanId(plan.id);
      setErrorMessage('');

      // ── Free plan ──────────────────────────────────────────────────────────
      if (plan.amount === 0) {
        setPayState('verifying');
        try {
          const { subscription } = await paymentsApi.activateFree(plan.id);
          setSubscription(subscription);
          setSuccessMessage(`You're now on the ${plan.name} plan!`);
          setPayState('success');
          setTimeout(() => navigate('/dashboard'), 2000);
        } catch (err) {
          setErrorMessage((err as Error).message);
          setPayState('error');
        }
        return;
      }

      // ── Paid plan — create Razorpay order ──────────────────────────────────
      setPayState('creating');
      let orderData: { orderId: string; amount: number; currency: string; keyId: string };
      try {
        orderData = await paymentsApi.createOrder(plan.id);
      } catch (err) {
        setErrorMessage((err as Error).message || 'Could not create order. Try again.');
        setPayState('error');
        return;
      }

      // ── Open Razorpay checkout ─────────────────────────────────────────────
      setPayState('checkout');
      try {
        await openCheckout({
          key: orderData.keyId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: 'Avantika',
          description: `${plan.name} Plan — ${plan.durationDays} days`,
          image: logo,
          order_id: orderData.orderId,
          prefill: {
            name: user?.name ?? '',
            email: user?.email ?? '',
          },
          notes: {
            planId: plan.id,
            appName: 'avantika',
          },
          theme: { color: '#7c3aed' },
          handler: async (response) => {
            setPayState('verifying');
            try {
              const { subscription } = await paymentsApi.verify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                planId: plan.id,
              });
              setSubscription(subscription);
              setSuccessMessage(
                `Payment successful! You're now on the ${plan.name} plan.`,
              );
              setPayState('success');
              setTimeout(() => navigate('/dashboard'), 2500);
            } catch (err) {
              setErrorMessage(
                (err as Error).message ||
                  'Payment recorded but verification failed. Contact support.',
              );
              setPayState('error');
            }
          },
          modal: {
            ondismiss: () => {
              setPayState('idle');
              setActivePlanId(null);
            },
          },
        });
      } catch (err) {
        setErrorMessage((err as Error).message || 'Could not open payment window.');
        setPayState('error');
      }
    },
    [isAuthenticated, user, navigate, openCheckout, setSubscription],
  );

  const isProcessing = ['creating', 'checkout', 'verifying'].includes(payState);

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950">
      {/* Navbar */}
      <header className="border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <Link
              to="/dashboard"
              className="flex items-center gap-1.5 text-slate-400 hover:text-white text-sm transition-colors mr-2"
            >
              <ArrowLeft size={14} />
              Dashboard
            </Link>
          )}
          <Link to="/" className="flex items-center gap-2">
            <img src={logo} alt="Avantika" className="w-7 h-7 object-contain rounded-md" />
            <span className="font-bold text-white">Avantika</span>
          </Link>
        </div>
        {!isAuthenticated && (
          <div className="flex gap-3">
            <Link to="/login" className="text-sm text-slate-400 hover:text-white transition-colors">
              Sign in
            </Link>
            <Link
              to="/register"
              className="text-sm px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        )}
      </header>

      <main className="max-w-6xl mx-auto px-4 py-16">
        {/* Hero */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-purple-600/20 border border-purple-500/30 text-purple-300 text-sm font-medium mb-6">
            <Zap size={14} />
            Simple, transparent pricing
          </div>
          <h1 className="text-4xl sm:text-5xl font-black text-white mb-4">
            Invest in your career
          </h1>
          <p className="text-lg text-slate-400 max-w-xl mx-auto">
            Start free, upgrade when you need more. All plans include core interview prep features.
          </p>
        </div>

        {/* Status messages */}
        {payState === 'success' && (
          <div className="flex items-center gap-3 max-w-md mx-auto mb-8 p-4 rounded-xl bg-green-900/40 border border-green-500/30 text-green-300">
            <CheckCircle2 size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Payment confirmed!</p>
              <p className="text-sm opacity-80">{successMessage} Redirecting...</p>
            </div>
          </div>
        )}

        {payState === 'error' && (
          <div className="flex items-center gap-3 max-w-md mx-auto mb-8 p-4 rounded-xl bg-red-900/40 border border-red-500/30 text-red-300">
            <AlertCircle size={20} className="shrink-0" />
            <div>
              <p className="font-semibold">Payment failed</p>
              <p className="text-sm opacity-80">{errorMessage}</p>
            </div>
            <button
              onClick={() => { setPayState('idle'); setActivePlanId(null); setErrorMessage(''); }}
              className="ml-auto text-xs underline opacity-70 hover:opacity-100"
            >
              Retry
            </button>
          </div>
        )}

        {/* Processing overlay message */}
        {isProcessing && (
          <div className="flex items-center justify-center gap-2 max-w-md mx-auto mb-8 p-3 rounded-xl bg-blue-900/30 border border-blue-500/20 text-blue-300 text-sm">
            <Loader2 size={14} className="animate-spin" />
            {payState === 'creating' && 'Creating your order...'}
            {payState === 'checkout' && 'Complete payment in the Razorpay window...'}
            {payState === 'verifying' && 'Verifying payment...'}
          </div>
        )}

        {/* Plans grid */}
        {plansLoading ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-slate-500" />
          </div>
        ) : plansError ? (
          <p className="text-center text-red-400">{plansError}</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-start">
            {plans.map((plan) => (
              <PlanCard
                key={plan.id}
                plan={plan}
                onSelect={handleSelectPlan}
                loading={isProcessing && activePlanId === plan.id}
              />
            ))}
          </div>
        )}

        {/* Trust badges */}
        <div className="mt-16 flex flex-wrap justify-center gap-8 text-slate-500 text-sm">
          {[
            { icon: <Shield size={14} />, label: 'Secure payments via Razorpay' },
            { icon: <CheckCircle2 size={14} />, label: 'Instant activation' },
            { icon: <Zap size={14} />, label: 'Cancel anytime' },
          ].map((b) => (
            <div key={b.label} className="flex items-center gap-2">
              {b.icon}
              {b.label}
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div className="mt-20 max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold text-white text-center mb-8">FAQ</h2>
          <div className="space-y-4">
            {[
              {
                q: 'Can I upgrade or downgrade my plan?',
                a: 'Yes. Upgrading extends your subscription from your current expiry date. Downgrading takes effect at the next renewal.',
              },
              {
                q: 'Is my payment information safe?',
                a: 'Absolutely. We never store card details. All payments are processed by Razorpay, a PCI DSS Level 1 certified payment gateway.',
              },
              {
                q: 'What payment methods are accepted?',
                a: 'UPI, Credit/Debit cards, Net Banking, Wallets — all via Razorpay.',
              },
              {
                q: 'What happens after my plan expires?',
                a: 'Your account switches to Free. Your data and progress are never deleted.',
              },
            ].map((item) => (
              <details key={item.q} className="group border border-slate-700 rounded-xl overflow-hidden">
                <summary className="px-5 py-4 cursor-pointer text-white font-medium flex items-center justify-between hover:bg-slate-800/50 transition-colors list-none">
                  {item.q}
                  <span className="text-slate-500 group-open:rotate-45 transition-transform text-lg leading-none">+</span>
                </summary>
                <p className="px-5 pb-4 text-slate-400 text-sm leading-relaxed">{item.a}</p>
              </details>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Pricing;
