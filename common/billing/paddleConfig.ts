// Shares Paddle configuration between authenticated billing and public upgrades.
// Owns the environment, client token, and existing subscription price IDs.
// Does not initialize checkout or identify an account.
import { BUILD_ENV } from "@/common/constant";

export const PADDLE_ENVIRONMENT = BUILD_ENV === "production" ? "production" : "sandbox";
export const PADDLE_TOKEN = process.env.NEXT_PUBLIC_PADDLE_TOKEN ?? "";
export const PADDLE_YEARLY_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_YEARLY_PRICE_ID ?? "no-id-found";
export const PADDLE_MONTHLY_PRICE_ID = process.env.NEXT_PUBLIC_PADDLE_MONTHLY_PRICE_ID ?? "no-id-found";
