/**
 * Menu configuration for the public-facing Header.
 * Owns the list of links and their corresponding hover dropdown components.
 * Does NOT own sidebar navigation menus.
 */

import { WorksMenuDesktop, WorksMenuMobile } from "./WorksMenu";

const menu = [
  {
    path: "/how-it-works",
    title: "How it works",
    desktop_hover:<WorksMenuDesktop/>,
    mobile_hover:<WorksMenuMobile/>
  },
  {
    path: "/i/security",
    title: "Security",
  },
  {
    path: "/pricing",
    title: "Pricing",
  },
  {
    path: "/i/frequently-asked-questions",
    title: "FAQ",
  },
];

export default menu;
