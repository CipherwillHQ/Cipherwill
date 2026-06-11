/**
 * What it does: Orchestrates the "Trust Architecture" security section on the landing page.
 * What it owns: Dark layout container, grid blocks, playfair display heading copy, and security detail panels.
 * What it does NOT do: Does not animate sliders or manage active locked states directly.
 */

"use client";

import { motion } from "framer-motion";
import { TbShieldLock, TbHeartHandshake, TbActivity } from "react-icons/tb";
import ShardingVisualizer from "./ShardingVisualizer";

export default function TrustArchitecture() {
  return (
    <div className="w-full bg-forest text-cream py-24 border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Security Details Copy (Columns 1-6) */}
          <div className="lg:col-span-6 flex flex-col space-y-6">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.1 }}
                className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-cream"
              >
                Decentralized trust. Absolute zero-custody.
              </motion.h2>
              <motion.p 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 }}
                className="font-gilroy font-medium text-cream/70 text-base md:text-lg mt-4 leading-relaxed"
              >
                Cipherwill is mathematically blind to your contents. By combining E2E local device sealing with sequential cascade encryption layers, your digital estate remains unreadable to everyone—including us.
              </motion.p>
            </div>

            {/* Core Proof Pillars */}
            <div className="space-y-4">
              <div className="flex gap-4">
                <div className="p-2 h-10 w-10 rounded-xl bg-sage/10 text-sage shrink-0 flex items-center justify-center"><TbShieldLock className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-gilroy font-bold text-sm text-cream uppercase tracking-wide">E2E Client-Side Sealing</h4>
                  <p className="font-gilroy font-medium text-xs text-cream/60 mt-1">Passwords and records are locked using AES-256-GCM right in your browser before upload. Your device holds the master key — never our servers.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-2 h-10 w-10 rounded-xl bg-sage/10 text-sage shrink-0 flex items-center justify-center"><TbHeartHandshake className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-gilroy font-bold text-sm text-cream uppercase tracking-wide">Asymmetric Key Exchange</h4>
                  <p className="font-gilroy font-medium text-xs text-cream/60 mt-1">Uses elliptic curve Diffie-Hellman keys to lock the payload specifically for your beneficiary, ensuring only they hold the private keys capable of decryption.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="p-2 h-10 w-10 rounded-xl bg-sage/10 text-sage shrink-0 flex items-center justify-center"><TbActivity className="w-6 h-6" /></div>
                <div>
                  <h4 className="font-gilroy font-bold text-sm text-cream uppercase tracking-wide font-gilroy">Cascade Encryption Layers</h4>
                  <p className="font-gilroy font-medium text-xs text-cream/60 mt-1">Secures records under multiple sequential cryptographic barriers. To read a single file, every consecutive mathematical seal must be intact and cleared.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Visualizer (Columns 7-12) */}
          <div className="lg:col-span-6">
            <ShardingVisualizer />
          </div>

        </div>
      </div>
    </div>
  );
}
