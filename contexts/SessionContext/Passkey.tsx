"use client";
import { ec as EC } from "elliptic";
import SimpleButton from "@/components/common/SimpleButton";
import crypto from "crypto";
import getShortKey from "@/factory/publicKey/getShortKey";
import toast from "react-hot-toast";
import logger from "@/common/debug/logger";

const ec = new EC("secp256k1");

function arrayBufferToStr(buf) {
  return String.fromCharCode.apply(null, new Uint8Array(buf));
}

export default function Passkey({
  set_session_token,
  method,
}: {
  set_session_token: Function;
  method: any;
}) {
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

        <SimpleButton
          className="w-full"
          onClick={async () => {
            const hostname = window.location.hostname;
            const nonce = new Uint8Array(Buffer.from(method.nonce, "base64"));
            const challenge = nonce.slice(0, 32);
            console.log("challenge", challenge);
            
            if (navigator.credentials) {
              await navigator.credentials
                .get({
                  publicKey: {
                    //first 32 bytes of the hash of the nonce is the challenge
                    challenge: challenge,
                    rpId: hostname,
                    allowCredentials: [
                      {
                        type: "public-key",
                        // remaining bytes of the hash of the nonce is the id
                        id: nonce.slice(32),
                      },
                    ],
                    userVerification: "required",
                  },
                })
                .then((credentials: PublicKeyCredential) => {
                  const clientDataStr = arrayBufferToStr(
                    credentials.response.clientDataJSON
                  );
                  const clientDataObj = JSON.parse(clientDataStr);
                  const stored_challenge: Uint8Array = new Uint8Array(Buffer.from(clientDataObj.challenge, "base64"));
                  let secret = crypto
                    .createHash("sha256")
                    .update(stored_challenge)
                    .digest("hex");
                  const keyPair = ec.keyFromPrivate(secret);
                  const publicKey = keyPair.getPublic("hex");
                  if (publicKey === method.publicKey) {
                    set_session_token({
                      publicKey: publicKey,
                      privateKey: keyPair.getPrivate("hex"),
                    });
                  } else {
                    toast.error("Invalid passkey");
                  }
                });
            } else {
              toast.error("Browser does not support Passkey authentication");
              logger.error("WebAuthn not supported", {
                message: "Browser does not support Passkey authentication",
              });
            }
          }}
        >
          Sign with Passkey
        </SimpleButton>
      </div>
    </>
  );
}
