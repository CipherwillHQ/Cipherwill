// Extracts a descriptive label from decrypted asset JSON in browser memory.
// Owns the allowlist used by local guidance templates.
// Does not retain credentials, raw asset content, or send context anywhere.
export function getGuidanceAssetLabel(content: string, type: string): string | null {
  const parsed = JSON.parse(content) as { type?: string; data?: Record<string, unknown> };
  const expectedType = type.toLowerCase();
  if (parsed.type !== expectedType) return null;
  const field = expectedType === "bank_account" ? "bank_name"
    : expectedType === "payment_card" ? "issuer" : expectedType === "email_account" ? "provider" : null;
  const value = field ? parsed.data?.[field] : null;
  if (typeof value !== "string" || !value.trim()) return null;
  const label = value.trim().slice(0, 80);
  return expectedType === "bank_account" ? `your ${label} bank account`
    : expectedType === "payment_card" ? `your ${label} card` : `your ${label} email account`;
}
