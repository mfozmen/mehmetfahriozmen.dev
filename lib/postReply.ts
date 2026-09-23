export function replyHref(title: string): string {
  return `/contact?re=${encodeURIComponent(title)}`;
}

export function replySubject(re: string | null): string | null {
  const title = re?.trim().slice(0, 120);
  return title ? `Re: ${title}` : null;
}

export function emailSubject(typed: string | null, name: string): string {
  return typed?.trim() || `Message from ${name.trim()}`;
}
