"use client";
import { useRef, useEffect } from "react";

export interface DropdownItem {
  key: string;
  label: string;
}

interface PodFormDropdownProps {
  menuOpen: boolean;
  onClose: () => void;
  fields: DropdownItem[];
  groups: DropdownItem[];
  sections: DropdownItem[];
  onAddField: (key: string) => void;
  onAddGroup: (groupId: string) => void;
  onAddSection: (key: string) => void;
}

export default function PodFormDropdown({
  menuOpen,
  onClose,
  fields,
  groups,
  sections,
  onAddField,
  onAddGroup,
  onAddSection,
}: PodFormDropdownProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const handleClick = (e: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target as Node) &&
        buttonRef.current &&
        !buttonRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [menuOpen, onClose]);

  const showFieldSection = fields.length > 0;
  const showGroupSection = groups.length > 0;
  const showSectionSection = sections.length > 0;

  return (
    <div className="relative">
      <button
        ref={buttonRef}
        type="button"
        className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left py-1"
        onClick={onClose}
      >
        Cancel
      </button>

      <div
        ref={menuRef}
        className="absolute left-0 top-full mt-1 z-10 bg-secondary border border-default rounded-xl shadow-lg py-1 w-full"
      >
        {showFieldSection &&
          fields.map((f) => (
            <button
              key={f.key}
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-forest dark:text-cream hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => onAddField(f.key)}
            >
              {f.label}
            </button>
          ))}

        {showFieldSection && showGroupSection && (
          <div className="border-t border-default my-1" />
        )}

        {showGroupSection &&
          groups.map((g) => (
            <button
              key={g.key}
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-forest dark:text-cream hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => onAddGroup(g.key)}
            >
              {g.label}
            </button>
          ))}

        {(showFieldSection || showGroupSection) && showSectionSection && (
          <div className="border-t border-default my-1" />
        )}

        {showSectionSection &&
          sections.map((s) => (
            <button
              key={s.key}
              type="button"
              className="w-full text-left px-3 py-2 text-sm text-forest dark:text-cream hover:bg-neutral-100 dark:hover:bg-neutral-800"
              onClick={() => onAddSection(s.key)}
            >
              {s.label}
            </button>
          ))}
      </div>
    </div>
  );
}
