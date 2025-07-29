import SimpleButton from "@/components/common/SimpleButton";
import INVITE_USER from "@/graphql/ops/app/people/mutations/INVITE_USER";
import { PersonRef } from "@/types/Will";
import { useMutation } from "@apollo/client";
import { useState } from "react";

export default function InvitationBox({
  inputEmail,
  field,
  response,
  onClose,
}: {
  inputEmail: string;
  field: string | null;
  response: (response: PersonRef) => void;
  onClose: () => void;
}) {
  const [name, setName] = useState("");
  const [inviteUser] = useMutation(INVITE_USER);

  return (
    <div className="flex flex-col gap-2">
      <h2 className="text-xl">Send Invitation</h2>
      <div className="text-sm">
        We will send an invitation email to {inputEmail} to join Cipherwill
      </div>
      <input
        type="text"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
        }}
        placeholder="First name of the person"
        className="bg-white dark:bg-gray-800 text-black dark:text-white border p-1 rounded-sm"
      />
      <SimpleButton
        onClick={() => {
          inviteUser({
            variables: {
              first_name: name,
              email: inputEmail,
            },
            onCompleted(data, clientOptions) {
              if (data && data.inviteUser) {
                response({
                  person: data.inviteUser.id,
                  field,
                });
                onClose();
              }
            },
          });
        }}
      >
        Invite {name || "User"}
      </SimpleButton>
    </div>
  );
}
