/**
 * Loads the Razorpay Checkout JS from CDN on demand and exposes `openCheckout`.
 * Only fetches the script once per page load.
 */

function loadScript(): Promise<boolean> {
  return new Promise((resolve) => {
    if (typeof window.Razorpay !== 'undefined') {
      resolve(true);
      return;
    }
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const openCheckout = async (options: RazorpayOptions): Promise<void> => {
    const loaded = await loadScript();
    if (!loaded) throw new Error('Failed to load Razorpay checkout. Check your internet connection.');
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return { openCheckout };
}
