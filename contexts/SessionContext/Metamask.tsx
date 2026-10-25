// Unlocks existing v1 and v2 wallet factors using their stored nonce version.
// Owns wallet signing and public-key matching before starting a session.
// Does not migrate factors or send signatures or private keys to the API.
"use client";
import { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import SimpleButton from "@/components/common/SimpleButton";
import { deriveMetamaskFactor, getMetamaskSigningMessage } from "@/common/factor/metamaskFactor";
import toast from "react-hot-toast";
import getShortKey from "@/factory/publicKey/getShortKey";

export default function Metamask({
  set_session_token,
  method,
}: {
  set_session_token: Function;
  method: any;
}) {
  const [account, setAccount] = useState<string>();
  const { sdk } = useSDK();

  const connect = async () => {
    try {
      const accounts = await sdk?.connect();
      setAccount(accounts?.[0]);
    } catch (err) {
      toast.error("Failed to connect to Metamask");
      console.warn("failed to connect..", err);
    }
  };
  return (
    <>
      <div
        data-cy="metamask-box"
        className="border border-default rounded-sm p-2 m-1 cursor-pointer w-80 bg-secondary"
      >
        <div>
          Name: <span data-cy="master-password-name">{method.name}</span>
        </div>
        <div>Type: {method.type}</div>
        <div>Key: {getShortKey(method.publicKey)}</div>
        {account ? (
          <SimpleButton
            className="w-full"
            onClick={async () => {
              try {
                const nonce = method.nonce;
                const signResult = await sdk?.connectAndSign({
                  msg: getMetamaskSigningMessage(nonce),
                });
                const factor = deriveMetamaskFactor(signResult, nonce);
                if (factor.publicKey === method.publicKey) {
                  set_session_token(factor);
                } else {
                  toast.error("Invalid wallet");
                }
              } catch {
                toast.error("Unable to unlock this wallet factor. Please update Cipherwill and try again.");
              }
            }}
          >
            Sign with {account.substring(0, 4)}******
            {account.substring(account.length - 6)}
          </SimpleButton>
        ) : (
          <SimpleButton className="w-full" onClick={connect}>
            Connect
          </SimpleButton>
        )}
      </div>
    </>
  );
}
