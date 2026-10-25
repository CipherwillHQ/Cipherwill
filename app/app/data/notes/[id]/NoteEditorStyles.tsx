// Provides the existing note editor typography.
// Owns scoped ProseMirror styles shared by the note editor surface.
// Does not manage note content or autosave.
export default function NoteEditorStyles() {
  return (
      <style>{`
        .ProseMirror:focus {
          outline: none;
        }
        .ProseMirror {
          min-height: calc(100vh - 160px);
          font-family: var(--font-gilroy), sans-serif;
          font-size: 1rem;
        }
        .ProseMirror p {
          margin-bottom: 0.5rem;
        }
        .ProseMirror h1 {
          font-size: 1.875rem;
          font-weight: 700;
          margin-top: 2rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h2 {
          font-size: 1.5rem;
          font-weight: 600;
          margin-top: 1.75rem;
          margin-bottom: 0.75rem;
        }
        .ProseMirror h3 {
          font-size: 1.25rem;
          font-weight: 600;
          margin-top: 1.5rem;
          margin-bottom: 0.5rem;
        }
        .ProseMirror ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror ol {
          list-style-type: decimal;
          padding-left: 1.5rem;
          margin-bottom: 1rem;
        }
        .ProseMirror li {
          margin-bottom: 0.25rem;
        }
        .ProseMirror strong {
          font-weight: 700;
        }
        .ProseMirror em {
          font-style: italic;
        }
        .ProseMirror blockquote {
          border-left: 4px solid #003ecb;
          padding-left: 1rem;
          font-style: italic;
          margin-bottom: 1rem;
          color: #6b7280;
        }
        .ProseMirror pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.375rem;
          font-family: monospace;
          margin-bottom: 1rem;
          overflow-x: auto;
        }
        .dark .ProseMirror pre {
          background-color: #111827;
        }
      `}</style>
  );
}
