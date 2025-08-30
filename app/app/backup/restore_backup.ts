import toast from "react-hot-toast";
import { sleep } from "../../../common/time/sleep";
import JSZip from "jszip";
import { ApolloClient } from "@apollo/client";
import GET_METAMODEL from "../../../graphql/ops/app/metamodel/queries/GET_METAMODEL";
import CREATE_METAMODEL from "../../../graphql/ops/app/metamodel/mutations/CREATE_METAMODEL";
import logger from "../../../common/debug/logger";
import upload_pod_data from "@/common/data/upload_pod_data";

export default async function restore_backup({
  backupFile,
  setStatus,
  client,
  session,
}: {
  backupFile: File | null;
  setStatus: (status: string) => void;
  client: ApolloClient;
  session: any;
}) {
  const zip = backupFile;
  if (!zip) {
    toast.error("No file selected");
    return;
  }
  if (
    zip.type !== "application/x-zip-compressed" &&
    zip.type !== "application/zip"
  ) {
    toast.error("Invalid file type");
    return;
  }
  setStatus("Reading backup file");
  await sleep(1000);
  if (zip) {
    JSZip.loadAsync(await zip.arrayBuffer()).then(async function (e) {
      const backup_file = e.files["backup.json"];
      if (!backup_file) {
        toast.error("Invalid backup file");
        return;
      }
      let backup_data: any = {};
      try {
        backup_data = JSON.parse(await backup_file.async("string"));
      } catch (error) {
        toast.error("Error while reading backup file");
        return;
      }
      if (backup_data.type !== "CIPHERWILL_BACKUP") {
        toast.error("Invalid backup file type");
        return;
      }
      setStatus("Checking backup version");
      await sleep(1000);
      toast.success("Backup file loaded");
      switch (backup_data.version) {
        case "0.0.1":
          await run_restore_0_0_1({
            backup_data,
            setStatus,
            client,
            session,
          });
          break;
        case "0.0.2":
          await run_restore_0_0_2({
            backup_data,
            setStatus,
            client,
            session,
          });
          break;

        default:
          toast.error("Invalid backup file version");
          break;
      }
    });
  }
}
async function run_restore_0_0_1({
  backup_data,
  setStatus,
  client,
  session,
}: {
  backup_data: any;
  setStatus: (status: string) => void;
  client: ApolloClient;
  session: any;
}) {
  logger.info(`Restoring backup file version 0.0.1`);
  const total_count = backup_data.data.length;
  let current_count = 0;
  for await (const item of backup_data.data) {
    current_count++;
    setStatus(
      `Restoring (${current_count}/${total_count}) | Time remaining: ${(
        (total_count - current_count) /
        60
      ).toFixed(2)} minutes`
    );
    await sleep(800);
    try {
      await client.query({
        query: GET_METAMODEL,
        fetchPolicy: "network-only",
        variables: {
          id: item.id,
        },
      });
    } catch (error) {
      if (error.graphQLErrors[0].extensions.code === "MODEL_NOT_FOUND") {
        // create note
        await client
          .mutate({
            mutation: CREATE_METAMODEL,
            variables: {
              id: item.id,
              type: item.type,
              metadata: JSON.stringify({
                title: item.title,
              }),
            },
          })
          .then(async (res) => {
            // upload data
            await upload_pod_data({
              data_items: [
                {
                  ref_id: item.id,
                  data_model_version: item.data?.version || "0.0.1",
                  publicKey: session ? session.publicKey : undefined,
                  data: JSON.stringify({
                    type: "note",
                    data: item.data,
                  }),
                },
              ],
              client,
            });
          })
          .catch((error) => {
            toast.error(`Error while uploading data: ${error}`);
          });
      } else {
        throw error;
      }
    }
  }

  setStatus("Backup restored");
  toast.success("Backup restored");
}

async function run_restore_0_0_2({
  backup_data,
  setStatus,
  client,
  session,
}: {
  backup_data: any;
  setStatus: (status: string) => void;
  client: any;
  session: any;
}) {
  logger.info(`Restoring backup file version 0.0.2`);
  const total_count = backup_data.data.length;
  let current_count = 0;
  for await (const item of backup_data.data) {
    current_count++;
    setStatus(
      `Restoring (${current_count}/${total_count}) | Time remaining: ${(
        (total_count - current_count) /
        60
      ).toFixed(2)} minutes`
    );
    await sleep(800);
    try {
      await client.query({
        query: GET_METAMODEL,
        fetchPolicy: "network-only",
        variables: {
          id: item.id,
        },
      });
    } catch (error) {
      if (error.graphQLErrors[0].extensions.code === "MODEL_NOT_FOUND") {
        // create note
        await client
          .mutate({
            mutation: CREATE_METAMODEL,
            variables: {
              id: item.id,
              type: item.type,
              metadata: item.metadata,
            },
          })
          .then(async (res) => {
            // if pod is not created, then skip uploading data
            if(item.data?.data === ""){
              // empty data so skip uploading
              logger.info("Skipping uploading data for pod", item.id);
              return;
            }
            // upload data
            await upload_pod_data({
              data_items: [
                {
                  ref_id: item.id,
                  data_model_version: item.data?.version || "0.0.1",
                  publicKey: session ? session.publicKey : undefined,
                  data: JSON.stringify(item.data),
                },
              ],
              client,
            });
          })
          .catch((error) => {
            toast.error(`Error while uploading data: ${error}`);
          });
      } else {
        throw error;
      }
    }
  }

  setStatus("Backup restored");
  toast.success("Backup restored");
}
