// Converts plain text to safe paragraph HTML for rich-text note storage.
// Owns HTML escaping and newline preservation.
// Does not sanitize existing HTML or render user content.
export function plainTextToHtml(value: string) {
  const escaped = value.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  return `<p>${escaped.replace(/\r?\n/g, "<br>")}</p>`;
}
