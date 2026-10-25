// Resolves names for one expanded list of shared or granted will permissions.
// Owns bounded scrolling, name-query retry, and inline revoke feedback.
// Does not load will contents or decide permission validity from deadlines.
import { useQuery } from "@apollo/client/react";
import type { GetPersonByIdsData, GetPersonByIdsVariables, GuidanceAccessListProps } from "@/types/interfaces";
import GET_PERSON_BY_IDS from "@/graphql/ops/app/people/queries/GET_PERSON_BY_IDS";
import AccessRow from "./AccessRow";

export default function AccessList(props: GuidanceAccessListProps) {
  const { data, loading, error, refetch } = useQuery<GetPersonByIdsData, GetPersonByIdsVariables>(GET_PERSON_BY_IDS,
    { variables: { list: Array.from(new Set(props.access.map(access => access.user))) } });
  return <section aria-label={props.kind === "shared" ? "Shared wills" : "Granted access"}
    className="cw-private-guidance ph-no-capture sentry-block min-h-0 pt-2 text-left text-black dark:text-white">
    {loading ? <p role="status" className="px-3 py-4 text-black/60 dark:text-white/60">Loading names…</p>
      : error || !data ? <div className="px-3 py-3"><p role="alert">Unable to load names.</p>
        <button type="button" onClick={() => void refetch().catch(() => {})} className="min-h-11 cursor-pointer text-primary dark:text-primary-200">Try again</button>
      </div> : <ul aria-label={props.kind === "shared" ? "Wills shared with you" : "People with access to your data"}
        className="max-h-64 min-h-0 overflow-y-auto overscroll-contain customScrollbar">
        {props.access.map(access => <AccessRow key={access.id} {...props} access={access}
          person={data.getPersonByIds.find(person => person.id === access.user)} />)}
      </ul>}
    {props.kind === "granted" && props.revokeError && <p role="alert" className="px-3 py-3 text-error dark:text-red-300">{props.revokeError}</p>}
  </section>;
}
