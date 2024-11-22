"use client";
import { useMutation } from "@apollo/client";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";
import Popup from "reactjs-popup";
import toast from "react-hot-toast";
import { useCallback } from "react";

export default function CreateNote() {
  const [createNote] = useMutation(CREATE_METAMODEL, {
    refetchQueries: [
      {
        query: GET_METAMODELS,
        variables: {
          type: "NOTE",
        },
      },
    ],
  });

  const addNote = useCallback((close: () => void) => {
    let title = (document.getElementById("note-title") as any).value;
    title = title.trim();
    if (title && title.length > 0) {
      // create bank account
      createNote({
        variables: {
          type: "NOTE",
          metadata: JSON.stringify({ title }),
        },
      });
      close();
    } else {
      toast.error("Please enter a valid title");
    }
  }, []);
  return (
    <Popup
      trigger={
        <div>
          <SimpleButton>Add Note</SimpleButton>
        </div>
      }
      modal
    >
      {/* @ts-ignore */}
      {(close) => {
        return (
          <div className="bg-white dark:bg-neutral-700 p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold text-black dark:text-white">
              Create Note
            </h2>
            <input
              id="note-title"
              type="text"
              placeholder="Title"
              autoComplete="off"
              className="w-full my-2 p-2 border border-default bg-secondary text-black dark:text-white"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault();
                  addNote(close);
                }
              }}
            />
            <button
              className="w-full bg-accent-500 text-white p-2 rounded"
              onClick={() => addNote(close)}
            >
              Create
            </button>
          </div>
        );
      }}
    </Popup>
  );
}
