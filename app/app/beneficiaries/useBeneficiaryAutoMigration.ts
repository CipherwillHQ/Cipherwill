"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { useState } from "react";
import toast from "react-hot-toast";
import logger from "@/common/debug/logger";
import { useSession } from "@/contexts/SessionContext";
import perform_migrate_in from "@/common/factor/perform_migrate_in";
import ADD_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/mutations/ADD_SMARTWILL_BENEFICIARY";
import GET_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/queries/GET_SMARTWILL_BENEFICIARY";
import GET_BENEFICIARY_KEY_COUNT from "../../../graphql/ops/auth/queries/GET_BENEFICIARY_KEY_COUNT";

export type MigrationProgressState = {
  open: boolean;
  status: "running" | "success" | "failed";
  title: string;
  description: string;
};

const INITIAL_PROGRESS: MigrationProgressState = {
  open: false,
  status: "running",
  title: "",
  description: "",
};

export default function useBeneficiaryAutoMigration({
  maxPublicKey,
}: {
  maxPublicKey: string;
}) {
  const client = useApolloClient();
  const { session } = useSession();
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [migrationProgress, setMigrationProgress] =
    useState<MigrationProgressState>(INITIAL_PROGRESS);

  const [addBeneficiary] = useMutation(ADD_SMARTWILL_BENEFICIARY);

  const closeMigrationProgress = () => {
    if (migrationProgress.status === "running") return;
    setMigrationProgress((prev) => ({
      ...prev,
      open: false,
    }));
  };

  const addAndMigrateBeneficiary = async (personId: string) => {
    if (isAddingBeneficiary) return;
    setIsAddingBeneficiary(true);
    setMigrationProgress({
      open: true,
      status: "running",
      title: "Adding beneficiary",
      description: "Creating beneficiary record and preparing migration...",
    });

    try {
      const beforeResult = await client.query({
        query: GET_SMARTWILL_BENEFICIARY,
        fetchPolicy: "network-only",
      });
      const beforeList =
        ((beforeResult.data as any)?.getSmartWillBeneficiaries as any[]) || [];
      const existingBeneficiaryIds = new Set(
        beforeList
          .filter((x: any) => x.person_id === personId)
          .map((x: any) => x.id)
      );

      await addBeneficiary({
        variables: {
          id: personId,
        },
        refetchQueries: [
          {
            query: GET_SMARTWILL_BENEFICIARY,
          },
          {
            query: GET_BENEFICIARY_KEY_COUNT,
          },
        ],
        awaitRefetchQueries: true,
      });
      toast.success("Beneficiary Added");

      setMigrationProgress({
        open: true,
        status: "running",
        title: "Migrating data",
        description: "Please wait while data is synced for this beneficiary.",
      });

      const afterResult = await client.query({
        query: GET_SMARTWILL_BENEFICIARY,
        fetchPolicy: "network-only",
      });
      const afterList =
        ((afterResult.data as any)?.getSmartWillBeneficiaries as any[]) || [];
      const addedBeneficiary =
        afterList.find(
          (x: any) =>
            x.person_id === personId && !existingBeneficiaryIds.has(x.id)
        ) || afterList.find((x: any) => x.person_id === personId);

      if (!addedBeneficiary) {
        setMigrationProgress({
          open: true,
          status: "failed",
          title: "Migration not started",
          description:
            "Beneficiary was added, but auto-migration could not start. Please use Click to Migrate.",
        });
        toast.error(
          "Beneficiary was added, but could not auto-start migration. Use Click to Migrate."
        );
        return;
      }

      if (maxPublicKey !== "null" && session?.publicKey !== maxPublicKey) {
        setMigrationProgress({
          open: true,
          status: "failed",
          title: "Migration needs a different key",
          description:
            "Beneficiary is added, but auto-migration needs your active session on the latest factor key.",
        });
        toast.error(
          "Beneficiary added. Switch session to key " +
            maxPublicKey.slice(-8) +
            " and click migrate."
        );
        return;
      }

      toast.success(
        `Migration Started from -> ${
          maxPublicKey === "null" ? "Unencrypted vault" : maxPublicKey
        }`
      );
      await perform_migrate_in(
        maxPublicKey,
        client,
        "dosent-matter-its-a-beneficiary-id-migration",
        session ? session.privateKey : null,
        addedBeneficiary.id
      );

      await client.query({
        query: GET_BENEFICIARY_KEY_COUNT,
        fetchPolicy: "network-only",
      });

      toast.success(
        `Migration Completed from -> ${
          maxPublicKey === "null" ? "Unencrypted vault" : maxPublicKey
        }`
      );
      setMigrationProgress({
        open: true,
        status: "success",
        title: "Migration completed",
        description: "Beneficiary is now in sync.",
      });
      setTimeout(() => {
        setMigrationProgress((prev) => ({
          ...prev,
          open: false,
        }));
      }, 1000);
    } catch (error) {
      logger.error("Failed to add or auto-migrate beneficiary", error);
      setMigrationProgress({
        open: true,
        status: "failed",
        title: "Migration failed",
        description:
          "Beneficiary was added, but migration failed. You can retry from the beneficiary list.",
      });
      toast.error(
        "Beneficiary add/migration failed. You can retry from the beneficiary list."
      );
    } finally {
      setIsAddingBeneficiary(false);
    }
  };

  return {
    isAddingBeneficiary,
    migrationProgress,
    closeMigrationProgress,
    addAndMigrateBeneficiary,
  };
}
