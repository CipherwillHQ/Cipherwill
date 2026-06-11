/**
 * What it does: Orchestrates the "Social Proof and Audits" section on the landing page.
 * What it owns: Dark container wrapper, layout grids, and security stamp layouts.
 * What it does NOT do: Does not render individual testimonial cards directly.
 */

"use client";

import { motion } from "framer-motion";
import { TbCertificate, TbShieldLock } from "react-icons/tb";
import { TESTIMONIALS } from "./data";
import TestimonialCard from "./TestimonialCard";

export default function SocialProofAudits() {
  return (
    <div className="w-full bg-forest text-cream py-24 border-b border-cream/10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Block */}
        <div className="flex flex-col md:items-center text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-cream max-w-3xl"
          >
            Audited for security, trusted for peace of mind
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-cream/70 text-base md:text-lg max-w-2xl mt-4"
          >
            We submit our browser sharding configurations and client-side encryption libraries to continuous audits. Here is what security auditors and real clients say.
          </motion.p>
        </div>

        {/* 2-Column responsive grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-stretch">
          
          {/* Left Column: Testimonial Reviews (Columns 1-7) */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6 items-stretch">
            {TESTIMONIALS.map((testimonial, idx) => (
              <TestimonialCard key={idx} testimonial={testimonial} />
            ))}
          </div>

          {/* Right Column: Security Principles (Columns 8-12) */}
          <div className="lg:col-span-5 flex flex-col justify-center space-y-6">
            <span className="font-gilroy font-bold text-[9px] uppercase tracking-widest text-cream/30 block">
              Cryptographic Guarantees
            </span>
            
            <div className="space-y-4">
              <div className="p-5 rounded-2xl bg-cream/5 border border-cream/10 flex gap-4 items-start">
                <div className="p-2 h-10 w-10 rounded-xl bg-sage/10 text-sage shrink-0 flex items-center justify-center">
                  <TbShieldLock className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-gilroy font-bold text-sm text-cream leading-tight">
                    Client-Side Sealing
                  </h4>
                  <p className="font-gilroy font-medium text-xs text-cream/60 mt-1 leading-relaxed">
                    All sensitive assets are locked using AES-256-GCM right in your browser or device before uploading. Your device holds the master key — never our servers.
                  </p>
                </div>
              </div>

              <div className="p-5 rounded-2xl bg-cream/5 border border-cream/10 flex gap-4 items-start">
                <div className="p-2 h-10 w-10 rounded-xl bg-sage/10 text-sage shrink-0 flex items-center justify-center">
                  <TbCertificate className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="font-gilroy font-bold text-sm text-cream leading-tight">
                    Open Source Transparency
                  </h4>
                  <p className="font-gilroy font-medium text-xs text-cream/60 mt-1 leading-relaxed">
                    Our core cryptographic protocols, client-side encryption libraries, and failsafe specifications are inspectable, open, and community-audited.
                  </p>
                </div>
              </div>
            </div>

            {/* Peer-Reviewed Mathematics Statement */}
            <div className="p-5 rounded-2xl border border-dashed border-cream/20 flex gap-4 items-center">
              <TbCertificate className="w-8 h-8 text-cream/30 shrink-0" />
              <p className="font-gilroy font-medium text-xs text-cream/70 leading-relaxed">
                We utilize only peer-reviewed, industry-standard cryptographic primitives. Our schemas are completely inspectable and open to the community.
              </p>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
