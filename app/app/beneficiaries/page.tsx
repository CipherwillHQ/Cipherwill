"use client";
import { useEffect, useState } from "react";
import { useLazyQuery, useMutation } from "@apollo/client";
import ADD_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/mutations/ADD_SMARTWILL_BENEFICIARY";
import BeneficiaryList from "../../../components/app/smartwill/BeneficiaryList";
import PersonSelector from "../../../components/app/smartwill/PersonSelector";
import toast from "react-hot-toast";
import GET_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import IncompleteProfile from "./IncompleProfile";
import GET_BENEFICIARY_KEY_COUNT from "../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";
import GET_MY_KEY_COUNT from "../../../graphql/ops/app/key/Queries/GET_MY_KEY_COUNT";
import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";
import { useUserContext } from "@/contexts/UserSetupContext";

export default function Smartwill() {
  const [personSelectionDialogOpen, setPersonSelectionDialogOpen] = useState<
    string | null
  >(null);
  
  const {user,loading:user_loading} = useUserContext();
  const [max_publicKey, set_max_publicKey] = useState("null");
  const [max_key_count, set_max_key_count] = useState(0);

  const [getKeyCount] = useLazyQuery(GET_MY_KEY_COUNT, {
    onCompleted: async (data) => {
      if (data && data.getMyKeyCount) {
        let maxCount = 0;
        let maxPublicKey = "";
        for await (const c of data.getMyKeyCount) {
          if (c.count > maxCount) {
            maxCount = c.count;
            maxPublicKey = c.publicKey;
          }
        }
        set_max_key_count(maxCount);
        set_max_publicKey(maxPublicKey);
      }
    },
  });
  useEffect(() => {
    getKeyCount();
  }, [getKeyCount]);

  const [addBeneficiary] = useMutation(ADD_SMARTWILL_BENEFICIARY);

  if (user_loading) return <div>Loading...</div>;
  if (user.birth_date === "0") return <IncompleteProfile />;

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Beneficiaries">
        <SimpleButton
          onClick={() => {
            setPersonSelectionDialogOpen("beneficiary");
          }}
        >
          Add a person
        </SimpleButton>
      </DesktopAndMobilePageHeader>

      <div className="p-4">
        <div className="text-sm font-medium mb-4 max-w-2xl">
          Beneficiaries will receive access to your data after the will is
          executed. They will receive notification and a special dashboard to
          decrypt and access data that you've encrypted for them to access
        </div>
        <BeneficiaryList
          max_key_count={max_key_count}
          max_publicKey={max_publicKey}
        />
      </div>
      <PersonSelector
        isOpen={personSelectionDialogOpen}
        onClose={() => {
          setPersonSelectionDialogOpen(null);
        }}
        response={(e) => {
          if (e.field === "beneficiary") {
            if (e.person) {
              addBeneficiary({
                variables: {
                  id: e.person,
                },
                onCompleted: () => {
                  toast.success("Beneficiary Added");
                },
                refetchQueries: [
                  {
                    query: GET_SMARTWILL_BENEFICIARY,
                  },
                  {
                    query: GET_BENEFICIARY_KEY_COUNT,
                  },
                ],
              });
            }
          }

          if (e.field === "friend") {
            if (e.person) {
              logger.error("Unimplemented logic");
            }
          }
        }}
      />
    </div>
  );
}
