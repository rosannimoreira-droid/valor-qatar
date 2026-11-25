export interface AnalyticsPayload {
  locale: 'en' | 'ar';
  sku?: string;
  category?: string;
  occasion?: string;
  sourceSurface?: string;
  searchTerm?: string;
  resultsCount?: number;
}

declare global {
  interface Window {
    dataLayer?: Array<Record<string, unknown>>;
    valorTrack?: (eventName: string, payload: AnalyticsPayload) => void;
  }
}

export function attachAnalyticsHelper(): string {
  return `
    window.valorTrack = function(eventName, payload) {
      var eventObj = Object.assign({ event: eventName, timestamp: Date.now() }, payload || {});
      if (Array.isArray(window.dataLayer)) {
        window.dataLayer.push(eventObj);
      }
      window.dispatchEvent(new CustomEvent('valor:analytics', { detail: eventObj }));
    };
  `;
}
