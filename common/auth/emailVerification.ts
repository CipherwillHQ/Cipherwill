// Sends verification links and reads fresh account verification status.
// Owns backend delivery, Firebase token refresh, and the uncached status check.
// Does not mark emails verified or navigate between guide slides.
import type { ApolloClient } from "@apollo/client";
import type { User } from "firebase/auth";
import type { MeQuery } from "@/types/interfaces/metamodel";
import ME from "@/graphql/ops/auth/queries/ME";
import SEND_EMAIL_VERIFICATION from "@/graphql/ops/auth/mutations/SEND_EMAIL_VERIFICATION";

export async function sendVerificationEmail(client: ApolloClient): Promise<void> {
  const response = await client.mutate<{ sendEmailVerification: boolean }>({ mutation: SEND_EMAIL_VERIFICATION });
  if (response.data?.sendEmailVerification !== true) throw new Error("Unable to send verification email. Please try again.");
}

export async function checkEmailVerification(client: ApolloClient, user: User): Promise<boolean> {
  await user.reload();
  await user.getIdToken(true);
  const response = await client.query<MeQuery>({ query: ME, fetchPolicy: "network-only" });
  return response.data?.me?.email_verified === true;
}
