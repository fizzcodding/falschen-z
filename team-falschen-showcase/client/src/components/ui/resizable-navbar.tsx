/* Signal Forge navigation primitive: sourced resizable-navbar pattern, re-skinned with zero radius, 3px borders, navy ink, and no soft shadows. */
"use client";
import { cn } from "@/lib/utils";
import { IconMenu2, IconX } from "@tabler/icons-react";
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from "motion/react";
import React, { useRef, useState } from "react";

interface NavbarProps { children: React.ReactNode; className?: string; }
interface NavBodyProps { children: React.ReactNode; className?: string; visible?: boolean; }
interface NavItemsProps { items: { name: string; link: string }[]; className?: string; onItemClick?: () => void; }
interface MobileNavProps { children: React.ReactNode; className?: string; visible?: boolean; }
interface MobileNavHeaderProps { children: React.ReactNode; className?: string; }
interface MobileNavMenuProps { children: React.ReactNode; className?: string; isOpen: boolean; onClose: () => void; }

export const Navbar = ({ children, className }: NavbarProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const [visible, setVisible] = useState(false);
  useMotionValueEvent(scrollY, "change", (latest) => setVisible(latest > 100));
  return <motion.div ref={ref} className={cn("sticky inset-x-0 top-0 z-40 w-full", className)}>{React.Children.map(children, (child) => React.isValidElement(child) ? React.cloneElement(child as React.ReactElement<{ visible?: boolean }>, { visible }) : child)}</motion.div>;
};

export const NavBody = ({ children, className, visible }: NavBodyProps) => <motion.div animate={{ backgroundColor: visible ? "rgba(246,246,246,.96)" : "rgba(246,246,246,.88)", y: visible ? 10 : 0 }} transition={{ type: "spring", stiffness: 220, damping: 30 }} className={cn("relative z-50 mx-auto hidden w-[calc(100%-2rem)] max-w-[1240px] flex-row items-center justify-between border-[3px] border-[#101A2E] px-4 py-2 lg:flex", className)}>{children}</motion.div>;

export const NavItems = ({ items, className, onItemClick }: NavItemsProps) => { const [hovered, setHovered] = useState<number | null>(null); return <motion.div onMouseLeave={() => setHovered(null)} className={cn("absolute inset-0 hidden flex-1 flex-row items-center justify-center gap-1 text-[11px] font-bold tracking-[.16em] text-[#101A2E] lg:flex", className)}>{items.map((item, idx) => <a onMouseEnter={() => setHovered(idx)} onClick={onItemClick} className="relative px-3 py-2" key={item.name} href={item.link}>{hovered === idx && <motion.span layoutId="nav-hover" className="absolute inset-0 -z-10 border border-[#101A2E] bg-[#8BFF6A]" />}<span>{item.name}</span></a>)}</motion.div>; };

export const MobileNav = ({ children, className, visible }: MobileNavProps) => <motion.div animate={{ backgroundColor: visible ? "rgba(246,246,246,.98)" : "rgba(246,246,246,.94)", y: visible ? 8 : 0 }} className={cn("relative z-50 mx-auto flex w-[calc(100%-1rem)] max-w-[calc(100vw-1rem)] flex-col border-[3px] border-[#101A2E] px-3 py-2 lg:hidden", className)}>{children}</motion.div>;
export const MobileNavHeader = ({ children, className }: MobileNavHeaderProps) => <div className={cn("flex w-full flex-row items-center justify-between", className)}>{children}</div>;
export const MobileNavMenu = ({ children, className, isOpen }: MobileNavMenuProps) => <AnimatePresence>{isOpen && <motion.div initial={{ opacity: 0, y: -6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} className={cn("absolute inset-x-[-3px] top-[calc(100%+3px)] flex flex-col gap-4 border-[3px] border-[#101A2E] bg-[#F6F6F6] p-4", className)}>{children}</motion.div>}</AnimatePresence>;
export const MobileNavToggle = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => <button aria-label={isOpen ? "Close menu" : "Open menu"} onClick={onClick} className="border-0 bg-transparent p-1 text-[#101A2E]">{isOpen ? <IconX size={22} /> : <IconMenu2 size={22} />}</button>;
export const NavbarLogo = ({ logoUrl }: { logoUrl: string }) => <a href="#top" className="relative z-20 flex items-center gap-2" aria-label="Team Fälschen home"><img src={logoUrl} alt="Team Fälschen anvil and hammer mark" className="h-8 w-8 object-contain" /><span className="mono text-[13px] font-extrabold tracking-[.2em] text-[#101A2E]">FÄLSCHEN</span></a>;
export const NavbarButton = ({ href, children, className, variant = "primary", ...props }: { href?: string; children: React.ReactNode; className?: string; variant?: "primary" | "secondary" } & React.ComponentPropsWithoutRef<"a">) => <a href={href} className={cn("mono border-[3px] border-[#101A2E] px-3 py-2 text-[10px] font-bold tracking-[.12em] transition-transform duration-150 active:translate-y-[2px]", variant === "primary" ? "bg-[#101A2E] text-[#F6F6F6]" : "bg-transparent text-[#101A2E]", className)} {...props}>{children}</a>;
