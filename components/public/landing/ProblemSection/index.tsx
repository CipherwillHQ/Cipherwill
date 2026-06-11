/**
 * What it does: Renders the highly direct, high-impact "What happens to my digital estate if I pass away tomorrow?" timeline.
 * What it owns: Chronological decay timeline grid, emotional icons, and the reassuring Cipherwill contrast footer.
 * What it does NOT do: Does not manage complex clickable state, orbits, or database writes.
 */

"use client";

import { motion } from "framer-motion";
import { TbDeviceMobile, TbDatabase, TbMail, TbWallet, TbCheck } from "react-icons/tb";

interface TimelineEvent {
  timeframe: string;
  title: string;
  icon: any;
  iconColor: string;
  description: string;
}

const TIMELINE_EVENTS: TimelineEvent[] = [
  {
    timeframe: "Day 3",
    title: "Complete Lockouts",
    icon: TbDeviceMobile,
    iconColor: "text-error",
    description: "Devices are in your family's hands, but blocked by passcodes. Critical 2FA codes go to your locked screen, blocking complete access to emails and banks."
  },
  {
    timeframe: "Day 30",
    title: "Automated Purges",
    icon: TbDatabase,
    iconColor: "text-warning",
    description: "Monthly billing credit cards fail. Automated cloud billing scripts immediately suspend web servers, deactivate accounts, and queue cloud backups for deletion."
  },
  {
    timeframe: "Day 180",
    title: "Account Deletions",
    icon: TbMail,
    iconColor: "text-clay",
    description: "Inactive Account Deletion Policies trigger at Google and Apple. Cloud photo libraries, shared drives, and decades of family memories are permanently wiped."
  },
  {
    timeframe: "Forever",
    title: "Stranded Wealth",
    icon: TbWallet,
    iconColor: "text-error",
    description: "Self-custody wallet private keys and BIP-39 seed phrases remain locked in physical drawers. They are stranded on-chain forever, untouchable by everyone."
  }
];

export default function ProblemSection() {
  return (
    <div className="w-full bg-forest text-cream py-24 border-b border-cream/10 select-none">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Block */}
        <div className="text-center flex flex-col items-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-playfair text-3xl sm:text-4xl md:text-5xl leading-tight font-black text-cream max-w-4xl"
          >
            What actually happens to my assets and memories if I pass away tomorrow?
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="font-gilroy font-medium text-cream/70 text-base md:text-lg max-w-2xl mt-4"
          >
            Platforms, device locks, and automated billing scripts are designed to lock everyone out and delete your data by default. 
          </motion.p>
        </div>

        {/* 4-Column Timeline Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch mb-12">
          {TIMELINE_EVENTS.map((event, idx) => {
            const Icon = event.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                className="p-6 rounded-2xl bg-cream/5 border border-cream/10 flex flex-col justify-between h-full hover:border-cream/20 transition-colors"
              >
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-mono text-xs font-black text-clay uppercase tracking-widest">
                      {event.timeframe}
                    </span>
                    <div className={`p-2 rounded-xl bg-cream/5 ${event.iconColor}`}>
                      <Icon className="w-5 h-5 animate-pulse" />
                    </div>
                  </div>
                  <h4 className="font-gilroy font-bold text-base text-cream leading-tight mb-2">
                    {event.title}
                  </h4>
                  <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/70 leading-relaxed">
                    {event.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* The Cipherwill Contrast - Reassurance Ribbon */}
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto p-6 rounded-2xl bg-sage/10 border border-sage/20 text-cream"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="p-3 rounded-xl bg-sage/20 text-sage shrink-0">
              <TbCheck className="w-6 h-6 animate-bounce" />
            </div>
            <div>
              <h4 className="font-gilroy font-bold text-sm text-sage uppercase tracking-wider">
                The Cipherwill Solution
              </h4>
              <p className="font-gilroy font-medium text-xs sm:text-sm text-cream/80 mt-1 leading-relaxed">
                We break this silent decay. With your E2E encrypted plan, your designated beneficiaries receive private keys, accounts, and scanned files securely—only when your customizable inactive timeline is fully satisfied.
              </p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
