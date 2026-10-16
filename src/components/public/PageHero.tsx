/** Header band shared by the inner public pages (Conferences, Events, About, Contact, …). */
export function PageHero({
  eyebrow,
  title,
  description,
  children,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden border-b border-ink-200/60 bg-gradient-to-b from-brand-50/80 via-paper-50 to-paper-50">
      <div
        className="bg-dots-dark absolute inset-0 opacity-70 [mask-image:linear-gradient(to_bottom,black,transparent_85%)]"
        aria-hidden
      />
      <div className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-brand-200/40 blur-3xl" aria-hidden />
      <div className="container-page relative py-12 sm:py-16">
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h1 className="max-w-3xl animate-fade-up font-serif text-3xl font-bold tracking-tight text-ink-900 sm:text-5xl">{title}</h1>
        {description && <p className="mt-4 max-w-2xl animate-fade-up text-base leading-relaxed text-ink-600 [animation-delay:80ms] sm:text-lg">{description}</p>}
        {children && <div className="mt-6">{children}</div>}
      </div>
    </section>
  );
}
