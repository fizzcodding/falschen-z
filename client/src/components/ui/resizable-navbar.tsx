/* Signal Forge navigation primitive: fixed positioning, 3px dark outline always, smooth scroll transitions.
 * Uses width + y spring (critically damped, stiffness 280, damping 36) — no rubber bounce.
 * backdrop-filter / boxShadow / backgroundColor all animated via framer-motion values.
 */
"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "motion/react";
import React, { useRef, useState } from "react";

/* ── Shared spring: critically damped — no overshoot at all ── */
const NAV_SPRING = { type: "spring", stiffness: 280, damping: 36 } as const;
const FAST_TWEEN = { type: "tween", duration: 0.28, ease: [0.23, 1, 0.32, 1] } as const;

interface NavbarProps {
  children: React.ReactNode;
  className?: string;
}
interface NavBodyProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}
interface NavItemsProps {
  items: { name: string; link: string }[];
  className?: string;
  onItemClick?: () => void;
}
interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
  visible?: boolean;
}
interface MobileNavHeaderProps {
  children: React.ReactNode;
  className?: string;
}
interface MobileNavMenuProps {
  children: React.ReactNode;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
}

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <div
      ref={ref}
      className={cn("fixed inset-x-0 top-4 z-50 w-full px-4", className)}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        width: visible ? "62%" : "100%",
        y: visible ? 4 : 0,
        backgroundColor: visible
          ? "rgba(246,246,246,0.94)"
          : "rgba(246,246,246,0.99)",
        backdropFilter: visible ? "blur(14px)" : "blur(0px)",
        boxShadow: visible
          ? "0 6px 28px rgba(16,26,46,0.09), 0 1px 0 rgba(16,26,46,0.06)"
          : "0 0 0 rgba(16,26,46,0)",
        paddingTop: visible ? "8px" : "12px",
        paddingBottom: visible ? "8px" : "12px",
      }}
      transition={{
        width: NAV_SPRING,
        y: NAV_SPRING,
        backgroundColor: FAST_TWEEN,
        backdropFilter: FAST_TWEEN,
        boxShadow: FAST_TWEEN,
        paddingTop: NAV_SPRING,
        paddingBottom: NAV_SPRING,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between border-[3px] border-[#101A2E] px-5 py-3 lg:flex",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <motion.div
      onMouseLeave={() => setHovered(null)}
      className={cn(
        "absolute inset-0 hidden flex-1 flex-row items-center justify-center gap-1 text-[11px] font-bold tracking-[.16em] text-[#101A2E] lg:flex",
        className,
      )}
    >
      {items.map((item, idx) => (
        <a
          onMouseEnter={() => setHovered(idx)}
          onClick={onItemClick}
          className="relative px-3 py-2"
          key={item.name}
          href={item.link}
        >
          {hovered === idx && (
            <motion.span
              layoutId="nav-hover"
              className="absolute inset-0 -z-10 border border-[#101A2E] bg-[#8BFF6A]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{
                opacity: { duration: 0.15, ease: "easeOut" },
                layout: { type: "spring", stiffness: 380, damping: 36 },
              }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({ children, className, visible }: MobileNavProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        width: visible ? "88%" : "100%",
        y: visible ? 4 : 0,
        backgroundColor: visible
          ? "rgba(246,246,246,0.96)"
          : "rgba(246,246,246,0.99)",
        backdropFilter: visible ? "blur(14px)" : "blur(0px)",
        boxShadow: visible
          ? "0 6px 28px rgba(16,26,46,0.09)"
          : "0 0 0 rgba(16,26,46,0)",
      }}
      transition={{
        width: NAV_SPRING,
        y: NAV_SPRING,
        backgroundColor: FAST_TWEEN,
        backdropFilter: FAST_TWEEN,
        boxShadow: FAST_TWEEN,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col border-[3px] border-[#101A2E] px-3 py-2 lg:hidden",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => {
  return (
    <div className={cn("flex w-full flex-row items-center justify-between", className)}>
      {children}
    </div>
  );
};

export const MobileNavMenu = ({ children, className, isOpen }: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -8, scaleY: 0.96 }}
          animate={{ opacity: 1, y: 0, scaleY: 1 }}
          exit={{ opacity: 0, y: -8, scaleY: 0.96 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          style={{ transformOrigin: "top" }}
          className={cn(
            "absolute inset-x-[-3px] top-[calc(100%+3px)] flex flex-col gap-4 border-[3px] border-[#101A2E] bg-[#F6F6F6] p-4",
            className,
          )}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      aria-label={isOpen ? "Close menu" : "Open menu"}
      onClick={onClick}
      className="border-0 bg-transparent p-1 text-[#101A2E] transition-transform active:scale-95"
    >
      {isOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}
    </button>
  );
};

export const NavbarLogo = ({ logoUrl }: { logoUrl: string }) => {
  return (
    <a
      href="#top"
      className="relative z-20 flex flex-shrink-0 items-center"
      aria-label="Team Fälschen home"
    >
      <img src={logoUrl} alt="Team Fälschen" className="h-12 w-auto object-contain" />
    </a>
  );
};

export const NavbarButton = ({
  href,
  children,
  className,
  variant = "primary",
  onClick,
  ...props
}: {
  href?: string;
  children: React.ReactNode;
  className?: string;
  variant?: "primary" | "secondary";
  onClick?: () => void;
} & React.ComponentPropsWithoutRef<"a">) => {
  return (
    <a
      href={href || undefined}
      onClick={onClick}
      className={cn(
        "mono inline-flex flex-shrink-0 items-center justify-center border-[3px] border-[#101A2E] px-3 py-2 text-[10px] font-bold tracking-[.12em] transition-all duration-150 active:translate-y-[2px] active:scale-95",
        variant === "primary"
          ? "bg-[#101A2E] shadow-[4px_4px_0_#8BFF6A] hover:translate-x-[-1px] hover:translate-y-[-1px] hover:shadow-[5px_5px_0_#8BFF6A]"
          : "bg-transparent hover:bg-[#8BFF6A]",
        variant === "primary" ? "!text-[#F6F6F6]" : "!text-[#101A2E]",
        className,
      )}
      style={{ color: variant === "primary" ? "#F6F6F6" : "#101A2E" }}
      {...props}
    >
      {children}
    </a>
  );
};
