import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
  NavbarButton,
} from "@/components/ui/resizable-navbar";
import { NAV_ITEMS, SITE } from "@/lib/site";
import mark from "@/assets/falschen-mark.png.asset.json";
import { ThemeToggle } from "@/components/site/ThemeToggle";

function BrandMark() {
  return (
    <Link
      to="/"
      className="relative z-20 mr-4 flex items-center gap-3 px-2 py-1"
      aria-label="Fälschen home"
    >
      <img
        src={mark.url}
        alt="Fälschen anvil and hammer mark"
        width={30}
        height={30}
        className="h-7 w-auto"
      />
      <span className="font-display text-sm font-bold tracking-[0.18em] text-ink">
        FÄLSCHEN
      </span>
    </Link>
  );
}

export function SiteNav() {
  const [open, setOpen] = useState(false);
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <div className="no-print relative w-full">
      <Navbar className="fixed top-4">
        <NavBody>
          <BrandMark />
          <NavItems items={NAV_ITEMS} />
          <div className="relative z-30 flex items-center gap-3">
            <ThemeToggle />
            {docked && (
              <NavbarButton
                as="button"
                variant="secondary"
                onClick={toTop}
                aria-label="Back to top"
              >
                ↑ Top
              </NavbarButton>
            )}
            {!docked && (
              <NavbarButton
                variant="secondary"
                href={SITE.researchPaper}
                target="_blank"
                rel="noreferrer"
              >
                Paper
              </NavbarButton>
            )}
            {!docked && (
              <NavbarButton variant="primary" href="#contact">
                Contact
              </NavbarButton>
            )}
          </div>
        </NavBody>

        <MobileNav>
          <MobileNavHeader>
            <BrandMark />
            <ThemeToggle className="ml-auto mr-3" />
            <MobileNavToggle isOpen={open} onClick={() => setOpen(!open)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={open} onClose={() => setOpen(false)}>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.link}
                href={item.link}
                onClick={() => setOpen(false)}
                className="label-mono text-ink"
              >
                {item.name}
              </a>
            ))}
            <div className="flex w-full flex-col gap-3 pt-2">
              {docked && (
                <NavbarButton
                  as="button"
                  variant="secondary"
                  className="w-full"
                  onClick={() => {
                    setOpen(false);
                    toTop();
                  }}
                >
                  ↑ Back to top
                </NavbarButton>
              )}
              <NavbarButton
                variant="secondary"
                href={SITE.researchPaper}
                target="_blank"
                rel="noreferrer"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Research paper
              </NavbarButton>
              <NavbarButton
                variant="primary"
                href="#contact"
                className="w-full"
                onClick={() => setOpen(false)}
              >
                Contact
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
