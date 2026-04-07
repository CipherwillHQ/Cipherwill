"use client";

import { useApolloClient, useMutation } from "@apollo/client/react";
import { useState } from "react";
import toast from "react-hot-toast";
import logger from "@/common/debug/logger";
import { useSession } from "@/contexts/SessionContext";
import ADD_SMARTWILL_BENEFICIARY from "../../../graphql/ops/app/smartwill/mutations/ADD_SMARTWILL_BENEFICIARY";
import { executeBeneficiaryAutoMigrationPipeline } from "./autoMigration/pipeline";
import { INITIAL_PROGRESS, setAddingProgress } from "./autoMigration/progress";

export type { MigrationProgressState } from "./autoMigration/types";

export default function useBeneficiaryAutoMigration({
  maxPublicKey,
}: {
  maxPublicKey: string;
}) {
  const client = useApolloClient();
  const { session } = useSession();
  const [isAddingBeneficiary, setIsAddingBeneficiary] = useState(false);
  const [migrationProgress, setMigrationProgress] =
    useState<import("./autoMigration/types").MigrationProgressState>(
      INITIAL_PROGRESS
    );

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
    setAddingProgress(setMigrationProgress);

    try {
      await executeBeneficiaryAutoMigrationPipeline({
        personId,
        maxPublicKey,
        sessionPublicKey: session?.publicKey,
        sessionPrivateKey: session?.privateKey ?? null,
        client,
        addBeneficiary,
        setMigrationProgress,
      });
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
