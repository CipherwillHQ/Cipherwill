// Renders the shared defi staking category.
// Owns routing into the executor's common read-only list.
// Does not decrypt contents or manage permissions.

import GrantedDataList from "@/components/executor/GrantedDataList";

export default function GrantedDefiStaking() {
  return <GrantedDataList slug="defi-staking" />;
}
