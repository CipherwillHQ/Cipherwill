// Config-driven pod form view: renders mandatory/optional/skippable fields and add/remove controls.
// Owns: dropdown menu toggle, field rendering, remove buttons. Does NOT own visibility state or add/remove logic.
"use client";
import { useState, useCallback } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbTrash } from "react-icons/tb";
import type { PodFieldConfig, VisibilityState } from "@/types/interfaces";
import PodFormField from "./PodFormField";
import PodFormDropdown from "./PodFormDropdown";

interface PodFormProps {
  data: Record<string, any>;
  onChange: (key: string, value: string) => void;
  vis: VisibilityState;
  markAdded: (key: string) => void;
  markRemoved: (key: string) => void;
  addGroup: (groupId: string) => void;
  removeGroup: (groupId: string) => void;
  renderCustomSection?: (key: string) => React.ReactNode;
  onRemoveCustomSection?: (key: string) => void;
}

const itemAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
};

export default function PodForm({
  data,
  onChange,
  vis,
  markAdded,
  markRemoved,
  addGroup,
  removeGroup,
  renderCustomSection,
  onRemoveCustomSection,
}: PodFormProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  const closeMenu = useCallback(() => setMenuOpen(false), []);

  function removeSection(key: string) {
    markRemoved(key);
    onRemoveCustomSection?.(key);
  }

  function renderField(f: PodFieldConfig) {
    return (
      <PodFormField
        key={f.key}
        id={f.key}
        label={f.label}
        placeholder={f.placeholder}
        type={f.type}
        value={String(data[f.key] ?? "")}
        onChange={(v) => onChange(f.key, v)}
      />
    );
  }

  return (
    <>
      {vis.standaloneMandatory.map((f) => renderField(f))}

      {Array.from(vis.mandatoryGroupsMap.entries()).map(([groupId, gFields]) => (
        <div key={groupId}>
          <div className="font-semibold text-sm mb-2">{gFields[0]!.group!.label}</div>
          <div className="flex flex-col gap-4">{gFields.map((f) => renderField(f))}</div>
        </div>
      ))}

      {vis.mandatorySections.map((s) => (
        <div key={s.key}>{renderCustomSection?.(s.key)}</div>
      ))}

      <AnimatePresence>
        {vis.visibleStandalone.map((f) => (
          <motion.div key={f.key} {...itemAnim} className="flex items-center gap-1">
            <div className="flex-1">{renderField(f)}</div>
            <button type="button" className="text-neutral-400 hover:text-error shrink-0 mt-5" onClick={() => markRemoved(f.key)}>
              <TbTrash size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {vis.visibleGroups.map(([groupId, gFields]) => (
          <motion.div key={groupId} {...itemAnim}>
            <div className="font-semibold text-sm mb-2">{gFields[0]!.group!.label}</div>
            <div className="flex items-start gap-1">
              <div className="flex-1 flex flex-col gap-4">{gFields.map((f) => renderField(f))}</div>
              <button type="button" className="text-neutral-400 hover:text-error shrink-0 mt-1" onClick={() => removeGroup(groupId)}>
                <TbTrash size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {vis.visibleSections.map((s) => (
          <motion.div key={s.key} {...itemAnim} className="flex items-start gap-1">
            <div className="flex-1">{renderCustomSection?.(s.key)}</div>
            <button type="button" className="text-neutral-400 hover:text-error shrink-0 mt-1" onClick={() => removeSection(s.key)}>
              <TbTrash size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {vis.hasAvailableItems &&
        (menuOpen ? (
          <PodFormDropdown
            onClose={closeMenu}
            fields={vis.dropdownFields}
            groups={vis.dropdownGroups}
            sections={vis.dropdownSections}
            onAddField={(k) => { markAdded(k); setMenuOpen(false); }}
            onAddGroup={(g) => { addGroup(g); setMenuOpen(false); }}
            onAddSection={(k) => { markAdded(k); setMenuOpen(false); }}
          />
        ) : (
          <button type="button" className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left py-1" onClick={() => setMenuOpen(true)}>
            + Add more details
          </button>
        ))}
    </>
  );
}
