// Provides a short guide to reviewing a shared digital will.
// Owns the recipient-facing handover guidance.
// Does not prescribe legal steps or change the will.

import { TbBook2, TbShieldCheck } from "react-icons/tb";

const steps = [
  { title: "Start with their notes", description: "Read any wishes and instructions they left for you." },
  { title: "Review the shared details", description: "Browse the accounts and information included in your access." },
  { title: "Keep an eye on the deadline", description: "Download any files you need before your access ends." },
];

export default function ExecutorGuide() {
  return (
    <aside className="h-fit rounded-2xl border border-clay/25 bg-clay/10 p-6">
      <TbBook2 size={28} className="mb-4 text-clay" />
      <h2 className="text-lg font-semibold">Take it one step at a time</h2>
      <p className="mt-2 text-sm text-neutral-600 dark:text-neutral-400">
        Everything shared here was chosen with care. You can review it at your own pace.
      </p>
      <ol className="my-6 space-y-5">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-3">
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-clay/20 text-xs font-semibold">
              {index + 1}
            </span>
            <div>
              <h3 className="text-sm font-semibold">{step.title}</h3>
              <p className="mt-1 text-sm text-neutral-600 dark:text-neutral-400">{step.description}</p>
            </div>
          </li>
        ))}
      </ol>
      <div className="flex items-start gap-2 border-t border-clay/25 pt-4 text-xs text-neutral-600 dark:text-neutral-400">
        <TbShieldCheck size={18} className="shrink-0 text-sage" />
        <p>Your access is limited to the information shared with you.</p>
      </div>
    </aside>
  );
}
