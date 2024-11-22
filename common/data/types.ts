export type DataItem = {
  id?: string;
  data_model_version: string;
  ref_id: string;
  publicKey?: string;
  data: string | File;
};

export type Key = {
  beneficiary_id: string;
  ref_id: string;
  publicKey: string;
  key: string;
};

export type EncryptionKeys = Record<
  string,
  {
    metamodel_ref_id: string;
    key: string;
  }
>;
