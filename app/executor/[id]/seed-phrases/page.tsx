// Renders the shared seed phrases category.
// Owns routing into the executor's common read-only list.
// Does not decrypt contents or manage permissions.

import GrantedDataList from "@/components/executor/GrantedDataList";

export default function GrantedSeedPhrases() {
  return <GrantedDataList slug="seed-phrases" />;
}
