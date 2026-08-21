export function SectionHeading({
  index,
  title,
  kicker,
}: {
  index: string;
  title: string;
  kicker: string;
}) {
  return (
    <header className="border-b-[3px] border-ink pb-6">
      <p className="label-mono text-muted-foreground">
        {index} / {kicker}
      </p>
      <h2 className="mt-3 font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
        {title}
      </h2>
    </header>
  );
}
