"use client";
/**
 * app/app/data/notes/CreateNote.tsx
 * Instantly creates a new note titled "New note" and navigates to it, skipping any popup modal.
 */
import { useMutation } from "@apollo/client/react";
import CREATE_METAMODEL from "../../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "../../../../graphql/ops/app/metamodel/queries/GET_METAMODELS";
import SimpleButton from "@/components/common/SimpleButton";
import toast from "react-hot-toast";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { CreateMetamodelMutation, CreateMetamodelVariables, GetMetamodelsVariables } from "../../../../types/interfaces";
import { stringifyMetamodelMetadata } from "../../../../common/metamodel/utils";

export default function CreateNote() {
  const router = useRouter();
  const [createNote, { loading }] = useMutation<CreateMetamodelMutation, CreateMetamodelVariables>(
    CREATE_METAMODEL,
    {
      refetchQueries: [
        {
          query: GET_METAMODELS,
          variables: {
            type: "NOTE",
          } as GetMetamodelsVariables,
        },
      ],
    }
  );

  const handleCreate = useCallback(async () => {
    try {
      const res = await createNote({
        variables: {
          type: "NOTE",
          metadata: stringifyMetamodelMetadata({ title: "New note" }),
        },
      });
      const newId = res?.data?.createMetamodel?.id;
      if (newId) {
        router.push(`/app/data/notes/${newId}`);
      }
    } catch (err) {
      toast.error("Failed to create note");
    }
  }, [createNote, router]);

  return (
    <SimpleButton onClick={handleCreate} disabled={loading} className="shadow-xs min-w-[100px]">
      {loading ? (
        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
      ) : (
        "Add Note"
      )}
    </SimpleButton>
  );
}
