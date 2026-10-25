// Displays the existing note-loading placeholder.
// Owns the skeleton shown while note content loads.
// Does not load, edit or save notes.
export default function NoteLoading() {
    return (
      <div className="w-full h-full flex flex-col p-6 sm:p-8 animate-pulse space-y-6 bg-secondary">
        {/* Skeletal Header */}
        <div className="h-8 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/3" />
        
        {/* Skeletal Body Lines */}
        <div className="space-y-3 pt-4">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-5/6" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-2/3" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-1/2" />
        </div>
        
        <div className="space-y-3 pt-6">
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-5/6" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-4/5" />
          <div className="h-4 bg-neutral-200 dark:bg-neutral-800 rounded-md w-3/4" />
        </div>

        {/* Center engaging indicator */}
        <div className="flex-1 flex flex-col items-center justify-center pt-10">
          <div className="w-10 h-10 border-2 border-primary-100 border-t-primary rounded-full animate-spin mb-3" />
          <p className="text-xs text-neutral-400 font-semibold tracking-wide uppercase">loading note...</p>
        </div>
      </div>
    );
}
