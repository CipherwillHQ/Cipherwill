// Creates v2 wallet factors using the shared client-side derivation.
// Owns wallet connection and factor creation through the existing API.
// Does not upgrade or remove existing v1 factors.
"use client";
import { useRef, useState } from "react";
import toast from "react-hot-toast";
import { createMetamaskNonce, deriveMetamaskFactor, getMetamaskSigningMessage } from "@/common/factor/metamaskFactor";
import { useApolloClient, useMutation } from "@apollo/client/react";
import CREATE_FACTOR from "../../../../graphql/ops/auth/mutations/CREATE_FACTOR";
import { useSession } from "../../../../contexts/SessionContext";
import continuousFactorIn from "./continuousFactorIn";
import SimpleButton from "@/components/common/SimpleButton";
import { useSDK } from "@metamask/sdk-react";
import WalletProvider from "../WalletProvider";
import { requestWallet } from "@/common/factor/walletSdk";

export default function AddMetamask({ continuous }) {
  return (
    <WalletProvider>
      <ConnectSignAndAdd continuous={continuous} />
    </WalletProvider>
  );
}

function ConnectSignAndAdd({ continuous }) {
  const [account, setAccount] = useState<string>();
  const { sdk } = useSDK();
  const { session } = useSession();
  const [isMigrating, setIsMigrating] = useState(false);
  const [isRequesting, setIsRequesting] = useState(false);
  const requesting = useRef(false);
  const client = useApolloClient();

  const [createFactor, { loading }] = useMutation(CREATE_FACTOR);
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
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold p-1">Add Metamask</h3>

      {account ? (
        <SimpleButton
          disabled={isRequesting || isMigrating || loading}
          onClick={async () => {
            if (requesting.current || isMigrating || loading) return;
            requesting.current = true;
            setIsRequesting(true);
            try {
              const nonce = createMetamaskNonce();
              const signResult = await requestWallet(sdk, () => sdk!.connectAndSign({
                msg: getMetamaskSigningMessage(nonce),
              }));
              const { publicKey } = deriveMetamaskFactor(signResult, nonce);

              const { data } = await createFactor({
                variables: {
                  name: `Metamask ${account.substring(
                    0,
                    4
                  )}******${account.substring(account.length - 6)}`,
                  type: "metamask",
                  publicKey,
                  nonce,
                },
              });
              if (continuous) {
                setIsMigrating(true);
                await continuousFactorIn(data, client, session);
              } else {
                toast.success("You need to perform factor migration yourself");
                window.location.reload();
              }
            } catch (error) {
              toast.error(error instanceof Error ? error.message : "Unable to add your wallet factor. Please try again.");
            } finally {
              requesting.current = false;
              setIsRequesting(false);
              setIsMigrating(false);
            }
          }}
        >
          {isMigrating ? (
            "Adding Factor..."
          ) : (
            <span>
              Add {account.substring(0, 4)}******
              {account.substring(account.length - 6)} as Factor
            </span>
          )}
        </SimpleButton>
      ) : (
        <SimpleButton disabled={isRequesting} onClick={connect}>{isRequesting ? "Waiting for MetaMask..." : "Connect"}</SimpleButton>
      )}
    </div>
  );
}
