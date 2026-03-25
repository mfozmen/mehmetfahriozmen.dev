"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  { label: "Systems", href: "/#systems" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/contact" },
];

function HamburgerIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="3" y1="6" x2="21" y2="6" />
      <line x1="3" y1="12" x2="21" y2="12" />
      <line x1="3" y1="18" x2="21" y2="18" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <line x1="18" y1="6" x2="6" y2="18" />
      <line x1="6" y1="6" x2="18" y2="18" />
    </svg>
  );
}

function MobileDrawer({ open, onClose }: Readonly<{ open: boolean; onClose: () => void }>) {
  return (
    <>
      {/* Overlay */}
      <button
        type="button"
        className={`fixed inset-0 z-50 bg-black/60 backdrop-blur-sm transition-opacity duration-200 sm:hidden ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={onClose}
        aria-label="Close menu"
        tabIndex={open ? 0 : -1}
      />

      {/* Panel — div+role="dialog" instead of native <dialog>: UA styles override Tailwind positioning */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-64 bg-[#0a0a0a] border-l border-[#BA7517]/10 transition-transform duration-300 ease-out sm:hidden ${open ? "translate-x-0" : "translate-x-full"}`}
        role="dialog" // NOSONAR
        aria-modal={open || undefined}
        aria-hidden={!open}
        aria-label="Navigation menu"
        inert={!open || undefined}
      >
        <div className="flex items-center justify-between px-6 py-5">
          <span className="font-mono text-xs uppercase tracking-[0.15em] text-[#BA7517]/50">
            Menu
          </span>
          <button
            onClick={onClose}
            className="text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA7517]/60 rounded-sm p-1"
            aria-label="Close menu"
          >
            <CloseIcon />
          </button>
        </div>
        <ul className="mt-4 flex flex-col gap-1 px-4">
          {links.map((link) => (
            <li key={link.label}>
              <Link
                href={link.href}
                onClick={onClose}
                className="block rounded-lg px-3 py-3 text-sm text-neutral-300 transition-colors hover:bg-[#BA7517]/[0.06] hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA7517]/60"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
}

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="relative z-50 flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="text-xl font-bold tracking-tight text-white">
        MFÖ
      </Link>

      {/* Desktop links */}
      <ul className="hidden items-center gap-8 sm:flex">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA7517]/60 focus-visible:ring-offset-2 focus-visible:ring-offset-[#0a0a0a] rounded-sm"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>

      {/* Mobile hamburger */}
      <button
        onClick={() => setOpen(true)}
        className="sm:hidden text-neutral-400 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#BA7517]/60 rounded-sm p-1"
        aria-label="Open menu"
      >
        <HamburgerIcon />
      </button>

      <MobileDrawer open={open} onClose={() => setOpen(false)} />
    </nav>
  );
}
