// Renders the shared notes category.
// Owns routing into the executor's common read-only list.
// Does not decrypt contents or manage permissions.

import GrantedDataList from "@/components/executor/GrantedDataList";

export default function GrantedNotes() {
  return <GrantedDataList slug="notes" />;
}
