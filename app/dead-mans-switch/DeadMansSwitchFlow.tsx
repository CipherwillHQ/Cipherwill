/*
 * DeadMansSwitchFlow.tsx
 * What it does: Renders an interactive schematic flowchart of the Dead Man's Switch pipeline.
 * What it owns: Node flow state, interactive step highlights, and responsive SVG/CSS connections.
 * What it does NOT do: It does not handle metadata, header, or footer.
 */

"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
  TbDatabase,
  TbActivity,
  TbGift,
  TbArrowDown,
} from "react-icons/tb";

interface FlowNode {
  id: "store" | "monitor" | "handoff";
  title: string;
  badge: string;
  subtitle: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  borderColor: string;
  steps: string[];
  techSpec: string;
}

const nodes: FlowNode[] = [
  {
    id: "store",
    title: "On-Device Storage",
    badge: "Phase 1 - Client Lock",
    subtitle: "Absolute confidentiality starts locally",
    icon: TbDatabase,
    color: "text-primary",
    bgColor: "bg-primary-50/50",
    borderColor: "border-primary/20",
    steps: [
      "Input bank records, files, keys, and passwords.",
      "Local browser derives a 256-bit key from your factors.",
      "Data is fully encrypted on-device before syncing to secure nodes.",
    ],
    techSpec: "AES-GCM-256 local-only browser encryption. Zero plaintext transmission.",
  },
  {
    id: "monitor",
    title: "Sentinel Pulse",
    badge: "Phase 2 - Silent Check-in",
    subtitle: "Automated, non-invasive monitoring",
    icon: TbActivity,
    color: "text-sage",
    bgColor: "bg-sage/10",
    borderColor: "border-sage/20",
    steps: [
      "The system monitors your platform logins behind the scenes.",
      "Check-in interval resets automatically upon successful login.",
      "Silent countdown begins only if you become inactive.",
    ],
    techSpec: "Cron-based heartbeat trigger checks with customizable check-in interval.",
  },
  {
    id: "handoff",
    title: "Cryptographic Handoff",
    badge: "Phase 3 - Trusted Release",
    subtitle: "Secure handoff when you are unable to voice",
    icon: TbGift,
    color: "text-clay",
    bgColor: "bg-clay/10",
    borderColor: "border-clay/20",
    steps: [
      "Silent countdown expires without responsive login check-in.",
      "Time-capsule key is safely released to unlock the outer gate.",
      "Beneficiary removes the inner gate using their own private key.",
    ],
    techSpec: "Dual-layer Cascade Cryptography (Time capsule + Beneficiary public key).",
  },
];

export default function DeadMansSwitchFlow() {
  const [activeTab, setActiveTab] = useState<"store" | "monitor" | "handoff">("store");
  const currentNode = nodes.find((n) => n.id === activeTab)!;

  return (
    <div className="w-full max-w-5xl mx-auto py-8">
      {/* Horizontal Schematic Flow Nodes */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 mb-10 relative">
        {nodes.map((node, index) => {
          const Icon = node.icon;
          const isSelected = activeTab === node.id;

          return (
            <div key={node.id} className="flex-1 w-full flex flex-col md:flex-row items-center gap-2">
              <button
                onClick={() => setActiveTab(node.id)}
                className={`flex-1 w-full p-5 rounded-2xl border text-center md:text-left transition-all duration-300 flex flex-col items-center md:items-start ${
                  isSelected
                    ? "bg-white border-primary shadow-level-2"
                    : "bg-parchment/20 border-forest/5 hover:bg-parchment/50"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${node.bgColor} ${node.color}`}>
                  <Icon className="w-6 h-6 stroke-[2px]" />
                </div>
                <span className="text-[10px] font-bold font-mono tracking-wider uppercase opacity-40">
                  {node.badge}
                </span>
                <h3 className="font-playfair font-bold text-lg text-forest mt-1">
                  {node.title}
                </h3>
              </button>

              {/* Connecting indicator (only between steps) */}
              {index < nodes.length - 1 && (
                <div className="flex items-center justify-center md:rotate-270 py-2 md:px-3 text-forest/20">
                  <TbArrowDown className="w-5 h-5 md:-rotate-90" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Blueprint Detail Panel */}
      <div className="bg-white border border-forest/10 rounded-3xl p-6 md:p-8 shadow-level-1 relative overflow-hidden">
        {/* Abstract watermark */}
        <div className="absolute -left-6 -bottom-6 text-forest/5 select-none pointer-events-none text-9xl font-black uppercase font-mono tracking-tighter">
          {currentNode.id}
        </div>

        <div className="flex flex-col md:flex-row justify-between gap-8 items-start relative z-10">
          <div className="flex-1">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-3 ${currentNode.bgColor} ${currentNode.color}`}>
              {currentNode.badge}
            </span>
            <h2 className="font-playfair text-2xl md:text-3xl font-bold text-forest leading-tight">
              {currentNode.title}
            </h2>
            <p className="text-sm font-medium text-forest/50 font-mono mt-1">
              {currentNode.subtitle}
            </p>

            {/* List of actions inside this phase */}
            <ul className="mt-6 flex flex-col gap-4">
              {currentNode.steps.map((step, idx) => (
                <li key={idx} className="flex gap-3 items-start">
                  <span className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${currentNode.bgColor} ${currentNode.color}`}>
                    {idx + 1}
                  </span>
                  <span className="text-forest/80 text-sm sm:text-base font-medium leading-relaxed">
                    {step}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Technical Specs box */}
          <div className="w-full md:w-80 bg-cream/50 border border-forest/5 rounded-2xl p-5 md:p-6 font-medium">
            <h4 className="text-xs uppercase font-mono font-bold text-forest/40 tracking-wider mb-2">
              Cryptographic Spec Sheet
            </h4>
            <p className="text-xs sm:text-sm text-forest/70 leading-relaxed">
              {currentNode.techSpec}
            </p>
            <div className="mt-4 pt-4 border-t border-forest/5 flex items-center justify-between text-[11px] font-mono font-bold text-forest/30">
              <span>STATUS:</span>
              <span className={currentNode.color}>STANDBY // VERIFIED</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}