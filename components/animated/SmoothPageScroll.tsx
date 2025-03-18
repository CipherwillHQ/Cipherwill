"use client";
import Lenis from "lenis";
import { useEffect } from "react";

export default function SmoothPageScroll() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 2.5, // adjust as needed
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return null;
}
