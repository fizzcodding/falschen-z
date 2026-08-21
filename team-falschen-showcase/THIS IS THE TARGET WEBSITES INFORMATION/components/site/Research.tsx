import { SectionHeading } from "@/components/site/SectionHeading";
import { RESEARCH } from "@/lib/site";

export function Research() {
  return (
    <section id="research" className="relative border-b-[3px] border-ink">
      <div className="grid-schematic pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          index="SEC 02"
          kicker="PHYSICS PROGRAMME"
          title="ENTROPIA / CONVERGŌ"
        />

        <p className="mt-8 max-w-2xl text-base leading-relaxed text-muted-foreground">
          Entropia came first and set the method. Convergō is the current line,
          on the bench now and targeting ISEF.
        </p>

        <div className="mt-12 grid grid-cols-1 gap-6 md:grid-cols-2">
          {RESEARCH.map((r) => (
            <article key={r.id} className="panel-flat p-6">
              <div className="flex items-baseline justify-between gap-4 border-b-[3px] border-ink pb-4">
                <h3 className="font-display text-2xl font-bold">{r.name}</h3>
                <span
                  className={`label-mono px-2 py-1 ${
                    r.status === "Active"
                      ? "bg-phosphor text-paper"
                      : "border-[3px] border-ink text-muted-foreground"
                  }`}
                >
                  {r.status}
                </span>
              </div>
              <p className="label-mono mt-4 text-muted-foreground">
                {r.id} / {r.period}
              </p>
              <p className="mt-4 text-lg leading-relaxed">{r.summary}</p>
              <ul className="mt-5 space-y-2 border-t-[3px] border-ink pt-4">
                {r.detail.map((d) => (
                  <li
                    key={d}
                    className="grid grid-cols-[auto_1fr] gap-3 text-base leading-relaxed"
                  >
                    <span className="label-mono pt-1 text-muted-foreground">
                      &gt;
                    </span>
                    <span>{d}</span>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <p className="label-mono mt-10 border-[3px] border-ink px-6 py-4">
          PEER REVIEWER / ABDUS SAMI AKANDA
          <span className="block pt-2 text-muted-foreground normal-case">
            Peer reviewer on the research, not a formal mentor.
          </span>
        </p>
      </div>
    </section>
  );
}
