/**
 * @file tawk.ts
 * @description Shared utility to dynamically inject the Tawk.to script into the browser document.
 * @owns Script element creation and loading state checks.
 * @doesNotManage Widget UI states, user sessions, or event callback registrations.
 */

export const loadTawkScript = (propertyId: string, widgetId: string) => {
  if (typeof window === "undefined") return;

  // If the script is already added, do not add it again
  if (document.getElementById("tawk-script")) return;

  const s1 = document.createElement("script");
  s1.id = "tawk-script";
  s1.async = true;
  s1.src = `https://embed.tawk.to/${propertyId}/${widgetId}`;
  s1.charset = "UTF-8";
  s1.setAttribute("crossorigin", "*");

  const s0 = document.getElementsByTagName("script")[0];
  if (s0 && s0.parentNode) {
    s0.parentNode.insertBefore(s1, s0);
  } else {
    document.head.appendChild(s1);
  }
};
