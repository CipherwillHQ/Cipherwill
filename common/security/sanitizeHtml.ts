import DOMPurify from "dompurify";

export default function sanitizeHtml(dirtyHtml: string): string {
  if (!dirtyHtml) return "";

  return DOMPurify.sanitize(dirtyHtml, {
    USE_PROFILES: { html: true },
    FORBID_TAGS: ["script", "style", "iframe", "object", "embed"],
    FORBID_ATTR: ["style"],
  });
}
