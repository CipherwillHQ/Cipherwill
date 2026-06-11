/**
 * What it does: Holds the step description records for the "How It Works" heartbeat check-in process.
 * What it owns: Step index, title, icon mappings, and security margin descriptions.
 * What it does NOT do: Does not render step timelines or manage interactive state.
 */

import { TbClock, TbBell, TbBellRinging, TbKey } from "react-icons/tb";

export interface WorkflowStep {
  title: string;
  icon: any;
  duration: string;
  description: string;
}

export const WORKFLOW_STEPS: WorkflowStep[] = [
  {
    title: "Activity Trigger Check",
    icon: TbClock,
    duration: "Default 3 Months",
    description: "We monitor your login activity. If zero platform activity is registered within your chosen check-in interval, the automated timeline is safely initiated."
  },
  {
    title: "First Secure Check-in",
    icon: TbBell,
    duration: "Day 3 of Silence",
    description: "To prevent premature triggers, we dispatch a secure check-in notification across your registered contact channels. Logging in once instantly resets the entire schedule."
  },
  {
    title: "Heightened Alerts",
    icon: TbBellRinging,
    duration: "Day 30 of Silence",
    description: "If the silence continues, we issue heightened alerts to your registered channels. You can cancel and reset the countdown anytime simply by logging in."
  },
  {
    title: "Decryption Key Release",
    icon: TbKey,
    duration: "Day 100 of Silence",
    description: "If silence remains unbroken after final warnings, your pre-sharded contingency decryption keys are securely released to your beneficiaries' dashboards."
  }
];
