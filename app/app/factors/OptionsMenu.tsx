import { useApolloClient, useMutation } from "@apollo/client";
import { useSession } from "../../../contexts/SessionContext";
import toast from "react-hot-toast";
import { useState } from "react";
import DELETE_FACTOR from "../../../graphql/ops/auth/mutations/DELETE_FACTOR";
import { BsThreeDotsVertical } from "react-icons/bs";
import perform_migrate_out from "../../../common/factor/perform_migrate_out";
import perform_migrate_in from "../../../common/factor/perform_migrate_in";
import remove_factor from "../../../common/factor/remove_factor";
import DELETE_KEY_BY_PUBLIC_KEY from "../../../graphql/ops/app/key/Mutations/DELETE_KEY_BY_PUBLIC_KEY";
import GET_ALL_KEY_COUNT from "../../../graphql/ops/app/key/Queries/GET_ALL_KEY_COUNT";
import Popup from "reactjs-popup";
import getShortKey from "@/factory/publicKey/getShortKey";

export default function OptionsMenu({
  factor_id,
  max_count,
  max_publicKey,
  my_count,
  factor_publicKey,
}) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isMigrating, setIsMigrating] = useState(false);
  const client = useApolloClient();
  const { session } = useSession();
  const [deleteFactor] = useMutation(DELETE_FACTOR, {
    onCompleted(data, clientOptions) {
      window.location.reload();
    },
  });
  return (
    <Popup
      trigger={
        <div className="flex items-center">
          <BsThreeDotsVertical
            className="cursor-pointer"
            size={20}
          />
        </div>
      }
      modal
    >
      <div className="bg-white dark:bg-neutral-800 text-black dark:text-white rounded-sm w-screen max-w-sm p-2">
        <h2 className="text-sm font-semibold mb-2">
          Factor : {getShortKey(factor_publicKey)}
        </h2>
        <button
          className="flex items-center border-t p-1 hover:opacity-80 w-full"
          onClick={async () => {
            const cnf = confirm("Are you sure you want to remove this factor?");
            if (cnf) {
              setIsDeleting(true);
              await remove_factor(
                client,
                session.publicKey,
                session.privateKey,
                factor_id,
                factor_publicKey
              );

              setIsDeleting(false);
            }
          }}
        >
          {isDeleting && (
            <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-red-500 mr-2" />
          )}
          Remove
        </button>

        {/* Can delete factor if no data items */}

        <button
          className="flex items-center border-t p-1 hover:opacity-80 w-full"
          onClick={() => {
            const cnf = confirm("Are you sure you want to Delete this factor?");
            if (cnf) {
              deleteFactor({
                variables: {
                  id: factor_id,
                },
              });
            }
          }}
        >
          Delete Factor
        </button>

        {/* Needs migrations if someone has more data points */}
        {max_count > my_count && (
          <button
            className="flex items-center border-t p-1 hover:opacity-80 w-full"
            onClick={async () => {
              const cnf = confirm(
                "Are you sure you want to migrate in this factor?"
              );
              if (!cnf) return;
              if (isMigrating) return;

              if (
                max_publicKey !== "null" &&
                session.publicKey !== max_publicKey
              ) {
                toast.error(
                  "You need to login session with key " +
                    max_publicKey.slice(-8)
                );
                return;
              }
              setIsMigrating(true);
              if (
                max_publicKey === "null" ||
                max_publicKey === session.publicKey
              ) {
                toast.success(
                  `Migration Started from -> ${
                    max_publicKey === "null"
                      ? "Unencrypted vault"
                      : max_publicKey
                  }`
                );
                await perform_migrate_in(
                  max_publicKey,
                  client,
                  factor_publicKey,
                  session ? session.privateKey : null
                );
                // refetch query
                await client.query({
                  query: GET_ALL_KEY_COUNT,
                  fetchPolicy: "network-only",
                });
                setIsMigrating(false);
                toast.success(
                  `Migration Completed from -> ${
                    max_publicKey === "null"
                      ? "Unencrypted vault"
                      : max_publicKey
                  }`
                );
              } else {
                toast.error(
                  `You need to login with factor key: ${max_publicKey}`
                );
                setIsMigrating(false);
              }
            }}
          >
            {isMigrating && (
              <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
            )}
            Migrate In
          </button>
        )}

        {my_count > 0 && session.publicKey === factor_publicKey && (
          <button
            className="flex items-center border-t p-1 hover:opacity-80 w-full"
            onClick={async () => {
              const cnf = confirm(
                "Are you sure you want to delete all data in this factor?"
              );
              if (!cnf) return;
              if (isMigrating) return;
              // delete by public key
              await client.mutate({
                mutation: DELETE_KEY_BY_PUBLIC_KEY,
                variables: {
                  publicKey: factor_publicKey,
                },
                refetchQueries: [
                  {
                    query: GET_ALL_KEY_COUNT,
                  },
                ],
              });
              toast.success(
                `Delete all data for ${factor_publicKey.slice(-8)}`
              );
            }}
          >
            Delete data
          </button>
        )}
        {/* Can migrate out if more than 0 data points */}
        {my_count > 0 && session.publicKey === factor_publicKey && (
          <button
            className="flex items-center border-t p-1 hover:opacity-80 w-full"
            onClick={async () => {
              const cnf = confirm(
                "Are you sure you want to migrate out this factor?"
              );
              if (!cnf) return;
              if (isMigrating) return;
              if (session.publicKey !== factor_publicKey) {
                toast.error(
                  "You need to login session with key " +
                    factor_publicKey.slice(-8)
                );
                return;
              }
              setIsMigrating(true);
              await perform_migrate_out(
                client,
                factor_publicKey,
                session.privateKey
              );
              setIsMigrating(false);
              window.location.reload();
            }}
          >
            {isMigrating && (
              <div className="w-4 h-4 border-2 border-dashed rounded-full animate-spin border-blue-500 mr-2" />
            )}
            Migrate Out
          </button>
        )}
      </div>
    </Popup>
  );
}
