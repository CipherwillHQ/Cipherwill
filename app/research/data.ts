/**
 * Central research database registry for Cipherwill (/research).
 * Aggregates all published research pieces in reverse chronological order.
 * Does NOT own individual study datasets or UI rendering logic.
 */

import { ResearchPiece } from "@/types/interfaces";
import { postDeathAccountAccess2026 } from "./data/post-death-account-access-2026";

const researchPieces: ResearchPiece[] = [postDeathAccountAccess2026];

export default researchPieces;
