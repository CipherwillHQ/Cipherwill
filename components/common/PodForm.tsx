// Config-driven pod form with mandatory/optional/skippable field visibility and add/remove controls.
// Owns: visibility logic, field/group/section add/remove state, form layout and animation.
"use client";
import { useState, forwardRef, useImperativeHandle } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { TbTrash } from "react-icons/tb";
import PodFormField from "./PodFormField";
import PodFormDropdown from "./PodFormDropdown";
import { fieldHasValue, buildGroupMap } from "./podFormUtils";

export type PodFieldVisibility = "mandatory" | "optional" | "skippable";

export interface PodFieldConfig {
  key: string;
  label: string;
  placeholder?: string;
  type?: "text" | "password" | "textarea";
  visibility: PodFieldVisibility;
  group?: { id: string; label: string };
}

export interface PodCustomSectionDef {
  key: string;
  label: string;
  dataKey: string;
  visibility: PodFieldVisibility;
}

export interface PodFormHandle {
  addField: (key: string) => void;
  addGroup: (groupId: string) => void;
  addSection: (key: string) => void;
}

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

  const mandatoryFields = fields.filter((f) => f.visibility === "mandatory");
  const toggleableFields = fields.filter((f) => f.visibility !== "mandatory");
  const mandatoryGroupsMap = buildGroupMap(mandatoryFields);
  const toggleableGroupsMap = buildGroupMap(toggleableFields);
  const standaloneMandatory = mandatoryFields.filter((f) => !f.group);
  const standaloneToggleable = toggleableFields.filter((f) => !f.group);
  const mandatorySections = customSections.filter((s) => s.visibility === "mandatory");
  const toggleableSections = customSections.filter((s) => s.visibility !== "mandatory");

  const visibleFieldKeys = new Set<string>();
  toggleableFields.forEach((f) => {
    if (fieldHasValue(data[f.key])) visibleFieldKeys.add(f.key);
    if (manuallyAdded.has(f.key)) visibleFieldKeys.add(f.key);
    if (manuallyRemoved.has(f.key)) visibleFieldKeys.delete(f.key);
  });

  const visibleGroupIds = new Set<string>();
  toggleableGroupsMap.forEach((groupFields, groupId) => {
    if (groupFields.some((f) => visibleFieldKeys.has(f.key))) visibleGroupIds.add(groupId);
  });

  const visibleStandalone = standaloneToggleable.filter((f) => visibleFieldKeys.has(f.key));
  const visibleGroups = Array.from(toggleableGroupsMap.entries()).filter(([id]) => visibleGroupIds.has(id));
  const visibleSections = toggleableSections.filter((s) => {
    if (fieldHasValue(data[s.dataKey])) return true;
    if (manuallyAdded.has(s.key)) return true;
    if (manuallyRemoved.has(s.key)) return false;
    return false;
  });

  const dropdownFields = standaloneToggleable
    .filter((f) => !visibleFieldKeys.has(f.key))
    .map((f) => ({ key: f.key, label: f.label }));
  const dropdownGroups = Array.from(toggleableGroupsMap.entries())
    .filter(([id]) => !visibleGroupIds.has(id))
    .map(([id, groupFields]) => ({ key: id, label: groupFields[0]!.group!.label }));
  const dropdownSections = toggleableSections
    .filter((s) => !visibleSections.some((vs) => vs.key === s.key))
    .map((s) => ({ key: s.key, label: s.label }));
  const hasAvailableItems = dropdownFields.length > 0 || dropdownGroups.length > 0 || dropdownSections.length > 0;

  function markAdded(key: string) {
    setManuallyAdded((prev) => new Set(prev).add(key));
    setManuallyRemoved((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    setMenuOpen(false);
  }

  function markRemoved(key: string) {
    setManuallyAdded((prev) => {
      const next = new Set(prev);
      next.delete(key);
      return next;
    });
    setManuallyRemoved((prev) => new Set(prev).add(key));
    onChange(key, "");
  }

  function addGroup(groupId: string) {
    const groupFields = toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => {
      const next = new Set(prev);
      groupFields.forEach((f) => next.add(f.key));
      return next;
    });
    setManuallyRemoved((prev) => {
      const next = new Set(prev);
      groupFields.forEach((f) => next.delete(f.key));
      return next;
    });
    setMenuOpen(false);
  }

  function removeGroup(groupId: string) {
    const groupFields = toggleableGroupsMap.get(groupId) || [];
    setManuallyAdded((prev) => {
      const next = new Set(prev);
      groupFields.forEach((f) => next.delete(f.key));
      return next;
    });
    setManuallyRemoved((prev) => {
      const next = new Set(prev);
      groupFields.forEach((f) => next.add(f.key));
      return next;
    });
    groupFields.forEach((f) => onChange(f.key, ""));
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

  function renderFieldValue(field: PodFieldConfig) {
    return (
      <PodFormField
        key={field.key}
        label={field.label}
        placeholder={field.placeholder}
        type={field.type}
        value={String(data[field.key] ?? "")}
        onChange={(value) => onChange(field.key, value)}
      />
    );
  }

  return (
    <>
      {standaloneMandatory.map((f) => renderFieldValue(f))}

      {Array.from(mandatoryGroupsMap.entries()).map(([groupId, groupFields]) => (
        <div key={groupId}>
          <div className="font-semibold text-sm mb-2">{groupFields[0]!.group!.label}</div>
          <div className="flex flex-col gap-4">
            {groupFields.map((f) => renderFieldValue(f))}
          </div>
        </div>
      ))}

      {mandatorySections.map((section) => (
        <div key={section.key}>{renderCustomSection?.(section.key)}</div>
      ))}

      <AnimatePresence>
        {visibleStandalone.map((field) => (
          <motion.div key={field.key} {...itemAnim} className="flex items-center gap-1">
            <div className="flex-1">{renderFieldValue(field)}</div>
            <button
              type="button"
              className="text-neutral-400 hover:text-error shrink-0 mt-5"
              onClick={() => markRemoved(field.key)}
            >
              <TbTrash size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {visibleGroups.map(([groupId, groupFields]) => (
          <motion.div key={groupId} {...itemAnim}>
            <div className="font-semibold text-sm mb-2">{groupFields[0]!.group!.label}</div>
            <div className="flex items-start gap-1">
              <div className="flex-1 flex flex-col gap-4">
                {groupFields.map((f) => renderFieldValue(f))}
              </div>
              <button
                type="button"
                className="text-neutral-400 hover:text-error shrink-0 mt-1"
                onClick={() => removeGroup(groupId)}
              >
                <TbTrash size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {visibleSections.map((section) => (
          <motion.div key={section.key} {...itemAnim} className="flex items-start gap-1">
            <div className="flex-1">{renderCustomSection?.(section.key)}</div>
            <button
              type="button"
              className="text-neutral-400 hover:text-error shrink-0 mt-1"
              onClick={() => removeSection(section.key)}
            >
              <TbTrash size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasAvailableItems &&
        (menuOpen ? (
          <PodFormDropdown
            menuOpen={menuOpen}
            onClose={() => setMenuOpen(false)}
            fields={dropdownFields}
            groups={dropdownGroups}
            sections={dropdownSections}
            onAddField={(k) => markAdded(k)}
            onAddGroup={(g) => addGroup(g)}
            onAddSection={(k) => markAdded(k)}
          />
        ) : (
          <button
            type="button"
            className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left py-1"
            onClick={() => setMenuOpen(true)}
          >
            + Add more details
          </button>
        ))}
    </>
  );
});

export default PodForm;
