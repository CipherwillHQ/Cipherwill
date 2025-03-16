"use client";
export default function SentryTestPage() {
  return (
    <div>
      <h1>Sentry Test Page</h1>
      <button
        onClick={() => {
          throw new Error("Sentry Test Error");
        }}
      >
        Throw Error
      </button>
    </div>
  );
}
