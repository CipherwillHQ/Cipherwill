"use client";
export default function ClientButton({
    url
}) {
  return (
    <button
      onClick={() => window.open(url, "_blank")}
      className="hover:underline text-blue-600 font-medium text-sm"
    >
      {url}
    </button>
  );
}
