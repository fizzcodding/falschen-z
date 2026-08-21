/* Signal Forge navigation primitive: fixed positioning, 3px dark outline always, smooth scroll transitions. */
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
  const { scrollY } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });
  const [visible, setVisible] = useState(false);

  useMotionValueEvent(scrollY, "change", (latest) => {
    setVisible(latest > 100);
  });

  return (
    <motion.div
      ref={ref}
      className={cn(
        "fixed inset-x-0 top-4 z-50 w-full px-4",
        className,
      )}
    >
      {React.Children.map(children, (child) =>
        React.isValidElement(child)
          ? React.cloneElement(
              child as React.ReactElement<{ visible?: boolean }>,
              { visible },
            )
          : child,
      )}
    </motion.div>
  );
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: visible
          ? "rgba(246, 246, 246, 0.95)"
          : "rgba(246, 246, 246, 0.98)",
        maxWidth: visible ? "700px" : "100%",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
      className={cn(
        "relative z-[60] mx-auto hidden w-full flex-row items-center justify-between rounded-none border-[3px] border-[#101A2E] px-5 py-3 lg:flex",
        visible && "backdrop-blur-md shadow-[0_8px_32px_rgba(16,26,46,0.10)]",
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
              initial={false}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
          <span className="relative z-20">{item.name}</span>
        </a>
      ))}
    </motion.div>
  );
};

export const MobileNav = ({
  children,
  className,
  visible,
}: MobileNavProps) => {
  return (
    <motion.div
      initial={false}
      animate={{
        backgroundColor: visible
          ? "rgba(246, 246, 246, 0.98)"
          : "rgba(246, 246, 246, 0.96)",
        maxWidth: visible ? "85%" : "100%",
      }}
      transition={{
        type: "spring",
        stiffness: 260,
        damping: 28,
      }}
      className={cn(
        "relative z-50 mx-auto flex w-full flex-col border-[3px] border-[#101A2E] px-3 py-2 lg:hidden",
        visible && "backdrop-blur-md shadow-[0_8px_32px_rgba(16,26,46,0.10)]",
        className,
      )}
    >
      {children}
    </motion.div>
  );
};

export const MobileNavHeader = ({
  children,
  className,
}: MobileNavHeaderProps) => {
  return (
    <div
      className={cn(
        "flex w-full flex-row items-center justify-between",
        className,
      )}
    >
      {children}
    </div>
  );
};

export const MobileNavMenu = ({
  children,
  className,
  isOpen,
}: MobileNavMenuProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
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

export const MobileNavToggle = ({
  isOpen,
  onClick,
}: {
  isOpen: boolean;
  onClick: () => void;
}) => {
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
      className="relative z-20 flex items-center flex-shrink-0"
      aria-label="Team Fälschen home"
    >
      <img
        src={logoUrl}
        alt="Team Fälschen"
        className="h-9 w-auto object-contain"
      />
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
        "mono inline-flex items-center justify-center border-[3px] border-[#101A2E] px-3 py-2 text-[10px] font-bold tracking-[.12em] transition-all duration-150 active:translate-y-[2px] active:scale-95 flex-shrink-0",
        variant === "primary"
          ? "bg-[#101A2E] shadow-[4px_4px_0_#8BFF6A] hover:shadow-[5px_5px_0_#8BFF6A] hover:translate-x-[-1px] hover:translate-y-[-1px]"
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
