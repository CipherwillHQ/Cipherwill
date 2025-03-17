"use client";
import crypto from "crypto";
import toast from "react-hot-toast";
import { ec as EC } from "elliptic";
import { useState } from "react";
import BasicPopup from "../../components/BasicPopup";
import getShortKey from "../../factory/publicKey/getShortKey";

const ec = new EC("secp256k1");

export default function MasterPassword({
  set_session_token,
  method,
}: {
  set_session_token: Function;
  method: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [seed, setSeed] = useState("");

  function handleSubmit(nonce: string) {
    if (!nonce) {
      toast.error("Invalid nonce");
      return;
    }
    if (seed.length === 0) {
      toast.error("Please enter a password");
      return;
    }
    let secret = crypto
      .createHash("sha256")
      .update(`${seed}:${nonce}`)
      .digest("hex");
    const keyPair = ec.keyFromPrivate(secret);
    const publicKey = keyPair.getPublic("hex");
    if (publicKey === method.publicKey) {
      set_session_token({
        publicKey: publicKey,
        privateKey: keyPair.getPrivate("hex"),
      });
    } else {
      toast.error("Invalid password");
    }
  }

  return (
    <>
      <div
        data-cy="master-password-box"
        className="border border-default rounded-sm p-2 m-1 cursor-pointer w-80 bg-secondary"
        onClick={async () => {
          setIsOpen(true);
        }}
      >
        Name: <span data-cy="master-password-name">{method.name}</span>
        <br />
        Type: {method.type}
        <br />
        Key: {getShortKey(method.publicKey)}
      </div>
      <BasicPopup
        open={isOpen}
        setOpen={(_e) => {
          setIsOpen(false);
        }}
      >
        <h2 className="py-2 text-xl font-semibold">
          Enter your Master Password
        </h2>
        <input
          type="password"
          data-cy="master-password-input"
          placeholder="Master Password"
          className="border p-2 w-full bg-white dark:bg-neutral-800"
          value={seed}
          onChange={(e) => setSeed(e.target.value)}
          autoFocus
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleSubmit(method.nonce);
            }
          }}
        />
        <button
        data-cy="master-password-submit"
          className="bg-blue-500 text-white p-2 rounded-sm mt-2 w-full"
          onClick={() => handleSubmit(method.nonce)}
        >
          Submit
        </button>
      </BasicPopup>
    </>
  );
}
