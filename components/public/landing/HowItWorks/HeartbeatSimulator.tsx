/**
 * What it does: Renders an interactive heartbeat and check-in timeline simulator.
 * What it owns: Response toggles, counting countdown bars, and graphical heartbeat signals.
 * What it does NOT do: Does not run real timers or send real verification triggers.
 */

"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { TbHeartbeat, TbBell, TbCircleCheck, TbAlertTriangle } from "react-icons/tb";

export default function HeartbeatSimulator() {
  const [active, setActive] = useState<boolean>(true);
  const [countdown, setCountdown] = useState<number>(30);

  useEffect(() => {
    if (active) return;

    const timer = setInterval(() => {
      setCountdown((prev) => (prev > 1 ? prev - 1 : 30));
    }, 1000);

    return () => clearInterval(timer);
  }, [active]);

  return (
    <div className="w-full bg-parchment/60 border border-forest/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between h-full">
      {/* Top section: Interactive Toggle */}
      <div>
        <div className="flex justify-between items-center border-b border-forest/10 pb-4 mb-4">
          <h4 className="font-gilroy font-bold text-sm text-forest uppercase tracking-wider">
            Verification Protocol Simulator
          </h4>
          <span className={`px-2 py-0.5 rounded-full font-gilroy font-semibold text-[10px] uppercase tracking-wider ${
            active ? "bg-sage/10 text-sage" : "bg-warning/10 text-warning"
          }`}>
            {active ? "Operational" : "Grace Period"}
          </span>
        </div>

        {/* Dynamic Simulator Graphic */}
        <div className="bg-white border border-forest/5 rounded-xl p-6 flex flex-col items-center justify-center min-h-[160px] relative overflow-hidden">
          {active ? (
            /* Active Heartbeat */
            <div className="flex flex-col items-center text-center space-y-3">
              <motion.div 
                animate={{ scale: [1, 1.15, 1] }} 
                transition={{ repeat: Infinity, duration: 1.2, ease: "easeInOut" }}
                className="p-3 bg-sage/10 rounded-full text-sage"
              >
                <TbHeartbeat className="w-10 h-10" />
              </motion.div>
              <p className="font-gilroy font-bold text-sm text-forest">Activity Status: Active & Secure</p>
              <p className="font-gilroy font-medium text-xs text-forest/50">Heartbeat maintained via login. Decryption locked.</p>
            </div>
          ) : (
            /* Unresponsive Timeline Countdown */
            <div className="flex flex-col items-center text-center space-y-3 w-full">
              <div className="flex items-center gap-3">
                <div className="p-3 bg-warning/10 rounded-full text-warning animate-bounce">
                  <TbBell className="w-8 h-8" />
                </div>
                <div className="text-left">
                  <p className="font-gilroy font-bold text-sm text-forest">Silent Check-In Period</p>
                  <p className="font-gilroy font-bold text-lg text-error font-mono">{countdown} Days Left</p>
                </div>
              </div>
              
              {/* Progress Bar */}
              <div className="w-full bg-forest/5 h-2 rounded-full overflow-hidden mt-2">
                <motion.div 
                  initial={{ width: "100%" }}
                  animate={{ width: `${(countdown / 30) * 100}%` }}
                  transition={{ ease: "linear" }}
                  className="h-full bg-error"
                />
              </div>
              <p className="font-gilroy font-semibold text-xs text-error/80 max-w-xs mt-1">
                ⚠️ Sending encrypted prompts across 3 private backup channels. False alarms trigger immediate reset.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Simulator Actions */}
      <div className="mt-6 flex flex-col space-y-3">
        <div className="flex gap-2">
          <button
            onClick={() => { setActive(true); setCountdown(30); }}
            className={`flex-1 py-2.5 rounded-xl font-gilroy font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
              active 
                ? "bg-forest text-cream" 
                : "bg-white border border-forest/10 text-forest/70 hover:bg-parchment/30"
            }`}
          >
            <TbCircleCheck className="w-4 h-4" />
            Normal Life (Reset)
          </button>
          <button
            onClick={() => setActive(false)}
            className={`flex-1 py-2.5 rounded-xl font-gilroy font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 ${
              !active 
                ? "bg-error text-white" 
                : "bg-white border border-forest/10 text-forest/70 hover:bg-parchment/30"
            }`}
          >
            <TbAlertTriangle className="w-4 h-4" />
            Simulate Silence
          </button>
        </div>
      </div>
    </div>
  );
}
