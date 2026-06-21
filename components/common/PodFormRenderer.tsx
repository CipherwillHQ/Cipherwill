// Renders pod form sections: mandatory fields, toggleable fields, groups, custom sections, and add-dropdown.
// Owns: layout and animation of form sections. Does NOT own visibility logic — receives it as props.
"use client";
import { AnimatePresence, motion } from "framer-motion";
import { TbTrash } from "react-icons/tb";
import PodFormField from "./PodFormField";
import PodFormDropdown, { type DropdownItem as IDropdownItem } from "./PodFormDropdown";
import type { PodFieldConfig, PodCustomSectionDef } from "./PodForm";

interface PodFormRendererProps {
  standaloneMandatory: PodFieldConfig[];
  mandatoryGroups: [string, PodFieldConfig[]][];
  mandatorySections: PodCustomSectionDef[];
  visibleStandalone: PodFieldConfig[];
  visibleGroups: [string, PodFieldConfig[]][];
  visibleSections: PodCustomSectionDef[];
  dropdownFields: IDropdownItem[];
  dropdownGroups: IDropdownItem[];
  dropdownSections: IDropdownItem[];
  menuOpen: boolean;
  hasAvailableItems: boolean;
  data: Record<string, any>;
  onChange: (key: string, value: string) => void;
  renderCustomSection?: (key: string) => React.ReactNode;
  onRemoveField: (key: string) => void;
  onRemoveGroup: (groupId: string) => void;
  onRemoveSection: (key: string) => void;
  onAddField: (key: string) => void;
  onAddGroup: (groupId: string) => void;
  onAddSection: (key: string) => void;
  onOpenMenu: () => void;
  onCloseMenu: () => void;
}

const itemAnim = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.28, ease: [0.25, 1, 0.5, 1] as [number, number, number, number] },
};

function renderField(field: PodFieldConfig, data: Record<string, any>, onChange: (key: string, value: string) => void) {
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

export default function PodFormRenderer({
  standaloneMandatory,
  mandatoryGroups,
  mandatorySections,
  visibleStandalone,
  visibleGroups,
  visibleSections,
  dropdownFields,
  dropdownGroups,
  dropdownSections,
  menuOpen,
  hasAvailableItems,
  data,
  onChange,
  renderCustomSection,
  onRemoveField,
  onRemoveGroup,
  onRemoveSection,
  onAddField,
  onAddGroup,
  onAddSection,
  onOpenMenu,
  onCloseMenu,
}: PodFormRendererProps) {
  return (
    <>
      {standaloneMandatory.map((field) => renderField(field, data, onChange))}

      {mandatoryGroups.map(([groupId, groupFields]) => (
        <div key={groupId}>
          <div className="font-semibold text-sm mb-2">{groupFields[0]!.group!.label}</div>
          <div className="flex flex-col gap-4">
            {groupFields.map((field) => renderField(field, data, onChange))}
          </div>
        </div>
      ))}

      {mandatorySections.map((section) => (
        <div key={section.key}>{renderCustomSection?.(section.key)}</div>
      ))}

      <AnimatePresence>
        {visibleStandalone.map((field) => (
          <motion.div key={field.key} {...itemAnim} className="flex items-center gap-1">
            <div className="flex-1">
              {renderField(field, data, onChange)}
            </div>
            <button
              type="button"
              className="text-neutral-400 hover:text-error shrink-0 mt-5"
              onClick={() => onRemoveField(field.key)}
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
                {groupFields.map((field) => renderField(field, data, onChange))}
              </div>
              <button
                type="button"
                className="text-neutral-400 hover:text-error shrink-0 mt-1"
                onClick={() => onRemoveGroup(groupId)}
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
              onClick={() => onRemoveSection(section.key)}
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
            onClose={onCloseMenu}
            fields={dropdownFields}
            groups={dropdownGroups}
            sections={dropdownSections}
            onAddField={onAddField}
            onAddGroup={onAddGroup}
            onAddSection={onAddSection}
          />
        ) : (
          <button
            type="button"
            className="text-sm text-blue-500 hover:text-blue-600 font-medium text-left py-1"
            onClick={onOpenMenu}
          >
            + Add more details
          </button>
        ))}
    </>
  );
}
