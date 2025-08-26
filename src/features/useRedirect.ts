import type {PaymentStatusManager} from "./../types/paymentStatus";
import {PaymentStatus, useCookies} from "o10r-pp-core";

const type = 'opp-redirect-completed';
const cookieKey = 'opp-redirect-completed';
const cookies = useCookies();

export default function (paymentStatusManager: PaymentStatusManager) {
  const parentWindow = window.parent;
  const opener = window.opener;
  const completedRedirectsHashes: string[] = [];
  const cookieValue: string[] = JSON.parse(cookies.get(cookieKey) || '[]');

  if (Array.isArray(cookieValue)) {
    completedRedirectsHashes.push(...cookieValue);
  }

  const completeRedirect = (hash: string) => {
    const event = { origin: window.location.origin, data: { type, hash } } as MessageEvent;

    handleRedirectComplete(event);

    if (parentWindow && parentWindow !== window && parentWindow.location.origin === window.location.origin) {
      parentWindow.postMessage({ type, hash }, window.location.origin);
    } else if (opener && opener.location.origin === window.location.origin) {
      opener.postMessage({ type, hash }, window.location.origin);

      window.close();
    }
  };

  const handleRedirectComplete = (e: MessageEvent) => {
    if (e.origin !== window.location.origin) return;
    if (e.data?.type === type && typeof e.data.hash === 'string') {
      completedRedirectsHashes.push(e.data.hash);

      cookies.set(cookieKey, JSON.stringify([...new Set(completedRedirectsHashes)]), { expires: 1 });

      paymentStatusManager.setPendingTill(
        (newPaymentStatusData) => {
          if (
            newPaymentStatusData.status === PaymentStatus.AWAITING_3DS_RESULT
            && 'redirect' in newPaymentStatusData.acs
            && newPaymentStatusData.acs.redirect.body
            && 'md' in newPaymentStatusData.acs.redirect.body
            && completedRedirectsHashes.includes(newPaymentStatusData.acs.redirect.body.md)
          ) {
            return true;
          }

          return false;
        }
      );
    }
  };

  window.addEventListener('message', handleRedirectComplete);

  return {
    completeRedirect
  };
}
