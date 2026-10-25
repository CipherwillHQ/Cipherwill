// Defines the shared inline banner area's content contract.
// Owns the child slot used to stack account notices.
// Does not select notices or define their actions.
import type { ReactNode } from "react";

export interface BannerAreaProps {
  children: ReactNode;
}
