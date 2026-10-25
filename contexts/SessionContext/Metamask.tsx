// Unlocks existing v1 and v2 wallet factors using their stored nonce version.
// Owns wallet signing and public-key matching before starting a session.
// Does not migrate factors or send signatures or private keys to the API.
"use client";
import { useRef, useState } from "react";
import { useSDK } from "@metamask/sdk-react";
import SimpleButton from "@/components/common/SimpleButton";
import { deriveMetamaskFactor, getMetamaskSigningMessage } from "@/common/factor/metamaskFactor";
import toast from "react-hot-toast";
import getShortKey from "@/factory/publicKey/getShortKey";
import { requestWallet } from "@/common/factor/walletSdk";

export default function Metamask({
  set_session_token,
  method,
}: {
  set_session_token: Function;
  method: any;
}) {
  const [account, setAccount] = useState<string>();
  const { sdk } = useSDK();
  const [isRequesting, setIsRequesting] = useState(false);
  const requesting = useRef(false);

  const connect = async () => {
    if (requesting.current) return;
    requesting.current = true;
    setIsRequesting(true);
    try {
      const accounts = await requestWallet(sdk, () => sdk!.connect());
      setAccount(accounts?.[0]);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to connect to MetaMask");
    } finally {
      requesting.current = false;
      setIsRequesting(false);
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
            disabled={isRequesting}
            onClick={async () => {
              if (requesting.current) return;
              requesting.current = true;
              setIsRequesting(true);
              try {
                const nonce = method.nonce;
                const signResult = await requestWallet(sdk, () => sdk!.connectAndSign({
                  msg: getMetamaskSigningMessage(nonce),
                }));
                const factor = deriveMetamaskFactor(signResult, nonce);
                if (factor.publicKey === method.publicKey) {
                  set_session_token(factor);
                } else {
                  toast.error("Invalid wallet");
                }
              } catch (error) {
                toast.error(error instanceof Error ? error.message : "Unable to unlock this wallet factor. Please try again.");
              } finally {
                requesting.current = false;
                setIsRequesting(false);
              }
            }}
          >
            Sign with {account.substring(0, 4)}******
            {account.substring(account.length - 6)}
          </SimpleButton>
        ) : (
          <SimpleButton className="w-full" disabled={isRequesting} onClick={connect}>
            {isRequesting ? "Waiting for MetaMask..." : "Connect"}
          </SimpleButton>
        )}
      </div>
    </>
  );
}
