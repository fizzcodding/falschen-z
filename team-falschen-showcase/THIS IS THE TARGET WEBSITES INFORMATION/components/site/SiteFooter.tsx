import { NAV_ITEMS, SITE } from "@/lib/site";
import lockup from "@/assets/falschen-lockup.png.asset.json";

export function SiteFooter() {
  return (
    <footer className="bg-ink text-paper">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-5 py-16 lg:grid-cols-[1.2fr_0.8fr] lg:px-8">
        <div>
          <img
            src={lockup.url}
            alt="Fälschen — Forged. Wired. Perfected."
            width={320}
            height={90}
            className="h-16 w-auto invert"
          />
          <p className="label-mono mt-6 text-paper/70">{SITE.tagline}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-paper/70">
            Robotics, physics, and AI research out of {SITE.location}. Two
            researcher engineers, one bench, eleven awards.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8">
          <nav aria-label="Footer">
            <p className="label-mono text-paper/50">INDEX</p>
            <ul className="mt-4 space-y-3">
              {NAV_ITEMS.map((item) => (
                <li key={item.link}>
                  <a
                    href={item.link}
                    className="label-mono text-paper hover:text-phosphor"
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div>
            <p className="label-mono text-paper/50">DIRECT</p>
            <ul className="mt-4 space-y-3">
              <li>
                <a
                  href={`mailto:${SITE.email}`}
                  className="label-mono break-all text-paper hover:text-phosphor"
                >
                  {SITE.email}
                </a>
              </li>
              <li>
                <a
                  href={`tel:${SITE.phone}`}
                  className="label-mono text-paper hover:text-phosphor"
                >
                  {SITE.phoneLabel}
                </a>
              </li>
              <li>
                <a
                  href={SITE.lifesphereSite}
                  target="_blank"
                  rel="noreferrer"
                  className="label-mono text-paper hover:text-phosphor"
                >
                  LifeSphere site
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <div className="border-t-[3px] border-paper/20">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-5 py-6 lg:px-8">
          <p className="label-mono text-paper/50">
            © {new Date().getFullYear()} TEAM FÄLSCHEN
          </p>
          <p className="label-mono text-paper/50">
            BUILT IN DHAKA <span className="caret-blink">_</span>
          </p>
        </div>
      </div>
    </footer>
  );
}
