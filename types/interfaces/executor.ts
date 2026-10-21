// Defines presentation contracts for the executor workspace.
// Owns shared navigation, status, and read-only data component props.
// Does not define access permissions or encryption behavior.

import type { ReactNode } from "react";

export interface ExecutorMenuItem {
  title: string;
  path: string;
  icon: ReactNode;
}

export interface ExecutorStateProps {
  title: string;
  description: string;
  error?: boolean;
  children?: ReactNode;
}

export interface ExecutorStatProps {
  label: string;
  value: ReactNode;
  description: string;
  icon: ReactNode;
}

export interface ExecutorDataCardProps {
  href: string;
  title: string;
  updatedAt: string;
  icon: ReactNode;
}

export interface ExecutorDataListProps {
  slug: string;
  folderId?: string;
  children?: ReactNode;
}

export interface ExecutorDetailsLayoutProps {
  title: string;
  subtitle: string;
  createdAt: string;
  updatedAt: string;
  children: ReactNode;
}

export interface ExecutorFieldProps {
  label: string;
  value: string | string[];
  sensitive: boolean;
  monospace?: boolean;
}

export interface GrantedDataContentProps {
  slug: string;
  accessId: string;
  modelId: string;
}
