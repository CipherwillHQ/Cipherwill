"use client";
import { ec as EC } from "elliptic";
import SimpleButton from "@/components/common/SimpleButton";
import crypto from "crypto";
import getShortKey from "@/factory/publicKey/getShortKey";
import toast from "react-hot-toast";
import logger from "@/common/debug/logger";
import extractDomainName from "@/common/string/extractDomainName";
import mergeUint8Arrays from "@/common/string/mergeUint8Arrays";

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
            const domain = extractDomainName(window.location.href);
            if (domain !== "localhost" && domain !== "cipherwill.com") {
              toast.error("Invalid domain to access Passkey");
              return;
            }
            if (navigator.credentials) {
              await navigator.credentials
                .get({
                  publicKey: {
                    challenge: new Uint8Array([1, 2, 3, 4, 5]),
                    rpId: domain,
                    userVerification: "required",
                  },
                })
                .then((credentials: PublicKeyCredential) => {
                  let secret = crypto
                    .createHash("sha256")
                    .update(
                      mergeUint8Arrays(
                        new Uint8Array(Buffer.from(method.nonce, "base64")),
                        new Uint8Array(credentials.rawId)
                      )
                    )
                    .digest("hex");
                  const keyPair = ec.keyFromPrivate(secret);
                  const publicKey = keyPair.getPublic("hex");
                  if (publicKey === method.publicKey) {
                    set_session_token({
                      publicKey: publicKey,
                      privateKey: keyPair.getPrivate("hex"),
                    });
                  } else {
                    toast.error("Invalid Passkey");
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
