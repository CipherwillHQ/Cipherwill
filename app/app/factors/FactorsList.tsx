"use client";
import { useEffect, useState } from "react";
import {
  useApolloClient,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client/react";
import GET_FACTORS from "../../../graphql/ops/auth/queries/AVAILABLE_AUTH_FACTORS";
import { useSession } from "../../../contexts/SessionContext";
import UPDATE_FACTOR from "../../../graphql/ops/auth/mutations/UPDATE_FACTOR";
import toast from "react-hot-toast";
import { TbEdit } from "react-icons/tb";
import OptionsMenu from "./OptionsMenu";
import remove_factor from "../../../common/factor/remove_factor";
import getShortKey from "../../../factory/publicKey/getShortKey";
import GET_ALL_KEY_COUNT from "../../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";
import { GetFactorsQuery, GetAllKeyCountQuery, UpdateFactorMutation, UpdateFactorVariables } from "../../../types/interfaces";

export default function FactorsList() {
  const { session } = useSession();
  const [isDeleting, setIsDeleting] = useState(false);
  const client = useApolloClient();
  const [maxKeyCount, setMaxKeyCount] = useState({
    publicKey: "null",
    value: 0,
  });
  const { data, loading, error } = useQuery<GetFactorsQuery>(GET_FACTORS);
  const [getKeyCount, { data: count }] = useLazyQuery<GetAllKeyCountQuery>(GET_ALL_KEY_COUNT);

  const [updateFactor] = useMutation<UpdateFactorMutation, UpdateFactorVariables>(UPDATE_FACTOR);

  useEffect(() => {
    getKeyCount().then((result) => {
      if (result.data && result.data.getAllKeyCount.length > 0) {
        let max = 0;
        let publicKey = "null";
        for (let index = 0; index < result.data.getAllKeyCount.length; index++) {
          const element = result.data.getAllKeyCount[index];
          if (element.count > max) {
            max = element.count;
            publicKey = element.publicKey;
          }
        }
        setMaxKeyCount({
          publicKey,
          value: max,
        });
      }
    }).catch((error) => {
      console.error('Failed to get key count:', error);
    });
  }, [getKeyCount]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;
  if (!data) return <div>No data found</div>;

  return (
    <div>
      {data.getFactors.length === 0 && (
        <div className="flex flex-col gap-3 py-4 text-center">
          You have no security factors yet. Add one to get started.
        </div>
      )}

      <div className="flex flex-wrap gap-2">
        {data.getFactors.map((factor) => {
          const data_count =
            count &&
            count.getAllKeyCount
              ? count.getAllKeyCount.find((a) => a.publicKey === factor.publicKey)?.count || 0
              : 0;

          return (
            <div
              key={factor.id}
              data-cy="factor"
              className={`w-full sm:max-w-sm border rounded-md bg-secondary p-2 flex items-start justify-between 
          ${
            factor.publicKey === session.publicKey
              ? "border-green-800"
              : "border-default"
          }
          `}
            >
              <div>
                <div className="flex items-center">
                  <div>
                    Name:{" "}
                    <div
                      id="factor-name"
                      className="inline-block outline-hidden"
                      contentEditable
                      suppressContentEditableWarning
                      onBlur={(e) => {
                        const new_name = e.target.innerText;

                        if (new_name.length === 0) {
                          const nameElem = document.getElementById("factor-name");
                          if (nameElem) {
                            nameElem.innerText = factor.name;
                          }
                        }
                        if (new_name.length > 0 && new_name !== factor.name) {
                          updateFactor({
                            variables: {
                              id: factor.id,
                              name: new_name,
                            },
                          });
                        }
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          e.stopPropagation();
                          document.getElementById("factor-name")?.blur();
                        }
                      }}
                    >
                      {factor.name}
                    </div>
                  </div>
                  <button
                    className="text-xs mx-1 px-1"
                    onClick={() => {
                      // focus on name
                      document.getElementById("factor-name")?.focus();
                    }}
                  >
                    <TbEdit size={16} />
                  </button>
                </div>
                <div>Type: {factor.type}</div>
                <div>Key: {getShortKey(factor.publicKey)}</div>
                <div>
                  Data count:{" "}
                  <span data-cy="factor-key-count">{data_count}</span>
                </div>
                <button
                  data-cy="remove-factor"
                  className="flex items-center border border-red-700 hover:bg-red-200 text-red-500 p-1 rounded-sm px-2 text-sm mt-2"
                  onClick={async () => {
                    const cnf = confirm(
                      "Are you sure you want to remove this factor?"
                    );
                    if (cnf) {
                      setIsDeleting(true);
                      await remove_factor(
                        client,
                        session.publicKey,
                        session.privateKey,
                        factor.id,
                        factor.publicKey
                      );

                      setIsDeleting(false);
                    }
                  }}
                >
                  {isDeleting && (
                    <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-red-700 mr-2" />
                  )}
                  Remove
                </button>
              </div>
              <OptionsMenu
                factor_id={factor.id}
                max_count={maxKeyCount.value}
                max_publicKey={maxKeyCount.publicKey}
                my_count={data_count}
                factor_publicKey={factor.publicKey}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
