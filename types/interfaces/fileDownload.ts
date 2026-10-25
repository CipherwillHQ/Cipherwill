// Defines web-side encrypted file download inputs.
// Owns vault session, client and filename metadata contracts.
// Does not send decryption keys to native code.
import type { ApolloClient } from "@apollo/client";
export interface FileDownloadArgs {
  client: ApolloClient;
  session: { publicKey: string; privateKey: string } | null;
  id: string;
  access_id?: string;
}
export interface FileDownloadMetadata { title: string; type: string; file_ext?: string }
export interface GrantedFileDownloadArgs extends FileDownloadArgs { access_id: string }
export interface FileDetailsProps { id: string }
