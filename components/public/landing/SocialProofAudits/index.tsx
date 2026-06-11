/**
 * What it does: Orchestrates the "Social Proof, Audits and Press Coverage" section on the landing page.
 * What it owns: Dark container wrapper, layout grids, press logo rows, and security stamp layouts.
 * What it does NOT do: Does not render individual testimonial cards directly.
 */

"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { TbCertificate, TbShieldLock, TbArrowUpRight } from "react-icons/tb";
import { TESTIMONIALS, MEDIA_OUTLETS } from "./data";
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

        {/* Press Coverage Section */}
        <div className="w-full h-px bg-cream/10 my-16" />

        <div className="flex flex-col items-center text-center mb-10">
          <span className="font-gilroy font-bold text-[9px] sm:text-[10px] uppercase tracking-widest text-cream/40 block mb-3">
            Featured In Leading Publications
          </span>
          <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/60 max-w-lg">
            Trusted and featured by global media outlets for our pioneering approach to digital legacy protection.
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 sm:gap-8 items-stretch justify-center"
        >
          {MEDIA_OUTLETS.map((outlet, idx) => (
            <motion.a
              key={idx}
              href={outlet.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex flex-col items-center justify-center p-3 rounded-2xl bg-white hover:bg-neutral-50 transition-all duration-300 relative overflow-hidden h-24"
              whileHover={{ y: -4 }}
            >
              {/* Logo wrapper */}
              <div className="relative w-full h-12 flex items-center justify-center transition-transform duration-300">
                <Image
                  src={outlet.logo}
                  alt={`${outlet.name} logo`}
                  fill
                  className="object-contain filter grayscale opacity-75 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                  sizes="(max-width: 640px) 100px, 120px"
                />
              </div>
              <span className="mt-2 text-[10px] font-gilroy font-bold text-neutral-400 group-hover:text-primary-700 transition-colors duration-300 text-center flex items-center gap-0.5">
                {outlet.name}
                <TbArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </span>
            </motion.a>
          ))}
        </motion.div>

        {/* 100+ more publications pill */}
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex justify-center mt-8"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cream/5 bg-cream/5">
            <span className="w-1.5 h-1.5 rounded-full bg-sage animate-pulse" />
            <span className="text-[10px] sm:text-xs font-gilroy font-bold text-cream/50 tracking-wider uppercase">
              And 100+ additional publications worldwide
            </span>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
