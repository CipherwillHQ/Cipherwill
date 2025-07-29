"use client";
import { useMutation, useQuery } from "@apollo/client";
import toast from "react-hot-toast";
import { BiEditAlt } from "react-icons/bi";
import GET_METAMODEL from "../../../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import UPDATE_METAMODEL from "../../../../../graphql/ops/app/metamodel/mutations/UPDATE_METAMODEL";
import getTimeAgo from "../../../../../common/time/getTimeAgo";
import ShareMetapod from "@/components/app/data/ShareMetapod";

export default function MetaDetails({ id }) {
  const { data, loading, error, refetch } = useQuery(GET_METAMODEL, {
    variables: {
      id,
    },
    onError(error) {
      if (
        error &&
        error.graphQLErrors &&
        error.graphQLErrors[0] &&
        error.graphQLErrors[0].extensions?.code === "MODEL_NOT_FOUND"
      ) {
        window.location.href = "/app/data/defi-staking";
      }
    },
  });

  const [update_metamodel] = useMutation(UPDATE_METAMODEL, {
    onCompleted: () => {
      refetch();
    },
  });
  if (loading) return <div>Loading...</div>;
  if (error) return <div>{JSON.stringify(error)}</div>;
  const parsedData = JSON.parse(data.getMetamodel.metadata);

  return (
    <div className="flex flex-col sm:flex-row items-center gap-2 justify-between py-2">
      <div className="flex gap-2 items-center">
        <div
          id="stacking-account-name"
          className="text-xl outline-hidden"
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const new_name = e.target.innerText;
            if (new_name.length === 0) {
              const nameElem = document.getElementById("stacking-account-name");
              if (nameElem) {
                nameElem.innerText = parsedData.name;
              }
            }
            if (new_name.length > 0 && new_name !== parsedData.name) {
              update_metamodel({
                variables: {
                  data: {
                    id,
                    metadata: JSON.stringify({
                      ...parsedData,
                      name: new_name,
                    }),
                  },
                },
              });
            }
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
              document.getElementById("stacking-account-name")?.blur();
            }
          }}
        >
          {parsedData.name}
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => {
            document.getElementById("stacking-account-name")?.focus();
          }}
        >
          Rename
        </button>
        <ShareMetapod />
        <div className="text-xs">
          Created at: {getTimeAgo(parseInt(data.getMetamodel.created_at))}
          <br />
          Updated at: {getTimeAgo(parseInt(data.getMetamodel.updated_at))}
        </div>
      </div>
    </div>
  );
}
