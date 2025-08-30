"use client";
import { useState } from "react";
import toast from "react-hot-toast";
import crypto from "crypto";
import { ec as EC } from "elliptic";
import { useApolloClient, useMutation } from "@apollo/client/react";
import CREATE_FACTOR from "../../../../graphql/ops/auth/mutations/CREATE_FACTOR";
import { useSession } from "../../../../contexts/SessionContext";
import continuousFactorIn from "./continuousFactorIn";
import SimpleButton from "@/components/common/SimpleButton";
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";

const ec = new EC("secp256k1");

export default function AddMetamask({ continuous }) {
  return (
    <MetaMaskProvider
      sdkOptions={{
        dappMetadata: {
          name: "Cipherwill",
          url: window.location.href,
        },
      }}
    >
      <ConnectSignAndAdd continuous={continuous} />
    </MetaMaskProvider>
  );
}

function ConnectSignAndAdd({ continuous }) {
  const [account, setAccount] = useState<string>();
  const { sdk } = useSDK();
  const { session } = useSession();
  const [isMigrating, setIsMigrating] = useState(false);
  const client = useApolloClient();

  const [createFactor, { loading }] = useMutation(CREATE_FACTOR, {
    onCompleted: async (data, clientOptions) => {
      if (continuous) {
        setIsMigrating(true);
        await continuousFactorIn(data, client, session);
        setIsMigrating(false);
      } else {
        toast.success("You need to perform factor migration yourself");
        window.location.reload();
      }
    },
  });
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
    <div className="flex flex-col gap-2">
      <h3 className="font-semibold p-1">Add Metamask</h3>

      {account ? (
        <SimpleButton
          onClick={async () => {
            if (isMigrating || loading) return;
            const nonce = Math.floor(Math.random() * 1000000).toString();

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

            await createFactor({
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
        <SimpleButton onClick={connect}>Connect</SimpleButton>
      )}
    </div>
  );
}
