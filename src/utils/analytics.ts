/**
 * Foryn Enterprise Analytics & Event Tracking Utility
 */

export interface AnalyticsEvent {
  eventName: string;
  category?: string;
  label?: string;
  value?: number;
  metadata?: Record<string, any>;
}

export function initAnalytics(): void {
  if (typeof window === 'undefined') return;
  
  // Track initial page view
  trackPageView(window.location.pathname);

  // Global error telemetry logging
  window.addEventListener('error', (event) => {
    trackEvent({
      eventName: 'app_exception',
      category: 'error',
      label: event.message,
      metadata: { filename: event.filename, lineno: event.lineno }
    });
  });
}

export function trackPageView(pagePath: string): void {
  if (typeof window === 'undefined') return;
  
  // Update document title or trigger analytics beacon
  console.log(`[Analytics] Page View: ${pagePath}`);

  if ((window as any).gtag) {
    (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
      page_path: pagePath,
    });
  }
}

export function trackEvent({ eventName, category = 'user_action', label, value, metadata }: AnalyticsEvent): void {
  console.log(`[Analytics] Event: ${eventName}`, { category, label, value, metadata });

  if ((window as any).gtag) {
    (window as any).gtag('event', eventName, {
      event_category: category,
      event_label: label,
      value: value,
      ...metadata
    });
  }
}
