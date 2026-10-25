// Presents email delivery and confirmation in the guide's centered slide layout.
// Owns verification instructions, action labels, and two-step progress.
// Does not send emails or decide whether an account is verified.
import type { EmailVerificationProps } from "@/types/interfaces";
import GuidedButton from "./GuidedButton";

export default function EmailVerificationSlide({ sent, busy, error, onSend, onCheck, onClose }: EmailVerificationProps) {
  return <section aria-label="Email verification" className="flex flex-1 flex-col px-5 py-8 md:px-10 md:py-12">
    <div className="flex min-h-96 flex-1 flex-col items-center justify-center text-center">
      <div className="flex w-full max-w-4xl min-h-72 md:min-h-88 flex-col items-center justify-center gap-7">
        <h1 className="text-3xl md:text-5xl font-semibold leading-tight">{sent ? "Check your inbox" : "Verify your email"}</h1>
        <p className="max-w-2xl text-base md:text-xl text-black/70 dark:text-white/70 leading-relaxed">
          {sent ? "Open the verification link in your email, then return here to continue your Cipherwill setup."
            : "We'll send a verification link to your account email. Open it to confirm your email address."}
        </p>
        {error && <p role="alert" className="max-w-lg text-sm text-red-700 dark:text-red-300">{error}</p>}
        <GuidedButton onClick={sent ? onCheck : onSend} disabled={busy}>
          {sent ? (busy ? "Checking status…" : "I've verified it") : (busy ? "Sending…" : "Send verification email")}
        </GuidedButton>
        {sent && <GuidedButton variant="secondary" onClick={onSend} disabled={busy}>Resend verification email</GuidedButton>}
      </div>
    </div>
    <footer className="mt-6 flex min-h-16 flex-col items-center justify-end gap-3">
      <GuidedButton variant="secondary" onClick={onClose} disabled={busy}>Back to overview</GuidedButton>
      <p className="text-sm text-black/60 dark:text-white/60">Step {sent ? 2 : 1} of 2</p>
    </footer>
  </section>;
}
