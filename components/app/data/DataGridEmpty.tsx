// DataGridEmpty
// What it does: Empty state for data segment list pages. Shows segment icon, heading, and the AddDataCard CTA.
// What it owns: The visual empty-state layout — icon, title, and children slot.
// What it does NOT do: Does not handle the mutation itself; the caller passes the AddDataCard as children.

import { ReactNode } from "react";

export default function DataGridEmpty({
  icon,
  title,
  children,
}: {
  icon: ReactNode;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4">
      <div className="text-clay">{icon}</div>
      <div className="font-semibold text-lg text-forest dark:text-cream">{title}</div>
      {children}
    </div>
  );
}
