// Config-driven pod form with mandatory/optional/skippable field visibility and add/remove controls.
// Owns: add/remove state, form layout, animation. Does NOT own visibility computation or field rendering.
"use client";
import { useState, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbTrash } from "react-icons/tb";
import type { PodFieldConfig, PodCustomSectionDef, PodFormHandle } from "@/types/interfaces";
import { usePodFormVisibility } from "./usePodFormVisibility";
import { buildGroupMap } from "./podFormUtils";
import PodFormField from "./PodFormField";
import PodFormDropdown from "./PodFormDropdown";

export type { PodFieldConfig, PodCustomSectionDef, PodFormHandle };

interface PodFormProps {
  fields: PodFieldConfig[];
  data: Record<string, any>;
  onChange: (key: string, value: string) => void;
  customSections?: PodCustomSectionDef[];
  renderCustomSection?: (key: string) => React.ReactNode;
  onRemoveCustomSection?: (key: string) => void;
}

const itemAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
};

const PodForm = forwardRef<PodFormHandle, PodFormProps>(function PodForm({
  fields,
  data,
  onChange,
  customSections = [],
  renderCustomSection,
  onRemoveCustomSection,
}, ref) {
  const [manuallyAdded, setManuallyAdded] = useState<Set<string>>(new Set());
  const [manuallyRemoved, setManuallyRemoved] = useState<Set<string>>(new Set());
  const [menuOpen, setMenuOpen] = useState(false);

  const vis = usePodFormVisibility(fields, customSections, data, manuallyAdded, manuallyRemoved);
  const toggleableGroupsMap = buildGroupMap(fields.filter((f) => f.visibility !== "mandatory"));

  function markAdded(key: string) {
    setManuallyAdded((prev) => new Set(prev).add(key));
    setManuallyRemoved((prev) => { const n = new Set(prev); n.delete(key); return n; });
    setMenuOpen(false);
  }

  function markRemoved(key: string) {
    setManuallyAdded((prev) => { const n = new Set(prev); n.delete(key); return n; });
    setManuallyRemoved((prev) => new Set(prev).add(key));
    onChange(key, "");
  }

  function addGroup(groupId: string) {
    const g = toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    setMenuOpen(false);
  }

  function removeGroup(groupId: string) {
    const g = toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => { const n = new Set(prev); g.forEach((f) => n.delete(f.key)); return n; });
    setManuallyRemoved((prev) => { const n = new Set(prev); g.forEach((f) => n.add(f.key)); return n; });
    g.forEach((f) => onChange(f.key, ""));
  }

  function removeSection(key: string) {
    markRemoved(key);
    onRemoveCustomSection?.(key);
  }

  useImperativeHandle(ref, () => ({
    addField: (k: string) => markAdded(k),
    addGroup: (g: string) => addGroup(g),
    addSection: (k: string) => markAdded(k),
  }));

  if (fields.length === 0 && customSections.length === 0) return null;

  function renderField(f: PodFieldConfig) {
    return (
      <PodFormField
        key={f.key}
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
            menuOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            fields={vis.dropdownFields}
            groups={vis.dropdownGroups}
            sections={vis.dropdownSections}
            onAddField={(k) => markAdded(k)}
            onAddGroup={(g) => addGroup(g)}
            onAddSection={(k) => markAdded(k)}
          />
        ) : (
          <button type="button" className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left py-1" onClick={() => setMenuOpen(true)}>
            + Add more details
          </button>
        ))}
    </>
  );
});

export default PodForm;
