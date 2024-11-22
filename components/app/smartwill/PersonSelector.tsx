"use client";

import { useLazyQuery } from "@apollo/client";
import { useEffect, useState } from "react";
import SEARCH_PERSON from "../../../graphql/ops/app/people/queries/SEARCH_PERSON";
import validate_email from "../../../common/validators/validate_email";
import BasicPopup from "../../BasicPopup";
import InvitationBox from "./InvitationBox";

declare type PersonRef = { person: string; field: string };
let timeout: any;

export default function PersonSelector({
  isOpen,
  onClose,
  response,
}: {
  isOpen: string;
  onClose: () => void;
  response: (response: PersonRef) => void;
}) {
  return (
    <BasicPopup
      open={isOpen}
      setOpen={(_e) => {
        onClose();
      }}
    >
      <SeachAndList
        onClose={() => {
          onClose();
        }}
        response={response}
        field={isOpen}
      />
    </BasicPopup>
  );
}

function SeachAndList({
  field,
  onClose,
  response,
}: {
  field: string;
  onClose: () => void;
  response: (response: PersonRef) => void;
}) {
  const [invitationMode, setInvitationMode] = useState<null | string>(null);
  const [inputEmail, setInputEmail] = useState("");
  const [searchUser, { loading, error, data: peoples }] =
    useLazyQuery(SEARCH_PERSON);

  useEffect(() => {
    if (!validate_email(inputEmail)) {
      return;
    }
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      searchUser({
        variables: {
          email: inputEmail,
        },
      });
    }, 500);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputEmail]);

  // if (loading) return <div>Loading...</div>;
  if (error) return <div>Error - {error.message}</div>;
  const valid_email = validate_email(inputEmail);

  if (invitationMode) {
    return (
      <InvitationBox
        inputEmail={inputEmail}
        field={field}
        response={response}
        onClose={onClose}
      />
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between pb-2">
        <div className="text-xl">Select Person</div>
        <button
          onClick={() => {
            onClose();
          }}
        >
          Close
        </button>
      </div>

      <input
        data-cy="search-person-email-input"
        className="w-full border p-1 mb-2 rounded bg-white dark:bg-gray-800"
        placeholder="Search"
        type="email"
        value={inputEmail}
        onChange={(e) => {
          setInputEmail(e.target.value);
        }}
        autoFocus
      />
      {loading && <div className="p-2">Searching...</div>}
      {/* Person List */}
      {!loading && (
        <div
          className="max-h-60 overflow-y-auto overflow-x-hidden"
          data-cy="search-person-list"
        >
          {peoples &&
            valid_email &&
            peoples.searchPerson.map((person) => {
              return (
                <div
                  key={person.id}
                  className="bg-slate-100 dark:bg-gray-800 py-1 px-2 rounded my-2 hover:bg-slate-200 cursor-pointer"
                  onClick={() => {
                    response({
                      person: person.id,
                      field,
                    });
                    onClose();
                  }}
                >
                  <h2 data-cy="person-name">{person.first_name}</h2>
                  <div data-cy="person-email" className="text-sm">
                    {person.email}
                  </div>
                </div>
              );
            })}

          {valid_email && (!peoples || peoples.searchPerson.length === 0) && (
            <div
              className="bg-slate-100 dark:bg-gray-800 py-1 px-2 rounded my-2 hover:bg-slate-200 cursor-pointer"
              onClick={() => {
                setInvitationMode(inputEmail);
              }}
            >
              <div>Invite user</div>
              <div>{inputEmail}</div>
            </div>
          )}

          {!validate_email(inputEmail) && (
            <div>Enter email address of the user</div>
          )}
        </div>
      )}
    </div>
  );
}
