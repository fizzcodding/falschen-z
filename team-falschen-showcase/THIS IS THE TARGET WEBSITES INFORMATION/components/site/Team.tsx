import { SectionHeading } from "@/components/site/SectionHeading";
import { TEAM } from "@/lib/site";
import { Reveal } from "@/components/site/Reveal";

export function Team() {
  return (
    <section id="team" className="relative border-b-[3px] border-ink">
      <div className="grid-schematic pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading index="SEC 03" kicker="THE MINDS" title="TEAM SHEET" />

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Two researcher engineers who have built and competed together across
          robotics, physics, and AI for years.
        </p>

        <div className="mt-12 grid grid-cols-1 items-stretch gap-6 md:grid-cols-2">
          {TEAM.map((member, mi) => (
            <Reveal key={member.name} delay={mi * 90} className="h-full">
            <article
              className="panel-flat relative flex h-full flex-col"
            >
              <div className="grid min-h-[210px] grid-cols-[110px_1fr] gap-5 p-6">
                <div className="flex aspect-square items-center justify-center border-[3px] border-ink bg-ink">
                  <span className="font-display text-3xl font-bold text-paper">
                    {member.name
                      .split(" ")
                      .map((w) => w[0])
                      .join("")
                      .slice(0, 3)}
                  </span>
                </div>
                <div>
                  <h3 className="font-display text-2xl font-bold">
                    {member.name}
                  </h3>
                  <p className="label-mono mt-2 phosphor-text">{member.role}</p>
                  <p className="label-mono mt-2 text-muted-foreground">
                    {member.level}
                  </p>
                  <p className="label-mono mt-4 text-muted-foreground">
                    {member.discipline}
                  </p>
                </div>
              </div>

              <div className="mt-auto flex flex-1 flex-col border-t-[3px] border-ink px-6 py-5">
                <p className="label-mono text-muted-foreground">RECORD</p>
                <ul className="mt-3 space-y-2">
                  {member.lines.map((line) => (
                    <li
                      key={line}
                      className="grid grid-cols-[auto_1fr] gap-3 text-sm leading-relaxed"
                    >
                      <span className="label-mono pt-1 text-muted-foreground">
                        &gt;
                      </span>
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
