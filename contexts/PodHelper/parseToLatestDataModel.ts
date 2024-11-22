import logger from "@/common/debug/logger";
import { POD_TYPE } from "@/types/POD";
import noteParser from "./data/noteParser";
import bankAccountParser from "./data/bankAccountParser";

export default function parseToLatestDataModel({
  type,
  data_version,
  expected_version,
  data,
}: {
  type: POD_TYPE;
  data_version: string;
  expected_version: string;
  data: any;
}) {
  if (data_version === expected_version) {
    return data;
  }
  switch (type) {
    case "note":
      return noteParser({
        data_version: data_version,
        data,
      });
      break;
    case "bank_account":
      return bankAccountParser({
        data_version: data_version,
        data,
      });
      break;
    default:
      // reset data if the type is not supported
      logger.error(`Type ${type} is not supported. so resetting data!`);
      return {};
  }
}
