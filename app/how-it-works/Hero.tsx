"use client";

import { motion } from "framer-motion";

export default function Hero() {
  return (
    <section>
      <div className="relative flex items-center justify-center h-screen bg-gradient-to-br from-primary-50 to-primary-100 overflow-hidden">
        {/* Floating Pills */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
          className="opacity-40 absolute top-56 left-9 md:left-56 bg-primary-50 border border-default text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          Is my data secure?
        </motion.div>

        <motion.div
          animate={{ y: [0, -10, 0] }}
          transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          className="opacity-40 absolute top-40 right-8 md:right-44 bg-primary-50 border border-default text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          How does encryption work?
        </motion.div>

        <motion.div
          animate={{ y: [0, 15, 0] }}
          transition={{ repeat: Infinity, duration: 5, ease: "easeInOut" }}
          className="opacity-40 absolute bottom-44 left-12 md:left-52 bg-primary-50 border border-default text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          When is data released?
        </motion.div>

        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
          className="opacity-40 absolute bottom-56 right-16 md:right-64 bg-primary-50 border border-default text-xs font-semibold px-6 py-3 rounded-full shadow-lg text-center"
        >
          Who gets my data?
        </motion.div>

        {/* Main Content */}
        <div className="text-center max-w-2xl px-4 z-10">
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold text-center font-playfair italic whitespace-pre-line">
            See How It’s Done
          </h1>

          <p className="max-w-xl mx-auto py-4 text-center  sm:text-lg font-medium dark:font-normal">
            Let understand how to put your digital legacy on autopilot with
            encryption, so when the time comes, your data is delivered to your
            loved ones.
          </p>
        </div>
      </div>
    </section>
  );
}
