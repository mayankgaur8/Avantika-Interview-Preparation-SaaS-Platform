/**
 * Razorpay Checkout integration.
 * Loads the Razorpay script on demand and opens the checkout modal.
 * The returned Promise resolves after the caller's `handler` fires (payment success)
 * and rejects if the modal is dismissed or the script fails to load.
 */

// ── Script loader (idempotent) ───────────────────────────────────────────────
function loadRazorpayScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') { resolve(true); return; }
    const existing = document.getElementById('razorpay-script');
    if (existing) { existing.addEventListener('load', () => resolve(true)); return; }
    const script = document.createElement('script');
    script.id = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

// ── Hook ─────────────────────────────────────────────────────────────────────
export function useRazorpay() {
  /**
   * Opens the Razorpay checkout modal.
   * - Resolves when the caller-provided `handler` resolves (payment success).
   * - Rejects with Error('DISMISSED') when the user closes the modal.
   */
  const openCheckout = async (options: RazorpayOptions): Promise<void> => {
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      throw new Error('Failed to load Razorpay checkout. Check your internet connection.');
    }

    return new Promise<void>((resolve, reject) => {
      const rzpOptions: RazorpayOptions = {
        ...options,
        // Wrap the caller's handler so the promise resolves after verification
        handler: async (response) => {
          try {
            await (options.handler as (r: typeof response) => void | Promise<void>)(response);
            resolve();
          } catch (err) {
            reject(err);
          }
        },
        modal: {
          ...options.modal,
          ondismiss: () => {
            options.modal?.ondismiss?.();
            reject(new Error('DISMISSED'));
          },
        },
      };

      try {
        const rzp = new window.Razorpay(rzpOptions);
        rzp.open();
      } catch (err) {
        reject(err);
      }
    });
  };

  return { openCheckout };
}
