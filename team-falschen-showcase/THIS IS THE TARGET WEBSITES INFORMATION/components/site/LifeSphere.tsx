import { SectionHeading } from "@/components/site/SectionHeading";
import { Tooltip } from "@/components/ui/tooltip-card";
import { AsciiArt } from "@/components/ui/ascii-art";
import { InfiniteMovingCards } from "@/components/ui/infinite-moving-cards";
import LogoLoop from "@/components/ui/LogoLoop";
import { RECOGNITION, SITE, SUBSYSTEMS } from "@/lib/site";
import lifesphereMark from "@/assets/lifesphere-mark.png.asset.json";

const STACK = [
  "ESP32",
  "ROS2",
  "SLAM",
  "UWB",
  "WHISPER",
  "LIBROSA",
  "FIREBASE",
  "MQTT",
  "OPENCV",
  "PYTHON",
].map((label) => ({
  node: (
    <span className="label-mono whitespace-nowrap border-[3px] border-ink px-4 py-2 text-ink">
      {label}
    </span>
  ),
  title: label,
}));

function Glossary({ terms }: { terms: { term: string; definition: string }[] }) {
  if (terms.length === 0) return null;
  return (
    <div className="mt-5 flex flex-wrap gap-2 border-t-[3px] border-ink pt-4">
      {terms.map((t) => (
        <Tooltip
          key={t.term}
          content={
            <span className="block max-w-xs text-sm leading-relaxed">
              <span className="label-mono phosphor-text block pb-1">
                {t.term}
              </span>
              {t.definition}
            </span>
          }
        >
          <span className="label-mono cursor-help border-b-[3px] border-phosphor pb-0.5 text-ink">
            {t.term} ?
          </span>
        </Tooltip>
      ))}
    </div>
  );
}

export function LifeSphere() {
  return (
    <section
      id="lifesphere"
      className="relative border-b-[3px] border-ink bg-paper"
    >
      <div className="grid-schematic pointer-events-none absolute inset-0 opacity-60" />
      <div className="relative mx-auto max-w-7xl px-5 py-20 lg:px-8 lg:py-28">
        <SectionHeading
          index="SEC 01"
          kicker="THE SPOTLIGHT OF THIS YEAR"
          title="LIFESPHERE"
        />

        <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-[1.15fr_0.85fr]">
          <div>
            <p className="max-w-2xl text-lg leading-relaxed">
              An AI powered autonomous caregiving ecosystem. Five subsystems
              split across a wearable, a mobile robot, an emotion inference
              stack, an entry checkpoint, and the home automation bus that ties
              them together.
            </p>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted-foreground">
              Internationally recognised: 11 national and international awards,
              including WICE 2025 gold in Malaysia.
            </p>
          </div>
          <div className="panel-flat p-4">
            <AsciiArt
              src={lifesphereMark.url}
              resolution={72}
              charset="blocks"
              color="#0f1b2d"
              backgroundColor="#f6f6f6"
              animated={false}
              className="aspect-square w-full"
            />
            <p className="label-mono mt-3 text-muted-foreground">
              LIFESPHERE MARK / RASTER READOUT
            </p>
          </div>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 md:grid-cols-2">
          {SUBSYSTEMS.map((s, i) => (
            <article
              key={s.id}
              className={`panel-flat p-6 ${i === 0 ? "md:col-span-2" : ""}`}
            >
              <div className="flex items-baseline justify-between gap-4 border-b-[3px] border-ink pb-4">
                <h3 className="font-display text-2xl font-bold">{s.name}</h3>
                <span className="label-mono text-muted-foreground">
                  SYS {s.id}
                </span>
              </div>
              <p className="label-mono mt-4 phosphor-text">{s.role}</p>
              <ul className="mt-4 space-y-2">
                {s.spec.map((line) => (
                  <li
                    key={line}
                    className="grid grid-cols-[auto_1fr] gap-3 text-base leading-relaxed"
                  >
                    <span className="label-mono pt-1 text-muted-foreground">
                      &gt;
                    </span>
                    <span>{line}</span>
                  </li>
                ))}
              </ul>
              <Glossary terms={s.glossary} />
            </article>
          ))}
        </div>

        <div className="mt-14 overflow-hidden border-[3px] border-ink py-6">
          <p className="label-mono px-6 pb-4 text-muted-foreground">
            STACK / LIFESPHERE
          </p>
          <LogoLoop
            logos={STACK}
            speed={60}
            gap={24}
            logoHeight={20}
            fadeOut
            fadeOutColor="var(--paper)"
            ariaLabel="LifeSphere technology stack"
          />
        </div>

        <div className="mt-14">
          <p className="label-mono text-muted-foreground">
            RECOGNITION / INTERNATIONAL
          </p>
          <InfiniteMovingCards
            items={RECOGNITION}
            direction="left"
            speed="slow"
            className="mt-4"
          />
        </div>

        <div className="mt-14 flex flex-wrap justify-center gap-4">
          <a
            href={SITE.researchPaper}
            target="_blank"
            rel="noreferrer"
            className="label-mono border-[3px] border-ink bg-ink px-7 py-4 text-paper shadow-[4px_4px_0_var(--ink)] transition-transform duration-150 hover:-translate-y-0.5"
          >
            Visit the research paper
          </a>
          <a
            href={SITE.lifesphereSite}
            target="_blank"
            rel="noreferrer"
            className="label-mono border-[3px] border-ink bg-paper px-7 py-4 text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
          >
            Visit the LifeSphere site
          </a>
        </div>
      </div>
    </section>
  );
}
