"use client";

import Link from "next/link";
import { trackEvent } from "@/lib/analytics";

type TrackedProps = Readonly<{
  eventName: string;
  eventData: Record<string, string>;
  children: React.ReactNode;
}>;

export function TrackedAnchor({
  href,
  eventName,
  eventData,
  children,
  ...props
}: TrackedProps & React.AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  return (
    <a
      href={href}
      onClick={() => trackEvent(eventName, eventData)}
      {...props}
    >
      {children}
    </a>
  );
}

export function TrackedNextLink({
  href,
  eventName,
  eventData,
  children,
  ...props
}: TrackedProps & Omit<React.ComponentProps<typeof Link>, "onClick">) {
  return (
    <Link
      href={href}
      onClick={() => trackEvent(eventName, eventData)}
      {...props}
    >
      {children}
    </Link>
  );
}
