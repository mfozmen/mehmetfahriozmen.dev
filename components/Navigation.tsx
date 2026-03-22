import Link from "next/link";

const links = [
  { label: "Systems", href: "/#systems" },
  { label: "Writing", href: "/writing" },
  { label: "About", href: "/about" },
  { label: "CV", href: "/cv" },
  { label: "Contact", href: "/contact" },
];

export default function Navigation() {
  return (
    <nav className="flex items-center justify-between px-6 py-5 sm:px-10">
      <Link href="/" className="text-xl font-bold tracking-tight text-white">
        MFÖ
      </Link>
      <ul className="hidden items-center gap-8 sm:flex">
        {links.map((link) => (
          <li key={link.label}>
            <Link
              href={link.href}
              className="text-sm text-neutral-400 transition-colors hover:text-white"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
