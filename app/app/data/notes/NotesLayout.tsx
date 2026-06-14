"use client";
/**
 * app/app/data/notes/NotesLayout.tsx
 * Redesigned layout for notes screen to support secondary sidebar on desktop
 * and standard lists on mobile.
 * Overrides layout scrolling to occupy the full device height and width.
 */
import { useEffect, useState, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import { GetMetamodelsQuery, GetMetamodelsVariables } from "../../../../types/interfaces";
import { parseMetamodelMetadata } from "../../../../common/metamodel/utils";
import CreateNote from "./CreateNote";
import { IoSearch } from "react-icons/io5";
import MobileFloatingMenu from "@/components/app/Sidebar/MobileFloatingMenu";
import MobileMenu from "@/components/app/Sidebar/MobileMenu";

export default function NotesLayout({
  activeId,
  children,
}: {
  activeId?: string;
  children?: React.ReactNode;
}) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");

  const { data, loading, error, fetchMore } = useQuery<GetMetamodelsQuery, GetMetamodelsVariables>(
    GET_METAMODELS,
    {
      variables: {
        type: "NOTE",
      },
    }
  );

  const models = useMemo(() => data?.getMetamodels?.models || [], [data]);
  const hasMore = data?.getMetamodels?.has_more || false;

  // Filter models locally in the browser as requested
  const filteredModels = useMemo(() => {
    if (!searchQuery.trim()) return models;
    return models.filter((model) => {
      const parsed = parseMetamodelMetadata(model);
      const title = ((parsed as any).title || parsed.name || "").toLowerCase();
      return title.includes(searchQuery.toLowerCase());
    });
  }, [models, searchQuery]);

  // Redirect to first note on desktop if no activeId is present
  useEffect(() => {
    if (typeof window !== "undefined" && window.innerWidth >= 1024 && !activeId && models.length > 0) {
      router.replace(`/app/data/notes/${models[0].id}`);
    }
  }, [activeId, models, router]);

  // Loading and Error states
  if (loading && models.length === 0) {
    return (
      <div className="flex h-screen items-center justify-center bg-dashboardCream dark:bg-darkCanvas">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-error bg-error/10 rounded-md m-4">
        Error loading notes: {error.message}
      </div>
    );
  }

  return (
    <div className="fixed inset-0 sm:left-60 bg-dashboardCream dark:bg-darkCanvas flex overflow-hidden z-20">
      {/* Secondary Sidebar (Left Pane) */}
      <div
        className={`${
          activeId !== undefined ? "hidden lg:flex" : "flex"
        } flex-col w-full lg:w-80 xl:w-96 border-r border-default h-full bg-secondary pb-16 lg:pb-0`}
      >
        {/* Header with Search and Create */}
        <div className="p-4 flex flex-col gap-3 border-b border-default bg-secondary">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="lg:hidden flex items-center">
                <MobileFloatingMenu />
              </div>
              <h1 className="text-xl font-semibold text-forest dark:text-cream">Notes</h1>
            </div>
            <CreateNote />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search notes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm rounded-md border border-default bg-neutral-50 dark:bg-neutral-800/50 text-forest dark:text-cream placeholder-neutral-400 focus:outline-hidden focus:ring-1 focus:ring-primary"
            />
            <IoSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4" />
          </div>
        </div>

        {/* Notes List */}
        <div className="flex-1 overflow-y-auto customScrollbar p-2 space-y-1 bg-secondary">
          {filteredModels.length === 0 ? (
            <div className="text-center py-8 text-sm text-neutral-400">
              No notes found
            </div>
          ) : (
            filteredModels.map((model) => {
              const parsed = parseMetamodelMetadata(model);
              const title = (parsed as any).title || parsed.name || "Untitled Note";
              const isActive = model.id === activeId;
              return (
                <div
                  key={model.id}
                  onClick={() => router.push(`/app/data/notes/${model.id}`)}
                  className={`p-3 rounded-lg cursor-pointer transition-colors border-l-4 ${
                    isActive
                      ? "bg-primary-50 dark:bg-darkAccent border-primary text-forest dark:text-cream font-semibold"
                      : "border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300"
                  }`}
                >
                  <div className="font-medium text-sm truncate">{title}</div>
                  <div className="text-xs text-neutral-400 mt-1">
                    {new Date(parseInt(model.updated_at)).toLocaleDateString()}
                  </div>
                </div>
              );
            })
          )}

          {hasMore && (
            <button
              onClick={() => {
                fetchMore({
                  variables: {
                    cursor: models[models.length - 1].id,
                  },
                  updateQuery: (prev: GetMetamodelsQuery, { fetchMoreResult }: { fetchMoreResult: GetMetamodelsQuery }) => {
                    if (!fetchMoreResult) return prev;
                    return {
                      getMetamodels: {
                        models: [
                          ...prev.getMetamodels.models,
                          ...fetchMoreResult.getMetamodels.models,
                        ],
                        has_more: fetchMoreResult.getMetamodels.has_more,
                      },
                    };
                  },
                });
              }}
              className="w-full text-center py-2 text-xs text-primary hover:underline"
            >
              Load more
            </button>
          )}
        </div>

        {/* Mobile bottom bar menu visible on Notes list screen */}
        <div className="lg:hidden">
          <MobileMenu />
        </div>
      </div>

      {/* Editor Pane (Right Pane) */}
      <div
        className={`${
          activeId === undefined ? "hidden lg:flex" : "flex"
        } flex-1 flex-col h-full bg-secondary overflow-hidden`}
      >
        {activeId !== undefined ? (
          children
        ) : (
          <div className="flex flex-col flex-1 items-center justify-center p-8 text-center text-neutral-400 bg-dashboardCream dark:bg-darkCanvas h-full">
            <svg
              className="w-16 h-16 mb-4 text-neutral-300 dark:text-neutral-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            <p className="text-base font-medium">No note selected</p>
            <p className="text-sm mt-1">Select a note from the list, or create a new one to start writing.</p>
          </div>
        )}
      </div>
    </div>
  );
}
