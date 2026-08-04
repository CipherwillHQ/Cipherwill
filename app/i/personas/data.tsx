/**
 * Central personas data entry point for Cipherwill.
 * Aggregates all role-based persona guides (Engineers, Crypto Traders, Financial Investors, Business Owners).
 * Does NOT own individual persona content details or UI rendering components.
 */

import { PersonaGuide } from "@/types/interfaces";
import { softwareEngineerPersona } from "./data/software-engineer";
import { cryptoTraderPersona } from "./data/crypto-trader";
import { financialInvestorPersona } from "./data/financial-investor";
import { businessOwnerPersona } from "./data/business-owner";

const personas: PersonaGuide[] = [
  softwareEngineerPersona,
  cryptoTraderPersona,
  financialInvestorPersona,
  businessOwnerPersona,
];

export default personas;
