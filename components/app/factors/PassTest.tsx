"use client";
import logger from "@/common/debug/logger";
import extractDomainName from "@/common/string/extractDomainName";
import generateRandomBytes from "@/common/string/generateRandomBytes";
import SimpleButton from "@/components/common/SimpleButton";
import { useEffect, useState } from "react";
import Popup from "reactjs-popup";

function arrayBufferToStr(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  }
  
export default function PassTest() {
  const [registrationId, setRegistrationId] = useState(null)
  const challenge = new Uint8Array([
    38, 254, 37, 187, 58, 230, 37, 216, 101, 199, 26, 200,
  ]);
  const domain = "localhost";

  return (
    <Popup
      trigger={
        <div>
          <SimpleButton>Passkey Test</SimpleButton>
        </div>
      }
      modal
    >
      <div className="flex flex-col items-center bg-white text-black p-2 gap-4">
        <button
          onClick={async () => {
            await navigator.credentials
              .create({
                publicKey: {
                  challenge:challenge,
                  rp: { id: domain, name: "Cipherwill" },
                  user: {
                    id: new Uint8Array([1, 2, 3, 4, 5]),
                    name: "tester@cipherwill.com",
                    displayName: "tester",
                  },
                  pubKeyCredParams: [{ type: "public-key", alg: -7 }],
                  authenticatorSelection:{
                    requireResidentKey: true,
                    residentKey: "required",
                  }
                },
              })
              .then(async (credential: PublicKeyCredential) => {
                logger.info("created credential", credential);
                setRegistrationId(credential.rawId);
              });
          }}
        >
          Add Key
        </button>
        <button
          onClick={async () => {
            logger.info("reading key");
            await navigator.credentials
              .get({
                publicKey: {
                  challenge: new Uint8Array([1, 2, 3, 4, 5]),
                  rpId: domain,
                  userVerification: "required",
                },
              })
              .then(async (credential: PublicKeyCredential) => {
                // logger.info("received credential", credential);
                // logger.info("rpid hash", (credential.response as AuthenticatorAssertionResponse).authenticatorData.slice(0, 32));
                // const clientDataStr = arrayBufferToStr(
                //     credential.response.clientDataJSON
                //     );
                //     const clientDataObj = JSON.parse(clientDataStr);
                //     logger.info("clientDataObj", clientDataObj);
                    const signature = (credential.response as AuthenticatorAssertionResponse).signature;
                    // logger.info("signature", signature);
                    const seed = await crypto.subtle.digest("SHA-256", signature);
                    logger.info("seed", Buffer.from(seed).toString("hex"));


              });
          }}
        >
          Read Key
        </button>
      </div>
    </Popup>
  );
}
