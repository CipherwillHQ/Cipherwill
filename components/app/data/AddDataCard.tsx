// AddDataCard
// What it does: Inline "add" CTA for data segment grids. Two variants: "grid" (dashed-border card) and "empty" (solid button).
// What it owns: The CREATE_METAMODEL mutation call, navigation to the new detail page, and both card/button presentations.
// What it does NOT do: Does not handle pod creation, detail editing, or any segment-specific logic.

"use client";
import { useMutation } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import CREATE_METAMODEL from "@/graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import GET_METAMODELS from "@/graphql/ops/app/metamodel/queries/GET_METAMODELS";
import { CreateMetamodelMutation, CreateMetamodelVariables } from "@/types/interfaces";
import { stringifyMetamodelMetadata } from "@/common/metamodel/utils";
import { TbPlus } from "react-icons/tb";

const variants = {
  empty:
    "border-2 border-clay text-clay rounded-full px-6 py-3 font-medium text-sm hover:bg-clay/10",
  grid:
    "border-2 border-dashed border-clay/60 dark:border-clay/30 rounded-2xl p-4 hover:border-clay dark:hover:border-clay/60 hover:bg-clay/10 text-clay dark:text-clay/80 min-h-[88px]",
} as const;

export default function AddDataCard({
  type,
  defaultName,
  label,
  basePath,
  variant = "grid",
}: {
  type: string;
  defaultName: string;
  label: string;
  basePath: string;
  variant?: "empty" | "grid";
}) {
  const router = useRouter();
  const [create] = useMutation<CreateMetamodelMutation, CreateMetamodelVariables>(
    CREATE_METAMODEL,
    {
      refetchQueries: [{ query: GET_METAMODELS, variables: { type } }],
    }
  );

  const handleClick = async () => {
    try {
      const res = await create({
        variables: {
          type,
          metadata: stringifyMetamodelMetadata({ name: defaultName }),
        },
      });
      const newId = res?.data?.createMetamodel?.id;
      if (newId) {
        router.push(`${basePath}/${newId}`);
      }
    } catch {
      // mutation handles its own error display
    }
  };

  return (
    <button
      onClick={handleClick}
      className={`${variants[variant]} transition-colors flex items-center justify-center gap-2 cursor-pointer`}
    >
      <TbPlus size={18} strokeWidth={2} />
      {label}
    </button>
  );
}
