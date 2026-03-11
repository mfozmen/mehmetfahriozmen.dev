import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row md:justify-between md:gap-16">
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <span className="text-7xl font-bold tracking-tight text-white sm:text-8xl">
          MFÖ
        </span>
        <h1 className="mt-4 text-2xl font-semibold text-white sm:text-3xl">
          Mehmet Fahri Özmen
        </h1>
        <p className="mt-2 text-lg text-neutral-400">
          Backend Systems Architect · Engineering Leader
        </p>
        <p className="mt-4 max-w-md text-neutral-500">
          &ldquo;I design and build backend systems used by millions of
          users.&rdquo;
        </p>
      </div>

      <div className="shrink-0">
        <Image
          src="/fahri.jpg"
          alt="Mehmet Fahri Özmen"
          width={260}
          height={260}
          priority
          className="rounded-full shadow-lg shadow-black/40"
        />
      </div>
    </section>
  );
}
