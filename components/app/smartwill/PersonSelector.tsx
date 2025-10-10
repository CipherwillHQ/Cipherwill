"use client";

import { useLazyQuery } from "@apollo/client/react";
import { useEffect, useState } from "react";
import { FiSearch, FiUser, FiMail, FiX, FiUserPlus } from "react-icons/fi";
import SEARCH_PERSON from "../../../graphql/ops/app/people/queries/SEARCH_PERSON";
import validate_email from "../../../common/validators/validate_email";
import BasicPopup from "../../BasicPopup";
import InvitationBox from "./InvitationBox";
import { PersonRef } from "@/types/Will";
import { SearchPersonData, SearchPersonVariables } from "../../../types/interfaces/people";
import LoadingIndicator from "../../common/LoadingIndicator";

let timeout: any;

export default function PersonSelector({
  isOpen,
  onClose,
  response,
}: {
  isOpen: string | null;
  onClose: () => void;
  response: (response: PersonRef) => void;
}) {
  return (
    <BasicPopup
    popup_className="p-0 m-0 max-w-xl"
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
  field: string | null;
  onClose: () => void;
  response: (response: PersonRef) => void;
}) {
  const [invitationMode, setInvitationMode] = useState<null | string>(null);
  const [inputEmail, setInputEmail] = useState("");
  const [searchUser, { loading, error, data: peoples }] =
    useLazyQuery<SearchPersonData, SearchPersonVariables>(SEARCH_PERSON);

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

  if (error) {
    return (
      <div className="p-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
        <div className="flex items-center gap-3">
          <FiX className="text-red-500" size={20} />
          <div>
            <h3 className="text-red-800 dark:text-red-200 font-medium">Search Error</h3>
            <p className="text-red-600 dark:text-red-300 text-sm">{error.message}</p>
          </div>
        </div>
      </div>
    );
  }

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
    <div className="bg-white dark:bg-gray-900 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 w-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-3">
          <FiUser className="text-blue-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Select Person</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
          aria-label="Close"
        >
          <FiX size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Search Input */}
      <div className="p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input
            data-cy="search-person-email-input"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            placeholder="Search by email address..."
            type="email"
            value={inputEmail}
            onChange={(e) => {
              setInputEmail(e.target.value);
            }}
            autoFocus
          />
        </div>
      </div>

      {/* Content */}
      <div className="px-4 pb-4">
        {loading && (
          <div className="flex items-center justify-center py-8">
            <LoadingIndicator />
            <span className="ml-2 text-gray-600 dark:text-gray-400">Searching...</span>
          </div>
        )}

        {/* Person List */}
        {!loading && valid_email && peoples && peoples.searchPerson.length > 0 && (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {peoples.searchPerson.map((person) => (
              <div
                key={person.id}
                className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg cursor-pointer transition-colors border border-gray-200 dark:border-gray-600"
                onClick={() => {
                  response({
                    person: person.id,
                    field,
                  });
                  onClose();
                }}
                data-cy="person-item"
              >
                <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                  <FiUser className="text-blue-600 dark:text-blue-400" size={18} />
                </div>
                <div className="flex-1">
                  <h3 data-cy="person-name" className="font-medium text-gray-900 dark:text-white">
                    {person.first_name}
                  </h3>
                  <p data-cy="person-email" className="text-sm text-gray-600 dark:text-gray-400">
                    {person.email}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invite Option */}
        {valid_email && (!peoples || peoples.searchPerson.length === 0) && !loading && (
          <div
            className="flex items-center gap-3 p-3 bg-green-50 dark:bg-green-900/20 hover:bg-green-100 dark:hover:bg-green-900/30 rounded-lg cursor-pointer transition-colors border border-green-200 dark:border-green-800"
            onClick={() => {
              setInvitationMode(inputEmail);
            }}
            data-cy="invite-user-option"
          >
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
              <FiUserPlus className="text-green-600 dark:text-green-400" size={18} />
            </div>
            <div className="flex-1">
              <h3 className="font-medium text-green-800 dark:text-green-200">Invite User</h3>
              <p className="text-sm text-green-600 dark:text-green-300">{inputEmail}</p>
            </div>
          </div>
        )}

        {/* Helper Text */}
        {!valid_email && inputEmail.length > 0 && (
          <div className="flex items-center gap-2 p-3 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
            <FiMail className="text-yellow-500" size={18} />
            <p className="text-sm text-yellow-700 dark:text-yellow-300">
              Please enter a valid email address
            </p>
          </div>
        )}

        {!inputEmail && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
            <FiSearch className="text-blue-500" size={18} />
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Start typing an email address to search for users
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
