// Defines validated browser asset inputs for guided encrypted saves.
// Owns the minimal asset payload passed to the existing upload code.
// Does not define objective membership or store plaintext.
export interface GuidedAssetInput {
  itemId: string;
  type: string;
  metadata: Record<string, string>;
  pod: { type: string; version: string; data: Record<string, unknown> };
}
