/* Signal Forge navigation composition: fixed position, scroll-based dock, smooth fade transitions. */
"use client";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";
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

const logoUrl = "/assets/text-dark-version.png";

export default function NavbarDemo({
  menuOpen,
  setMenuOpen,
}: {
  menuOpen?: boolean;
  setMenuOpen?: (open: boolean) => void;
}) {
  const [internalOpen, setInternalOpen] = useState(false);
  const isOpen = menuOpen ?? internalOpen;
  const setOpen = setMenuOpen ?? setInternalOpen;
  const [docked, setDocked] = useState(false);

  useEffect(() => {
    const onScroll = () => setDocked(window.scrollY > 100);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const toTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const navItems = [
    { name: "LIFESPHERE", link: "#lifesphere" },
    { name: "RESEARCH", link: "#research" },
    { name: "TEAM", link: "#team" },
    { name: "CONTACT", link: "#contact" },
  ];

  return (
    <div className="nav-wrap">
      <Navbar>
        {/* Desktop Navigation */}
        <NavBody>
          <NavbarLogo logoUrl={logoUrl} />
          <NavItems items={navItems} />
          <div className="relative z-30 flex items-center gap-2">
            <AnimatePresence mode="wait">
              {!docked ? (
                <motion.div
                  key="hero-buttons"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-2"
                >
                  <NavbarButton href="#contact" variant="secondary">
                    CONTACT
                  </NavbarButton>
                  <NavbarButton href="#lifesphere" variant="primary">
                    TRACE THE BUILD
                  </NavbarButton>
                </motion.div>
              ) : (
                <motion.div
                  key="docked-button"
                  initial={{ opacity: 0, y: -8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                  className="flex items-center gap-2"
                >
                  <NavbarButton variant="secondary" onClick={toTop}>
                    ↑ TOP
                  </NavbarButton>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </NavBody>

        {/* Mobile Navigation */}
        <MobileNav>
          <MobileNavHeader>
            <NavbarLogo logoUrl={logoUrl} />
            <MobileNavToggle
              isOpen={isOpen}
              onClick={() => setOpen(!isOpen)}
            />
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
            <div className="flex w-full flex-col gap-3 pt-2">
              <AnimatePresence mode="wait">
                {docked && (
                  <motion.div
                    key="mobile-top"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <NavbarButton
                      variant="secondary"
                      className="w-full"
                      onClick={() => {
                        setOpen(false);
                        toTop();
                      }}
                    >
                      ↑ BACK TO TOP
                    </NavbarButton>
                  </motion.div>
                )}
              </AnimatePresence>
              <NavbarButton
                href="#contact"
                onClick={() => setOpen(false)}
                variant="primary"
                className="w-full"
              >
                CONTACT TEAM
              </NavbarButton>
            </div>
          </MobileNavMenu>
        </MobileNav>
      </Navbar>
    </div>
  );
}
