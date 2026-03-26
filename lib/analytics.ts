declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string>) => void;
    };
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, string>) {
  globalThis.window?.umami?.track(eventName, eventData);
}
