// Defines persistent objective choices and the compact Do later list contracts.
// Owns deferral timestamps, explicit dismissals, and resume callbacks.
// Does not include draft answers or private asset context.
export interface GuidanceDeferral { objectiveId: string; resumeAfter: string | null; dismissed: boolean }
export interface DeferredGuidanceItem { objectiveId: string; title: string; resumeAfter: string | null }
export interface DeferredGuidanceProps {
  deferred: DeferredGuidanceItem[];
  onResume: (objectiveId: string) => void;
}
export interface DeferredGuidancePopupProps extends DeferredGuidanceProps {
  open: boolean;
  loading: boolean;
  onClose: () => void;
}
