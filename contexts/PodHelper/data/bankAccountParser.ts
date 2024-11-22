import { BANK_ACCOUNT_TYPE } from "@/types/pods/BANK_ACCOUNT";

export default function bankAccountParser({
  data_version,
  data,
}: {
  data_version: string;
  data: BANK_ACCOUNT_TYPE;
}) {
  // current expected version is 0.0.1
  // which is the first version of the data model
  return data;
}
