import { JSX } from "react";

type Divider = {
  divider: string;
  path?: string;
  segment_group?: string[];
};

type Segment = {
  icon: JSX.Element;
  title: string;
  description: string;
  path: string;
  slug: string;
  metamodel_type: string;
  plan_required: string;
  preference_key: string | null;
};

type Raw_Segment = {
  title: string;
  description: string;
  path: string;
  slug: string;
  metamodel_type: string;
  plan_required: string;
  preference_key: string | null;
};

export type { Divider, Segment, Raw_Segment };
