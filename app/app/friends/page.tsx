"use client";

import { useState } from "react";
import { useMutation } from "@apollo/client";
import ADD_SMARTWILL_FRIEND from "../../../graphql/ops/app/smartwill/mutations/ADD_SMARTWILL_FRIEND";
import FriendList from "../../../components/app/smartwill/FriendList";
import PersonSelector from "../../../components/app/smartwill/PersonSelector";
import toast from "react-hot-toast";
import GET_SMARTWILL_FRIENDS from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_FRIENDS";
import MobilePageHeader from "@/components/mobile/MobilePageHeader";
import logger from "@/common/debug/logger";
import SimpleButton from "@/components/common/SimpleButton";
import DesktopAndMobilePageHeader from "@/components/app/common/page/DesktopAndMobilePageHeader";

export default function FriendsFamily() {
  const [personSelectionDialogOpen, setPersonSelectionDialogOpen] = useState<
    string | null
  >(null);

  const [addFriend] = useMutation(ADD_SMARTWILL_FRIEND);

  return (
    <div className="w-full">
      <DesktopAndMobilePageHeader title="Friends & Family">
        <SimpleButton
          onClick={() => {
            setPersonSelectionDialogOpen("friend");
          }}
        >
          Add a Friend
        </SimpleButton>
      </DesktopAndMobilePageHeader>

      <div className="p-4">
        <div className="text-sm font-medium mb-4 max-w-2xl">
          Friends{" "}
          <span className="font-semibold text-orange-700">
            do not get access to your data.
          </span>{" "}
          They will helps us to get in contact with beneficiaries if they
          don&apos;t respond to your notification to decrypt and access your
          data after will execution
        </div>
        <FriendList />
      </div>
      <PersonSelector
        isOpen={personSelectionDialogOpen}
        onClose={() => {
          setPersonSelectionDialogOpen(null);
        }}
        response={(e) => {
          if (e.field === "beneficiary") {
            if (e.person) {
              logger.error("Unimplemented logic");
            }
          }

          if (e.field === "friend") {
            if (e.person) {
              addFriend({
                variables: {
                  id: e.person,
                },
                onCompleted: () => {
                  toast.success("Friend Added");
                },
                refetchQueries: [
                  {
                    query: GET_SMARTWILL_FRIENDS,
                  },
                ],
              });
            }
          }
        }}
      />
    </div>
  );
}
