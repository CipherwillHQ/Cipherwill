/**
 * What it does: Defines static comparison row data for comparing paper wills, password managers, and Cipherwill.
 * What it owns: Row records consisting of evaluation criteria, scores, and specific drawback explanations.
 * What it does NOT do: Does not render visual elements or handle state.
 */

export interface ComparisonRow {
  criterion: string;
  paperWill: string;
  passwordManager: string;
  cipherwill: string;
  highlight: string;
}

export const COMPARISON_ROWS: ComparisonRow[] = [
  {
    criterion: "Automated Lifesign Checks",
    paperWill: "None — Rely on family finding paper notes manually.",
    passwordManager: "None — Inactive accounts remain locked forever.",
    cipherwill: "Yes — Multi-channel heartbeats verify status passively.",
    highlight: "Cipherwill monitors your activity seamlessly without invasive checks."
  },
  {
    criterion: "Security & E2E Encryption",
    paperWill: "Zero — Exposed to anyone who finds the physical paper.",
    passwordManager: "High — But completely locked behind 2FA or Master Password.",
    cipherwill: "E2E Encrypted — AES-256-GCM browser sealing ensures zero-custody.",
    highlight: "All data is encrypted in your browser; neither hackers nor Cipherwill can read it."
  },
  {
    criterion: "Instant 2FA Bypassing",
    paperWill: "Impossible — Paper cannot click 2FA SMS or authenticator codes.",
    passwordManager: "Impossible — Families locked out by authentication layers.",
    cipherwill: "Yes — Encrypted keys bypass live 2FA blockages legally.",
    highlight: "Beneficiaries receive encrypted credentials only when conditions are met."
  },
  {
    criterion: "Immediate Asset Recovery",
    paperWill: "Months — Probate courts and lawyers take weeks to locate accounts.",
    passwordManager: "None — Most managers have no legacy handoff path at all.",
    cipherwill: "Hours — Autonomous, client-side decryption starts immediately.",
    highlight: "Assets are recovered and decodable immediately without probate delays."
  }
];
