// Loads incoming and granted will access independently of the account overview.
// Owns permission refreshes and guarded revocation with retryable failures.
// Does not grant access, resolve names, or expose protected will contents.
import { useCallback, useRef, useState } from "react";
import { useMutation, useQuery } from "@apollo/client/react";
import type { GetAllBeneficiaryAccessQuery, GetAllGrantedBeneficiariesQuery, RevokeWillAccessData, RevokeWillAccessVariables } from "@/types/interfaces";
import GET_ALL_BENEFICIARY_ACCESS from "@/graphql/ops/app/executor/access/queries/GET_ALL_BENEFICIARY_ACCESS";
import GET_ALL_GRANTED_BENEFICIARIES from "@/graphql/ops/app/executor/access/queries/GET_ALL_GRANTED_BENEFICIARIES";
import REVOKE_ACCESS_TO_MY_WILL from "@/graphql/ops/app/executor/access/mutations/REVOKE_ACCESS_TO_MY_WILL";
import toast from "react-hot-toast";

export default function useGuidanceAccess() {
  const shared = useQuery<GetAllBeneficiaryAccessQuery>(GET_ALL_BENEFICIARY_ACCESS, { fetchPolicy: "no-cache" });
  const granted = useQuery<GetAllGrantedBeneficiariesQuery>(GET_ALL_GRANTED_BENEFICIARIES, { fetchPolicy: "no-cache" });
  const [revoke] = useMutation<RevokeWillAccessData, RevokeWillAccessVariables>(REVOKE_ACCESS_TO_MY_WILL);
  const [revokingId, setRevokingId] = useState<string | null>(null);
  const [revokeError, setRevokeError] = useState<string | null>(null);
  const processing = useRef(false);
  const refreshGranted = granted.refetch;
  const onRevoke = useCallback(async (id: string) => {
    if (processing.current) return;
    processing.current = true;
    setRevokingId(id);
    setRevokeError(null);
    try {
      const result = await revoke({ variables: { id } });
      if (result.data?.revokeAccessToMyWill !== true) throw new Error("Revocation was not confirmed");
      toast.success("Access revoked successfully");
      try { await refreshGranted(); }
      catch { setRevokeError("Access was revoked, but the list could not refresh. Please retry."); }
    } catch {
      setRevokeError("Unable to revoke access. Please try again.");
    } finally {
      processing.current = false;
      setRevokingId(null);
    }
  }, [revoke, refreshGranted]);
  return { shared, granted, onRevoke, revokingId, revokeError };
}
