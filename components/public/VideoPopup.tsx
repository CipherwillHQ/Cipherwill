/**
 * VideoPopup.tsx
 * Reusable modal popup for playing explainer and feature YouTube videos on public pages.
 * Owns Escape-key closing, scroll locking, and responsive 16:9 iframe embedding.
 * Does NOT manage trigger button state or video URL constants.
 */

"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";
import { TbExternalLink, TbX } from "react-icons/tb";
import BasicPopup from "@/components/BasicPopup";
import getYoutubeEmbedUrl from "@/common/url/getYoutubeEmbedUrl";
import { VideoPopupProps } from "@/types/interfaces";

export default function VideoPopup({
  open,
  onClose,
  videoUrl,
  title = "Cipherwill Explainer Video",
}: VideoPopupProps) {
  const embedUrl = getYoutubeEmbedUrl(videoUrl);

  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, onClose]);

  return (
    <BasicPopup
      open={open}
      setOpen={() => onClose()}
      bg_className="z-modal bg-forest/80 backdrop-blur-xs p-4 sm:p-6"
      popup_className="bg-transparent dark:bg-transparent p-0 shadow-none max-w-4xl w-full"
    >
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        initial={{ opacity: 0, scale: 0.97, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.22, ease: [0.25, 1, 0.5, 1] }}
        className="w-full rounded-2xl overflow-hidden bg-cream border border-forest/10 shadow-level-3 dark:bg-darkCard dark:border-cream/10"
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between gap-4 px-5 py-3.5 bg-parchment border-b border-forest/10 dark:bg-darkAccent dark:border-cream/10">
          <span className="font-gilroy font-semibold text-sm sm:text-base text-forest dark:text-cream truncate">
            {title}
          </span>
          <div className="flex items-center gap-2 shrink-0">
            <a
              href={videoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-gilroy font-semibold text-forest/70 hover:text-forest hover:bg-forest/5 dark:text-cream/70 dark:hover:text-cream dark:hover:bg-cream/10 transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <span>YouTube</span>
              <TbExternalLink className="w-3.5 h-3.5" />
            </a>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close video popup"
              className="inline-flex items-center justify-center w-9 h-9 rounded-full text-forest/70 hover:text-forest hover:bg-forest/10 dark:text-cream/70 dark:hover:text-cream dark:hover:bg-cream/10 active:scale-[0.98] transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
            >
              <TbX className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Video Frame */}
        <div className="relative w-full aspect-video bg-forest">
          {embedUrl ? (
            <iframe
              src={embedUrl}
              title={title}
              className="w-full h-full border-0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center gap-4 p-6 text-center text-cream">
              <p className="font-gilroy text-sm sm:text-base text-cream/80">
                Unable to embed this video inline.
              </p>
              <a
                href={videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-700 text-white font-gilroy font-semibold text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2"
              >
                <span>Watch on YouTube</span>
                <TbExternalLink className="w-4 h-4" />
              </a>
            </div>
          )}
        </div>
      </motion.div>
    </BasicPopup>
  );
}
