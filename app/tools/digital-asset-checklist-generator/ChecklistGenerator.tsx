"use client";

import { useMemo, useState } from "react";

type ProfileKey = "crypto" | "business" | "dependents" | "creator";

type ChecklistItem = {
  id: string;
  title: string;
  note: string;
  category: string;
  tags: ("base" | ProfileKey)[];
};

const PROFILE_OPTIONS: { key: ProfileKey; label: string; description: string }[] = [
  {
    key: "crypto",
    label: "I hold crypto or DeFi assets",
    description: "Adds wallet, exchange, and on-chain access reminders.",
  },
  {
    key: "business",
    label: "I run a business",
    description: "Adds domain, SaaS, and business ops access checks.",
  },
  {
    key: "dependents",
    label: "I support dependents",
    description: "Adds insurance, school, and recurring payment items.",
  },
  {
    key: "creator",
    label: "I have creator or monetized accounts",
    description: "Adds social, content, and payout channel checks.",
  },
];

const CHECKLIST_ITEMS: ChecklistItem[] = [
  {
    id: "identity-master",
    title: "Create a master list of digital accounts",
    note: "Capture platform name, username/email, and account purpose.",
    category: "Foundation",
    tags: ["base"],
  },
  {
    id: "password-manager",
    title: "Document your password manager setup",
    note: "Store provider name, vault location, and emergency recovery path.",
    category: "Foundation",
    tags: ["base"],
  },
  {
    id: "mfa-methods",
    title: "List all MFA methods and backup codes",
    note: "Include authenticator apps, hardware keys, and recovery codes.",
    category: "Foundation",
    tags: ["base"],
  },
  {
    id: "emails",
    title: "Inventory primary and backup email accounts",
    note: "Flag inboxes used for account recovery and financial alerts.",
    category: "Accounts",
    tags: ["base"],
  },
  {
    id: "banking",
    title: "List digital banking and payment accounts",
    note: "Include banks, neobanks, and payment apps with note on balances.",
    category: "Accounts",
    tags: ["base"],
  },
  {
    id: "subscriptions",
    title: "Track paid subscriptions and renewals",
    note: "Include billing cycle, card linked, and cancellation method.",
    category: "Accounts",
    tags: ["base"],
  },
  {
    id: "cloud-storage",
    title: "Map cloud storage and critical files",
    note: "Tag folders with legal, financial, personal, and business importance.",
    category: "Files & Devices",
    tags: ["base"],
  },
  {
    id: "device-access",
    title: "Record device access details",
    note: "List devices, PIN/password hints, and where physical backups are kept.",
    category: "Files & Devices",
    tags: ["base"],
  },
  {
    id: "social-legacy",
    title: "Set account legacy/contact preferences",
    note: "Enable memorialization or closure settings where supported.",
    category: "Legacy Preferences",
    tags: ["base"],
  },
  {
    id: "instructions",
    title: "Write plain-language instructions for beneficiaries",
    note: "Explain what to access first, what to close, and who to contact.",
    category: "Legacy Preferences",
    tags: ["base"],
  },
  {
    id: "custody-plan",
    title: "Store recovery instructions in more than one location",
    note: "Use trusted contacts, legal docs, or encrypted backups with redundancy.",
    category: "Security",
    tags: ["base"],
  },
  {
    id: "review-schedule",
    title: "Set a recurring checklist review reminder",
    note: "Review every 3 to 6 months to keep data current.",
    category: "Security",
    tags: ["base"],
  },
  {
    id: "crypto-wallets",
    title: "List wallets, exchanges, and custody methods",
    note: "Include chain names, wallet apps, and where assets are held.",
    category: "Crypto",
    tags: ["crypto"],
  },
  {
    id: "seed-phrases",
    title: "Document seed phrase and key storage process",
    note: "Never store seed phrases in plaintext online; explain safe retrieval.",
    category: "Crypto",
    tags: ["crypto"],
  },
  {
    id: "defi-access",
    title: "Map DeFi positions and protocol dependencies",
    note: "Include lending, staking, LP positions, and unstaking lock periods.",
    category: "Crypto",
    tags: ["crypto"],
  },
  {
    id: "business-domains",
    title: "Document domain and hosting account ownership",
    note: "Include registrar login, DNS provider, and renewal contacts.",
    category: "Business",
    tags: ["business"],
  },
  {
    id: "business-saas",
    title: "List mission-critical SaaS tools",
    note: "Include invoicing, CRM, project tools, and admin access owners.",
    category: "Business",
    tags: ["business"],
  },
  {
    id: "business-finance",
    title: "Map payroll, billing, and accounting platforms",
    note: "Mark final payout and handoff steps for continuity.",
    category: "Business",
    tags: ["business"],
  },
  {
    id: "dependents-payments",
    title: "Identify recurring payments tied to dependents",
    note: "School, healthcare, caregiving, and household essentials.",
    category: "Dependents",
    tags: ["dependents"],
  },
  {
    id: "insurance-benefits",
    title: "List insurance and benefit portals",
    note: "Include claim process links and policy numbers.",
    category: "Dependents",
    tags: ["dependents"],
  },
  {
    id: "creator-channels",
    title: "List monetized creator channels",
    note: "Include YouTube, Substack, Patreon, TikTok, and payout accounts.",
    category: "Creator",
    tags: ["creator"],
  },
  {
    id: "content-archives",
    title: "Define archive vs delete instructions for content",
    note: "Specify what should stay public, be memorialized, or removed.",
    category: "Creator",
    tags: ["creator"],
  },
];

function formatChecklistText(args: {
  selectedProfiles: ProfileKey[];
  groupedItems: [string, ChecklistItem[]][];
  checkedIds: string[];
}) {
  const selectedProfileLabels = PROFILE_OPTIONS
    .filter((option) => args.selectedProfiles.includes(option.key))
    .map((option) => option.label);

  const lines: string[] = [];
  lines.push("Digital Asset Checklist");
  lines.push(`Generated on: ${new Date().toLocaleDateString()}`);
  lines.push("");
  lines.push("Selected profile flags:");
  if (selectedProfileLabels.length === 0) {
    lines.push("- None");
  } else {
    selectedProfileLabels.forEach((label) => lines.push(`- ${label}`));
  }
  lines.push("");

  args.groupedItems.forEach(([category, items]) => {
    lines.push(`${category}`);
    items.forEach((item) => {
      const checked = args.checkedIds.includes(item.id) ? "x" : " ";
      lines.push(`- [${checked}] ${item.title}`);
      lines.push(`  Note: ${item.note}`);
    });
    lines.push("");
  });

  return lines.join("\n");
}

export default function ChecklistGenerator() {
  const [selectedProfiles, setSelectedProfiles] = useState<ProfileKey[]>([]);
  const [checkedIds, setCheckedIds] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  const visibleItems = useMemo(() => {
    return CHECKLIST_ITEMS.filter((item) => {
      if (item.tags.includes("base")) {
        return true;
      }
      return item.tags.some((tag) => selectedProfiles.includes(tag as ProfileKey));
    });
  }, [selectedProfiles]);

  const groupedItems = useMemo(() => {
    const map = new Map<string, ChecklistItem[]>();
    visibleItems.forEach((item) => {
      const existing = map.get(item.category) || [];
      existing.push(item);
      map.set(item.category, existing);
    });
    return Array.from(map.entries());
  }, [visibleItems]);

  const completedCount = visibleItems.filter((item) => checkedIds.includes(item.id)).length;
  const progressPercent = visibleItems.length
    ? Math.round((completedCount / visibleItems.length) * 100)
    : 0;

  function toggleProfile(profile: ProfileKey) {
    setSelectedProfiles((prev) => {
      if (prev.includes(profile)) {
        const next = prev.filter((value) => value !== profile);
        return next;
      }
      return [...prev, profile];
    });
  }

  function toggleChecked(id: string) {
    setCheckedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((value) => value !== id);
      }
      return [...prev, id];
    });
  }

  async function copyChecklist() {
    const text = formatChecklistText({
      selectedProfiles,
      groupedItems,
      checkedIds,
    });

    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-3xl border border-zinc-200 bg-gradient-to-br from-emerald-50 via-white to-cyan-50 p-6 md:p-8">
        <h2 className="text-xl font-bold text-zinc-900 md:text-2xl">Customize your checklist</h2>
        <p className="mt-2 max-w-3xl text-zinc-700">
          Pick the options that fit your life. We will add targeted checklist items automatically.
        </p>

        <div className="mt-5 grid gap-3 sm:grid-cols-2">
          {PROFILE_OPTIONS.map((option) => {
            const active = selectedProfiles.includes(option.key);
            return (
              <button
                type="button"
                key={option.key}
                onClick={() => toggleProfile(option.key)}
                className={`rounded-2xl border p-4 text-left transition ${
                  active
                    ? "border-cyan-500 bg-cyan-50"
                    : "border-zinc-200 bg-white hover:border-zinc-300"
                }`}
              >
                <p className="font-semibold text-zinc-900">{option.label}</p>
                <p className="mt-1 text-sm text-zinc-600">{option.description}</p>
              </button>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-zinc-200 bg-white p-6 md:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h2 className="text-xl font-bold text-zinc-900 md:text-2xl">Your generated checklist</h2>
            <p className="mt-1 text-sm text-zinc-600">
              {completedCount} of {visibleItems.length} complete
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={copyChecklist}
              className="rounded-xl border border-zinc-300 px-4 py-2 text-sm font-semibold text-zinc-800 transition hover:bg-zinc-50"
            >
              {copied ? "Copied" : "Copy Checklist"}
            </button>
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-black"
            >
              Print
            </button>
          </div>
        </div>

        <div className="mt-5 h-2 w-full overflow-hidden rounded-full bg-zinc-100">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="mt-8 space-y-6">
          {groupedItems.map(([category, items]) => (
            <div key={category} className="rounded-2xl border border-zinc-200 p-4 md:p-5">
              <h3 className="text-lg font-bold text-zinc-900">{category}</h3>
              <div className="mt-4 space-y-3">
                {items.map((item) => {
                  const checked = checkedIds.includes(item.id);
                  return (
                    <label
                      key={item.id}
                      className="flex cursor-pointer items-start gap-3 rounded-xl border border-zinc-100 p-3 transition hover:bg-zinc-50"
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleChecked(item.id)}
                        className="mt-1 h-4 w-4 rounded border-zinc-300 text-cyan-600 focus:ring-cyan-500"
                      />
                      <span>
                        <span className="block font-semibold text-zinc-900">{item.title}</span>
                        <span className="block text-sm text-zinc-600">{item.note}</span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
