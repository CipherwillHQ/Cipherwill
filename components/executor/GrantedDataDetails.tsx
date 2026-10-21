// Connects executor detail routes to the shared content view.
// Owns item identity so revealed data resets when navigating between items.
// Does not fetch contents or manage decryption itself.

"use client";

import { useParams } from "next/navigation";
import GrantedDataContent from "./GrantedDataContent";

export default function GrantedDataDetails({ slug }: { slug: string }) {
  const { id, model_id, noteId } = useParams<{ id: string; model_id?: string; noteId?: string }>();
  const modelId = (model_id ?? noteId)!;

  return <GrantedDataContent key={id + "/" + modelId} slug={slug} accessId={id} modelId={modelId} />;
}
