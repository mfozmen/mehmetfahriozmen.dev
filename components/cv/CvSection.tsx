import SectionTitle from "@/components/SectionTitle";

export default function CvSection({ title, children, spacing = "md" }: Readonly<{ title: string; children: React.ReactNode; spacing?: "lg" | "md" }>) {
  const mb = spacing === "lg" ? "mb-16" : "mb-10";
  return (
    <section className={mb}>
      <SectionTitle title={title} />
      {children}
    </section>
  );
}
