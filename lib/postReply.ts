export function replyHref(title: string): string {
  return `/contact?re=${encodeURIComponent(title)}`;
}

export function replySubject(re: string | null): string | null {
  const title = re?.trim().slice(0, 120);
  return title ? `Re: ${title}` : null;
}

export function emailSubject(typed: string | null, name: string): string {
  const subject = typed?.trim() || `Message from ${name.trim()}`;
  // One line only: a newline smuggled in via ?re= must not read as an extra mail header.
  return subject.replace(/\s+/g, " ");
}
