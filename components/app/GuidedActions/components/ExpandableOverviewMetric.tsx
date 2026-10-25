// Expands one account-status pill inline while neighboring controls make room.
// Owns shared expansion, access attention styling, and outside/Escape dismissal.
// Does not load metrics or decide which other pill is expanded.
import { useCallback, useEffect, useId, useRef } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TbAlertCircle, TbChevronUp } from "react-icons/tb";
import type { ExpandableOverviewMetricProps } from "@/types/interfaces";
import styles from "./DataRecordsBreakdown.module.css";

export default function ExpandableOverviewMetric({ metric, label, count, width, expanded, onExpand, children }: ExpandableOverviewMetricProps) {
  const open = expanded === metric;
  const critical = metric === "shared" || metric === "granted";
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const closeMenu = useCallback(() => { onExpand(null); button.current?.focus(); }, [onExpand]);
  const outsideClick = useCallback((event: PointerEvent) => {
    if (event.target instanceof Node && !panel.current?.contains(event.target)) onExpand(null);
  }, [onExpand]);
  const escapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") { event.preventDefault(); closeMenu(); }
  }, [closeMenu]);
  useEffect(() => {
    if (!open) return;
    document.addEventListener("pointerdown", outsideClick);
    document.addEventListener("keydown", escapeKey);
    return () => {
      document.removeEventListener("pointerdown", outsideClick);
      document.removeEventListener("keydown", escapeKey);
    };
  }, [open, outsideClick, escapeKey]);
  return <motion.div ref={panel} layout initial={false} data-expanded={open} data-priority={critical ? "critical" : undefined}
    className={`${styles.panel} inline-flex max-w-full flex-col border border-black/10 bg-white/50 text-xs dark:border-white/10 dark:bg-white/5`}
    style={{ width: open ? width : "auto", borderRadius: open ? 16 : 999 }}
    transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}>
    <AnimatePresence initial={false}>
      {open && <motion.div layout="position" id={id} key="breakdown" initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }} className="overflow-hidden">
        {children}
      </motion.div>}
    </AnimatePresence>
    <motion.button layout="position" ref={button} type="button" aria-label={`${critical ? "Important: " : ""}${label} (${count.toLocaleString()})`}
      aria-controls={id} aria-expanded={open} onClick={() => onExpand(open ? null : metric)}
      className={`inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current${critical ? " text-error dark:text-red-300" : ""}`}>
      {critical && <TbAlertCircle aria-hidden="true" size={14} className="shrink-0" />}
      <span className={critical ? "font-medium" : "text-black/60 dark:text-white/60"}>{label}</span>
      <span className="font-medium tabular-nums">{count.toLocaleString()}</span>
      <TbChevronUp aria-hidden="true" size={12} className={critical ? undefined : "text-black/50 dark:text-white/50"}
        style={{ transform: open ? "rotate(180deg)" : "none" }} />
    </motion.button>
  </motion.div>;
}
