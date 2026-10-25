// Expands Data records inside the overview so nearby controls make room.
// Owns inline size transitions, outside/Escape dismissal and the pill button.
// Does not fetch records or interrupt the setup flow.
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { TbChevronUp } from "react-icons/tb";
import type { DataRecordsMetricProps } from "@/types/interfaces";
import DataRecordsBreakdown from "./DataRecordsBreakdown";
import styles from "./DataRecordsBreakdown.module.css";

export default function DataRecordsMetric(props: DataRecordsMetricProps) {
  const [open, setOpen] = useState(false);
  const panel = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const id = useId();
  const reduced = useReducedMotion();
  const closeMenu = useCallback(() => { setOpen(false); button.current?.focus(); }, []);
  const outsideClick = useCallback((event: PointerEvent) => {
    if (event.target instanceof Node && !panel.current?.contains(event.target)) setOpen(false);
  }, []);
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
  return <motion.div ref={panel} layout initial={false} data-expanded={open}
    className={`${styles.panel} inline-flex max-w-full flex-col border border-black/10 bg-white/50 text-xs dark:border-white/10 dark:bg-white/5`}
    style={{ width: open ? 256 : "auto", borderRadius: open ? 16 : 999 }}
    transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }}>
    <AnimatePresence initial={false}>
      {open && <motion.div layout="position" id={id} key="breakdown" initial={{ height: 0, opacity: 0 }}
        animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
        transition={{ duration: reduced ? 0 : 0.28, ease: "easeOut" }} className="overflow-hidden">
        <DataRecordsBreakdown {...props} onClose={closeMenu} />
      </motion.div>}
    </AnimatePresence>
    <motion.button layout="position" ref={button} type="button" aria-label={`Data records (${props.count.toLocaleString()})`}
      aria-controls={id} aria-expanded={open} onClick={() => setOpen(!open)}
      className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-full px-3 py-1.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-current">
      <span className="text-black/60 dark:text-white/60">Data records</span>
      <span className="font-medium tabular-nums">{props.count.toLocaleString()}</span>
      <TbChevronUp aria-hidden="true" size={12} className="text-black/50 dark:text-white/50"
        style={{ transform: open ? "rotate(180deg)" : "none" }} />
    </motion.button>
  </motion.div>;
}
