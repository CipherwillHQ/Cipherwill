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
  plan_required: string;
  preference_key: string | null;
};

export type { Divider, Segment };