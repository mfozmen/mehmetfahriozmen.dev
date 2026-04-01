import Link from "next/link";
import Image from "next/image";
import Starfield from "@/components/Starfield";
import NebulaGlows from "@/components/NebulaGlows";

export default function NotFound() {
  return (
    <>
      <Starfield />
      <NebulaGlows />
      <main className="relative z-10 flex min-h-dvh flex-col items-center justify-center px-6 py-24 text-center">
        <span
          className="font-mono text-[80px] font-bold leading-none text-[#BA7517] sm:text-[120px]"
          style={{ textShadow: "0 0 40px rgba(186,117,23,0.15)" }}
        >
          404
        </span>
        <h1 className="mt-4 text-2xl font-bold text-white sm:text-3xl">
          Signal Lost
        </h1>
        <p className="mt-3 max-w-md text-base text-neutral-500">
          This sector doesn&apos;t exist. The coordinates were probably wrong.
        </p>
        <Image
          src="/images/404-astronaut.png"
          alt=""
          width={220}
          height={220}
          className="mt-8 opacity-90"
          priority
          aria-hidden="true"
        />
        <Link
          href="/"
          className="mt-8 rounded-full border border-[#BA7517]/40 px-5 py-2 text-sm text-[#BA7517] transition-colors hover:border-[#BA7517]/70 hover:text-white"
        >
          Return to base →
        </Link>
      </main>
    </>
  );
}
