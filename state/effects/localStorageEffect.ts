const localStorageEffect =
  (key: any) =>
  ({ setSelf, onSet }: any) => {
    const savedValue =
      typeof localStorage === "object" ? localStorage.getItem(key) : null;
    if (savedValue != null) {
      setSelf(savedValue);
    }

    //@ts-ignore
    onSet((newValue, _, isReset) => {
      if (typeof localStorage === "object") {
        if (isReset) {
          window.localStorage.removeItem(key);
        } else {
          window.localStorage.setItem(key, newValue);
        }
      }
    });
  };

export default localStorageEffect;
