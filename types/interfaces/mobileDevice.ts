// Defines the native device bridge without authentication credentials.
// Owns capability, response and desktop-message component contracts.
// Does not implement native file handling or store vault data.
import type { ReactNode } from "react";
export interface MobileDeviceResponse { value?: unknown; error?: string | null }
export interface MobileDeviceWindow extends Window {
  CipherwillDevice?: { postMessage(message: string): void };
  CipherwillDeviceResponse?: (id: number, response: MobileDeviceResponse) => void;
}
export interface MobileCapabilities { passkeys: boolean }
export interface DesktopRequiredProps { action: string; children?: ReactNode }
