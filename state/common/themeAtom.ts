import { atom } from "recoil";
import localStorageEffect from "../effects/localStorageEffect";

const themeAtom = atom({
  key: "theme", // unique ID (with respect to other atoms/selectors)
  default: "light", // default value (aka initial value)
  effects: [localStorageEffect("theme")],
});

export default themeAtom;