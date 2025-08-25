"use client";
import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothPageScroll() {
  useEffect(() => {
    const prefersReduced = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;

    const lenis = new Lenis({
      smoothWheel: true,
      // Use either lerp or duration. Lerp ~0.07-0.12 is a good desktop baseline.
      lerp: prefersReduced ? 1 : 0.08,
    });

    let rafId: number | null = null;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
}
