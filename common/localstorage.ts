export function localstorage_get(key: string) {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(key);
}

export function localstorage_set(key: string, value: string) {
  if (typeof window === "undefined") return null;
  localStorage.setItem(key, value);
  return value;
}