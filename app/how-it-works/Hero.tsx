"use client";

import { motion } from "framer-motion";

import hero_bg from "./hero_bg.jpeg";
import Image from "next/image";
// bg-linear-to-br from-primary-50 to-primary-100

export default function Hero() {
  return (
    <section className="text-white">
      <Image
        src={hero_bg}
        alt="Hero Image"
        layout="fill"
        objectFit="cover"
        quality={50}
        placeholder="blur"
        className="absolute inset-0 z-0"
      />
      <div className="absolute inset-0 bg-linear-to-b from-black to-black/60"></div>

      <div className="relative flex items-center justify-center h-screen overflow-hidden">
        {/* Floating Pills */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="absolute top-56 left-9 md:left-56 bg-black/10 backdrop-blur-md border border-white/10 text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          Is my data secure?
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="absolute top-40 right-8 md:right-44 bg-black/10 backdrop-blur-md border border-white/10 text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          How does encryption work?
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="absolute bottom-44 left-12 md:left-52 bg-black/10 backdrop-blur-md border border-white/10 text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          When is data released?
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="absolute bottom-56 right-16 md:right-64 bg-black/10 backdrop-blur-md border border-white/10 text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          Who gets my data?
        </motion.div>

        {/* Main Content */}
        <div className="text-center max-w-2xl px-4 z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center font-playfair italic whitespace-pre-line py-4">
            See How It’s Done
          </h1>

          <p className="max-w-xl mx-auto py-4 text-center sm:text-xl">
            Let understand how to put your digital legacy on autopilot with
            encryption, so when the time comes, your data is delivered to your
            loved ones.
          </p>
        </div>
      </div>
    </section>
  );
}
