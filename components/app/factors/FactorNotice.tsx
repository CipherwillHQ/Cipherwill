export default function FactorNotice({ className }: { className?: string }) {
  return (
    <div className={className}>
      <h2 className="text-lg text-center mb-2">Please read this first</h2>
      <ul className="list-disc list-inside">
        <li>
          If your forgot or lose your security factor, you will lose access to
          your Cipherwill data because it is encrypted with your security
          factors.
        </li>
        <li>You&apos;ll have to reset your account and start over.</li>
        <li>
          Please add at least two security factors so you can recover your
          account if you lose one.
        </li>
      </ul>
    </div>
  );
}
