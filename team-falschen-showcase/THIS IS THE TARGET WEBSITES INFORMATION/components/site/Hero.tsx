import { Typewriter } from "@/components/site/Typewriter";
import { DottedGlowBackground } from "@/components/ui/dotted-glow-background";
import { ImagesBadge } from "@/components/ui/images-badge";
import { GlobeClient } from "@/components/site/GlobeClient";
import { SITE } from "@/lib/site";
import mark from "@/assets/falschen-mark.png.asset.json";
import lifesphereMark from "@/assets/lifesphere-mark.png.asset.json";

export function Hero() {
  return (
    <section
      id="top"
      className="scanlines relative w-full overflow-hidden border-b-[3px] border-ink"
    >
      <div className="pointer-events-none absolute inset-0 opacity-70">
        <DottedGlowBackground
          gap={26}
          radius={1.2}
          color="#0f1b2d"
          glowColor="#e56a00"
          opacity={0.5}
          speedScale={0.5}
        />
      </div>
      <div className="grid-schematic pointer-events-none absolute inset-0" />

      <div className="relative mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 pt-36 pb-16 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:px-8 lg:pt-44 lg:pb-24">
        <div className="max-w-2xl">
          <p className="label-mono text-muted-foreground">
            BIIN SHOWCASE / {SITE.location} / EST. TEAM OF TWO
          </p>

          <h1 className="mt-6 font-display text-4xl leading-[1.05] font-bold sm:text-5xl lg:text-6xl">
            TEAM FÄLSCHEN
            <span className="mt-2 block text-2xl sm:text-3xl lg:text-4xl">
              <Typewriter
                words={["Robotics", "Innovation", "Physics", "Programming"]}
                className="phosphor-text font-display"
              />
            </span>
          </h1>

          <p className="mt-5 max-w-lg font-display text-sm tracking-[0.14em] uppercase">
            Dominant in every category.
          </p>

          <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground">
            Two researcher engineers building across robotics, physics, and AI:
            an autonomous caregiving ecosystem in hardware, and interferometry
            research on the bench.
          </p>

          <div className="mt-9 flex flex-col items-start gap-5">
            <ImagesBadge
              text="View Our Latest Research Paper"
              href={SITE.researchPaper}
              target="_blank"
              images={[mark.url, lifesphereMark.url]}
              className="border-[3px] border-ink bg-paper px-4 py-2 font-display text-xs tracking-[0.14em] uppercase"
            />
            <div className="flex flex-wrap gap-4">
              <a
                href="#lifesphere"
                className="label-mono border-[3px] border-ink bg-ink px-6 py-3 text-paper shadow-[4px_4px_0_var(--ink)] transition-transform duration-150 hover:-translate-y-0.5"
              >
                AI Autonomous Caregiving Ecosystem
              </a>
              <a
                href="#team"
                className="label-mono border-[3px] border-ink bg-paper px-6 py-3 text-ink transition-colors duration-150 hover:bg-ink hover:text-paper"
              >
                View the Minds
              </a>
            </div>
          </div>

          <dl className="mt-12 grid max-w-lg grid-cols-3 border-[3px] border-ink">
            {[
              ["11", "Awards"],
              ["05", "Subsystems"],
              ["02", "Researchers"],
            ].map(([value, label], i) => (
              <div
                key={label}
                className={`px-4 py-4 ${i < 2 ? "border-r-[3px] border-ink" : ""}`}
              >
                <dt className="label-mono text-muted-foreground">{label}</dt>
                <dd className="mt-1 font-display text-2xl font-bold">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative order-first h-[320px] w-full sm:h-[420px] lg:order-last lg:h-[560px]">
          <GlobeClient />
          <p className="label-mono absolute bottom-0 left-0 text-muted-foreground">
            COVERAGE / 23.8103 N, 90.4125 E
          </p>
        </div>
      </div>
    </section>
  );
}
