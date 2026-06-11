// Common component prop interfaces

import { ReactNode } from "react";

export interface ComponentProps {
  children?: ReactNode;
}

export interface AssetNode {
  title: string;
  icon: any;
  activeState: string;
  decayState: string;
  activeStatus: string;
  decayStatus: string;
  timeframe: string;
}