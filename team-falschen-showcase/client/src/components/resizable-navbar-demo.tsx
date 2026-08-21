/* Signal Forge navigation composition: sourced resizable-navbar API, compact sharp dock, mobile-first behavior.
 * Enhancements per target spec: compact 7px-height brand mark, centered section links,
 * right-side PAPER (primary) + CONTACT (secondary) CTAs, and a scroll-triggered ↑ TOP dock button.
 */
"use client";
import { useState } from "react";
import { IconArrowUp } from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import {
  Navbar,
  NavBody,
  NavItems,
  MobileNav,
  NavbarLogo,
  NavbarButton,
  MobileNavHeader,
  MobileNavToggle,
  MobileNavMenu,
} from "@/components/ui/resizable-navbar";
import { useScrollTop } from "@/hooks/useScrollTop";

const logoUrl = "/assets/falschen-mark.svg";
import { PAPER_URL } from "@/data/lifesphere";

const paperUrl = PAPER_URL;

export default function NavbarDemo({ menuOpen, setMenuOpen }: { menuOpen?: boolean; setMenuOpen?: (open: boolean) => void }) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = menuOpen ?? internalOpen;
  const setOpen = setMenuOpen ?? setInternalOpen;
  const scrolled = useScrollTop(100);

  const navItems = [
    { name: "LIFESPHERE", link: "#lifesphere" },
    { name: "RESEARCH", link: "#research" },
    { name: "TEAM", link: "#team" },
    { name: "CONTACT", link: "#contact" },
  ];

  return (
    <div className="nav-wrap">
      <Navbar>
        <NavBody>
          <NavbarLogo logoUrl={logoUrl} />
          <NavItems items={navItems} />
          <div className="flex items-center gap-2">
            <AnimatePresence>
              {scrolled && (
                <motion.a
                  href="#top"
                  className="sharp-button sharp-button-top"
                  initial={{ opacity: 0, x: 8 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 8 }}
                  transition={{ duration: 0.16, ease: "easeOut" }}
                  aria-label="Back to top"
                >
                  <IconArrowUp size={15} strokeWidth={2.5} />
                  <span>TOP</span>
                </motion.a>
              )}
            </AnimatePresence>
            <NavbarButton href={paperUrl} variant="primary">PAPER</NavbarButton>
            <NavbarButton href="#contact" variant="secondary">CONTACT</NavbarButton>
          </div>
        </NavBody>
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo logoUrl={logoUrl} />
            <MobileNavToggle isOpen={isOpen} onClick={() => setOpen(!isOpen)} />
          </MobileNavHeader>
          <MobileNavMenu isOpen={isOpen} onClose={() => setOpen(false)}>
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.link}
                onClick={() => setOpen(false)}
                className="mono border-b border-[#101A2E]/30 pb-2 text-[11px] font-bold tracking-[.16em] text-[#101A2E]"
              >
                {item.name}
              </a>
            ))}
            {scrolled && (
              <a
                href="#top"
                onClick={() => setOpen(false)}
                className="mono border-b border-[#101A2E]/30 pb-2 text-[11px] font-bold tracking-[.16em] text-[#426d32]"
              >
                ↑ TOP
              </a>
            )}
            <NavbarButton href={paperUrl} onClick={() => setOpen(false)} variant="primary" className="w-full">PAPER</NavbarButton>
            <NavbarButton href="#contact" onClick={() => setOpen(false)} variant="secondary" className="w-full">CONTACT TEAM</NavbarButton>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
