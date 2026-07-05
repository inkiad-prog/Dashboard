"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div style={{ padding: "60px 40px", maxWidth: 640 }}>
      <h1 style={{ fontSize: 20, fontWeight: 700, marginBottom: 10 }}>
        Couldn&apos;t load this page
      </h1>
      <p style={{ color: "var(--text-secondary)", marginBottom: 16, lineHeight: 1.6 }}>
        This usually means the query to the data warehouse timed out or the
        connection pool was momentarily exhausted (e.g. several pages loading
        at once). Try again — it typically resolves immediately.
      </p>
      <button className="refresh-btn" onClick={() => reset()}>
        ↻ Try again
      </button>
      {process.env.NODE_ENV === "development" && (
        <pre style={{ marginTop: 20, fontSize: 12, color: "var(--bad)", whiteSpace: "pre-wrap" }}>
          {error.message}
        </pre>
      )}
    </div>
  );
}
