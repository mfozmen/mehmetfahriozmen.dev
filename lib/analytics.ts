declare global {
  interface Window {
    umami?: {
      track: (eventName: string, eventData?: Record<string, string>) => void;
    };
  }
}

export function trackEvent(eventName: string, eventData?: Record<string, string>) {
  if (typeof globalThis.window !== "undefined" && globalThis.window.umami) {
    globalThis.window.umami.track(eventName, eventData);
  }
}
