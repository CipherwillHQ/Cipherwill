/**
 * HeroSection component for the public Security page.
 * Owns the high-end editorial heading and the unique, custom conceptual cryptographic sharding & cascade core illustration.
 * Does NOT own the other page sections or global layout.
 */

"use client";

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-cream pt-32 pb-16 sm:pb-24">
      {/* Background Subtle Editorial Accent */}
      <div className="absolute top-0 right-0 -z-10 h-125 w-125 rounded-full bg-sage/5 blur-3xl animate-pulse duration-[8000ms]" />
      <div className="absolute bottom-0 left-0 -z-10 h-125 w-125 rounded-full bg-clay/5 blur-2xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        {/* High-Breathing Bold Serif Title */}
        <h1 className="mt-8 font-playfair text-4xl sm:text-6xl lg:text-7xl font-bold text-forest tracking-tight leading-none max-w-5xl mx-auto">
          Zero-Knowledge.<br />
          <span className="text-forest/80">Zero Compromise.</span>
        </h1>

        <p className="mx-auto mt-6 max-w-2xl text-base sm:text-lg text-forest/70 font-medium leading-relaxed">
          At Cipherwill, your digital legacy is protected by client-side cryptography. 
          Your secrets are encrypted on your device before they ever touch the cloud. 
          We are entirely blind to your data-by design.
        </p>

        {/* Premium Conceptual Cryptographic Sharding & Cascade Core Illustration */}
        <div className="mt-16 flex justify-center">
          <div className="relative w-full max-w-lg aspect-square sm:aspect-[4/3] flex items-center justify-center">
            {/* Ambient Shadow Circle */}
            <div className="absolute inset-0 m-auto w-72 h-72 rounded-full bg-sage/5 blur-xl animate-pulse duration-[6000ms]" />

            {/* Conceptual SVG */}
            <svg
              viewBox="0 0 400 300"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full max-w-md h-auto filter drop-shadow-level-2 z-10"
            >
              {/* Concentric Cascade Orbit Rings (Layered Encryption) */}
              <circle cx="200" cy="150" r="110" stroke="#7AA089" strokeWidth="1" strokeDasharray="6 6" opacity="0.25" className="animate-[spin_60s_infinite_linear]" style={{ transformOrigin: "200px 150px" }} />
              <circle cx="200" cy="150" r="80" stroke="#2A363B" strokeWidth="1" strokeDasharray="4 4" opacity="0.2" className="animate-[spin_40s_infinite_linear]" style={{ transformOrigin: "200px 150px" }} />
              <circle cx="200" cy="150" r="50" stroke="#7AA089" strokeWidth="1.5" opacity="0.15" />

              {/* Central Cryptographic Vault Core (Matte 3D Sphere/Cube Hybrid) */}
              <g className="animate-[bounce_6s_infinite_ease-in-out]">
                {/* Core Base Reflection Shadow */}
                <ellipse cx="200" cy="230" rx="30" ry="8" fill="#2A363B" opacity="0.1" />

                {/* Layered Isometric Core Cube (Secure Vault) */}
                {/* Top Face */}
                <path d="M 200 125 L 235 142.5 L 200 160 L 165 142.5 Z" fill="#F4F1EA" stroke="#2A363B" strokeWidth="2.5" />
                {/* Left Face */}
                <path d="M 165 142.5 L 200 160 L 200 195 L 165 177.5 Z" fill="#7AA089" fillOpacity="0.8" stroke="#2A363B" strokeWidth="2.5" />
                {/* Right Face */}
                <path d="M 200 160 L 235 142.5 L 235 177.5 L 200 195 Z" fill="#2A363B" fillOpacity="0.9" stroke="#2A363B" strokeWidth="2.5" />

                {/* Sealed Keyhole Motif inside Core */}
                <circle cx="200" cy="177" r="5" fill="#FBF9F1" />
                <path d="M 200 182 L 200 190 L 197 190 L 203 190" stroke="#FBF9F1" strokeWidth="2" strokeLinecap="round" />
              </g>

              {/* Floating Decentralized Key Shards (Shard Switch) */}
              
              {/* Shard A (Top Left) */}
              <g className="animate-[pulse_4s_infinite_ease-in-out]">
                <line x1="120" y1="90" x2="165" y2="135" stroke="#7AA089" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                {/* Glassy Shard Polygon */}
                <path d="M 120 70 L 140 85 L 110 100 L 95 85 Z" fill="url(#glassGrad1)" stroke="#7AA089" strokeWidth="1.5" />
                {/* Numeric Indicator */}
                <text x="112" y="90" fill="#2A363B" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.6">S1</text>
              </g>

              {/* Shard B (Top Right) */}
              <g className="animate-[pulse_5s_infinite_ease-in-out]" style={{ animationDelay: "1s" }}>
                <line x1="280" y1="90" x2="235" y2="135" stroke="#7AA089" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                {/* Glassy Shard Polygon */}
                <path d="M 280 70 L 265 90 L 295 105 L 305 80 Z" fill="url(#glassGrad2)" stroke="#2A363B" strokeWidth="1.5" opacity="0.8" />
                {/* Numeric Indicator */}
                <text x="281" y="91" fill="#F4F1EA" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.8">S2</text>
              </g>

              {/* Shard C (Bottom Left / Time Capsule Lock) */}
              <g className="animate-[pulse_6s_infinite_ease-in-out]" style={{ animationDelay: "2s" }}>
                <line x1="120" y1="210" x2="165" y2="165" stroke="#7AA089" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                {/* Glassy Shard Polygon */}
                <path d="M 100 200 L 125 195 L 115 225 L 90 220 Z" fill="url(#glassGrad1)" stroke="#7AA089" strokeWidth="1.5" />
                {/* Clock / Hourglass Icon Inside Shard */}
                <circle cx="108" cy="210" r="4" stroke="#2A363B" strokeWidth="1" fill="none" />
                <line x1="108" y1="210" x2="108" y2="208" stroke="#2A363B" strokeWidth="1" />
                <line x1="108" y1="210" x2="111" y2="210" stroke="#2A363B" strokeWidth="1" />
              </g>

              {/* Shard D (Bottom Right / Executor Lock) */}
              <g className="animate-[pulse_4.5s_infinite_ease-in-out]" style={{ animationDelay: "0.5s" }}>
                <line x1="280" y1="210" x2="235" y2="165" stroke="#7AA089" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.5" />
                {/* Glassy Shard Polygon */}
                <path d="M 290 195 L 310 215 L 285 230 L 270 210 Z" fill="url(#glassGrad2)" stroke="#2A363B" strokeWidth="1.5" opacity="0.8" />
                <text x="284" y="217" fill="#F4F1EA" fontSize="8" fontFamily="monospace" fontWeight="bold" opacity="0.8">S3</text>
              </g>

              {/* Definitions */}
              <defs>
                <linearGradient id="glassGrad1" x1="95" y1="70" x2="140" y2="100" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#7AA089" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FBF9F1" stopOpacity="0.1" />
                </linearGradient>
                <linearGradient id="glassGrad2" x1="265" y1="70" x2="305" y2="105" gradientUnits="userSpaceOnUse">
                  <stop offset="0%" stopColor="#2A363B" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#7AA089" stopOpacity="0.1" />
                </linearGradient>
              </defs>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
