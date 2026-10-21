// Renders a shared defi staking item.
// Owns integration with the executor's read-only detail view.
// Does not decrypt contents or manage permissions.

import GrantedDataDetails from "@/components/executor/GrantedDataDetails";

export default function ExecutorDefiStakingView() {
  return <GrantedDataDetails slug="defi-staking" />;
}
