import Image from "next/image";

export default function Hero() {
  return (
    <section className="flex flex-col items-center gap-12 md:flex-row md:justify-between md:gap-16">
      <div className="flex flex-col items-center text-center md:items-start md:text-left">
        <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          Mehmet Fahri Özmen
        </h1>
        <p className="mt-3 text-lg text-neutral-400">
          Backend Systems Architect · Engineering Leader
        </p>
        <p className="mt-6 max-w-lg text-xl leading-relaxed text-neutral-200">
          &ldquo;I design and build backend systems used by millions of
          users.&rdquo;
        </p>
        <p className="mt-4 max-w-md text-sm text-neutral-500">
          Distributed systems, scalable microservices, search platforms and
          commerce infrastructure.
        </p>
      </div>

      <div className="shrink-0">
        <Image
          src="/fahri.jpg"
          alt="Mehmet Fahri Özmen"
          width={280}
          height={280}
          priority
          className="rounded-full shadow-lg shadow-black/40"
        />
      </div>
    </section>
  );
}
