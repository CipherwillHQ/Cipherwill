"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { HiExternalLink } from "react-icons/hi";

// Featured media outlets
const mediaOutlets = [
  {
    name: "AP News",
    logo: "/media-logos/apnews.png",
    url: "https://apnews.com/press-release/ein-presswire-newsmatics/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets-74f3cd724cf27b3628f855c167d21351"
  },
  {
    name: "Benzinga",
    logo: "/media-logos/benzinga.png", 
    url: "https://www.benzinga.com/content/47299314/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets"
  },
  {
    name: "MENAFN",
    logo: "/media-logos/menafn.png",
    url: "https://menafn.com/1109968404/Cipherwill-Launches-Dead-Mans-Switch-For-The-Digital-Age-To-Protect-Online-Assets"
  },
  {
    name: "American Financial Tribune",
    logo: "/media-logos/aft.png",
    url: "https://www.americanfinancialtribune.com/article/842460948-cipherwill-launches-dead-man-s-switch-for-the-digital-age-to-protect-online-assets"
  },
  {
    name: "Valley Central",
    logo: "/media-logos/vc.png",
    url: "https://www.valleycentral.com/business/press-releases/ein-presswire/842460948/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets/"
  },
  {
    name: "WRIC ABC 8",
    logo: "/media-logos/wric.png",
    url: "https://www.wric.com/business/press-releases/ein-presswire/842460948/cipherwill-launches-dead-mans-switch-for-the-digital-age-to-protect-online-assets/"
  }
];

export default function AsSeenIn() {
  return (
    <section className="w-full max-w-7xl mx-auto py-20 px-4 relative">
      <div className="relative z-10">
        <motion.div 
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-20" />
            <span className="text-sm font-bold uppercase tracking-wider text-gray-500 bg-gray-50 px-4 py-2 rounded-full">
              Press Coverage
            </span>
            <div className="h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent flex-1 max-w-20" />
          </div>
          
          <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-gray-900 via-gray-700 to-gray-900 bg-clip-text text-transparent">
            Featured in Leading Publications
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Trusted by media outlets worldwide for our innovative approach to digital inheritance
          </p>
        </motion.div>

        {/* Main media outlets grid with enhanced styling */}
        <motion.div 
          className="bg-white/60 backdrop-blur-sm rounded-3xl p-8 md:p-12 border border-gray-100 mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          viewport={{ once: true }}
        >
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center justify-items-center">
            {mediaOutlets.map((outlet, index) => (
              <motion.a
                key={index}
                href={outlet.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative cursor-pointer flex flex-col items-center p-4 rounded-2xl transition-all duration-300 hover:bg-gray-50"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 * index }}
                viewport={{ once: true }}
                whileHover={{ y: -4 }}
              >
                {/* Logo container with improved styling */}
                <div className="relative w-24 h-16 md:w-32 md:h-20 flex items-center justify-center mb-3 group-hover:scale-105 transition-transform duration-300">
                  <Image
                    src={outlet.logo}
                    alt={`${outlet.name} logo`}
                    fill
                    className="object-contain filter grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300"
                    sizes="(max-width: 768px) 96px, 128px"
                  />
                </div>
                
                {/* Outlet name with external link icon */}
                <div className="text-center flex items-center gap-1.5 text-sm font-medium text-gray-600 group-hover:text-primary-700 transition-colors duration-300">
                  <span className="whitespace-nowrap">{outlet.name}</span>
                  <HiExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
                
                {/* Hover overlay effect */}
                <div className="absolute inset-0 bg-gradient-to-t from-primary-50/0 to-primary-50/0 group-hover:from-primary-50/20 group-hover:to-primary-50/5 rounded-2xl transition-all duration-300" />
              </motion.a>
            ))}
          </div>
        </motion.div>

        {/* Enhanced "100+ more" section */}
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <div className="inline-flex items-center gap-3 px-6 py-3">
            <div className="flex -space-x-1">
              {[1, 2, 3].map((i) => (
                <div key={i} className="w-2 h-2 bg-primary-400 rounded-full animate-pulse" style={{ animationDelay: `${i * 0.2}s` }} />
              ))}
            </div>
            <span className="text-sm font-semibold text-gray-700">
              100+ additional publications
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
