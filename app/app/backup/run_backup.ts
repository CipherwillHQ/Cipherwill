import toast from "react-hot-toast";
import { sleep } from "../../../common/time/sleep";
import JSZip from "jszip";
import { ApolloClient } from "@apollo/client";
import getShortKey from "../../../factory/publicKey/getShortKey";
import getAllKeys from "../../../factory/key/getAllKeys";
import getPod from "../../../factory/pod/getPod";
import decrypt from "../../../crypto/e0/decrypt";
import { saveAs } from "file-saver";
import { POSSIBLE_STATUS } from "./types";
import getMyKeyCount from "../../../factory/key/getMyKeyCount";
import CryptoJS from "crypto-js";
import getAllMetamodels from "../../../factory/metamodel/getAllMetamodels";
import logger from "../../../common/debug/logger";

export default async function run_backup({
  status,
  setStatus,
  setProgress,
  session,
  client,
  setDataPoints,
  close,
}: {
  status: string;
  setStatus: (status: POSSIBLE_STATUS) => void;
  setProgress: (progress: number) => void;
  session: any;
  client: ApolloClient<any>;
  setDataPoints: (count: number) => void;
  close: () => void;
}) {
  if (status !== "Not started") {
    if (status === "Completed backup") {
      toast.error("Backup already completed");
    } else {
      toast.error("Backup already in progress");
    }
    return;
  }

  setStatus("Calculating data points");
  setProgress(5);
  const data_count = await getMyKeyCount(client);
  // Check if count is not 0
  if (data_count.count < 1) {
    close();
    toast.success("No data to backup");
    return;
  }
  if (session === null) {
    if (!data_count.publicKey.includes("null")) {
      close();
      toast.success(
        "Please start session with " + getShortKey(data_count.publicKey[0])
      );
      return;
    }
  } else if (!data_count.publicKey.includes(session.publicKey)) {
    // Check if current session can decrypt max data
    close();
    toast.success(
      "Please start session with " + getShortKey(data_count.publicKey[0])
    );
    return;
  }
  setDataPoints(data_count.count);
  setStatus("Downloading encrypted data");
  setProgress(10);
  // get all data
  let keys = await getAllKeys({
    client,
    maxPublicKey: session ? session.publicKey : "null",
  });
  keys = keys.reduce((a, v) => ({ ...a, [v.ref_id]: v }), {});
  await sleep(1000);
  setStatus("Downloading metadata");
  setProgress(20);
  // get all notes
  let models_arr = await getAllMetamodels({
    client,
  });
  await sleep(1000);
  setStatus("Mapping metadata to pods");
  setProgress(40);
  // map all notes
  let backup_data: {
    id: string;
    type: string;
    metadata: string;
    data: string;
  }[] = [];
  for await (const metamodel of models_arr) {
    let encrypted_data = await getPod(metamodel.id, client);
    if (encrypted_data === null || encrypted_data === undefined) {
      encrypted_data = "";
    }

    let key_obj = keys[metamodel.id];
    if(key_obj === undefined) {
      // skip if pod is not there
      continue;
    }
    let key = key_obj.key;
    if (key_obj.key.startsWith("{")) {
      const parsedData = JSON.parse(key_obj.key);
      if (parsedData.type === "E0") {
        key = await decrypt(
          session.privateKey,
          Buffer.from(parsedData.ciphertext, "base64"),
          Buffer.from(parsedData.ephemPublicKey, "base64"),
          Buffer.from(parsedData.iv, "base64"),
          Buffer.from(parsedData.mac, "base64")
        );
      }
    }
    const final_content = JSON.parse(
      CryptoJS.AES.decrypt(encrypted_data, key).toString(CryptoJS.enc.Utf8)
    );
    let decryped_data = "";
    if (final_content.data !== undefined) {
      decryped_data = final_content;
    }
    backup_data.push({
      id: metamodel.id,
      type: metamodel.type,
      metadata: metamodel.metadata,
      data: decryped_data,
    });
  }

  if (backup_data.length !== data_count.count) {
    toast.error("Missing data while backing up");
    setStatus("Error while backing up");
    return;
  }
  await sleep(1000);
  setStatus("Creating a zip file");
  setProgress(80);
  // create a zip
  var zip = new JSZip();
  zip.file(
    "backup.json",
    JSON.stringify(
      {
        type: "CIPHERWILL_BACKUP",
        version: "0.0.2",
        data: backup_data,
      },
      null,
      2
    )
  );
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    saveAs(content, "backup.zip");
  });
  await sleep(1000);
  setStatus("Completed backup");
  setProgress(100);
}
