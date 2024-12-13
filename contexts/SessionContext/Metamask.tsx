"use client";
import { ec as EC } from "elliptic";
import { useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import SimpleButton from "@/components/common/SimpleButton";
import crypto from "crypto";
import toast from "react-hot-toast";
import getShortKey from "@/factory/publicKey/getShortKey";

const ec = new EC("secp256k1");

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
        className="border border-default rounded p-2 m-1 cursor-pointer w-80 bg-secondary"
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
              const nonce = method.nonce;

              const signResult = await sdk?.connectAndSign({
                msg: `Cipherwill Factor: ${nonce}` ,
              });
              let signature_as_secret = (signResult as string).substring(
                (signResult as string).length - 8
              ); // last 8 characters of the signature as secret

              let secret = crypto
                .createHash("sha256")
                .update(`${signature_as_secret}:${nonce}`)
                .digest("hex");
              const keyPair = ec.keyFromPrivate(secret);
              const publicKey = keyPair.getPublic("hex");
              if (publicKey === method.publicKey) {
                set_session_token({
                  publicKey: publicKey,
                  privateKey: keyPair.getPrivate("hex"),
                });
              } else {
                toast.error("Invalid wallet");
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
