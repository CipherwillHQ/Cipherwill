// Unlocks existing v1 and v2 master-password factors using their stored nonce.
// Owns password entry and public-key matching before starting a session.
// Does not migrate factors or send passwords or private keys to the API.
"use client";
import toast from "react-hot-toast";
import { useRef, useState } from "react";
import { deriveMasterPasswordFactor } from "@/common/factor/masterPasswordFactor";
import BasicPopup from "../../components/BasicPopup";
import getShortKey from "../../factory/publicKey/getShortKey";

export default function MasterPassword({
  set_session_token,
  method,
}: {
  set_session_token: Function;
  method: any;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [seed, setSeed] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submitting = useRef(false);

  async function handleSubmit(nonce: string) {
    if (submitting.current) return;
    if (!nonce) {
      toast.error("Invalid nonce");
      return;
    }
    if (seed.length === 0) {
      toast.error("Please enter a password");
      return;
    }
    submitting.current = true;
    setIsSubmitting(true);
    try {
      const factor = await deriveMasterPasswordFactor(seed, nonce);
      if (factor.publicKey === method.publicKey) {
        set_session_token(factor);
      } else {
        toast.error("Invalid password");
      }
    } catch {
      toast.error("Unable to unlock this password factor. Please update Cipherwill and try again.");
    } finally {
      submitting.current = false;
      setIsSubmitting(false);
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
          if (submitting.current) return;
          setIsOpen(false);
        }}
      >
       <div
       className="w-full max-w-xl"
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
          disabled={isSubmitting}
          onChange={(e) => setSeed(e.target.value)}
          autoFocus
          onKeyDown={async (e) => {
            if (e.key === "Enter") {
              await handleSubmit(method.nonce);
            }
          }}
        />
        <button
        data-cy="master-password-submit"
          className="bg-blue-500 text-white p-2 rounded-sm mt-2 w-full"
          disabled={isSubmitting}
          onClick={() => handleSubmit(method.nonce)}
        >
          {isSubmitting ? "Unlocking..." : "Submit"}
        </button>
       </div>
      </BasicPopup>
    </>
  );
}
