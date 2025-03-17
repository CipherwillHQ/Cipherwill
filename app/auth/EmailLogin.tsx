import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function EmailLogin({
  method,
  setMethod,
}: {
  method: null | "email" | "google";
  setMethod: React.Dispatch<React.SetStateAction<null | "email" | "google">>;
}) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState(false);
  const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
  } = useAuth();
  if (method === null) {
    return (
      <button
        className="w-full mb-2 border dark:bg-white text-black p-2 rounded-full font-semibold"
        onClick={() => setMethod("email")}
      >
        Continue with Email & Password
      </button>
    );
  }
  if (method === "google") {
    return null;
  }

  return (
    <>
      <h1 className="text-3xl font-bold pb-6 text-center">
        {mode === "signin" ? "Sign in" : "Sign up"}
      </h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2 mb-4"
      >
        <div className="flex items-center w-full my-4">
          <div
            className={`flex-1 text-center py-2 px-4 cursor-pointer rounded-l-md border
          ${
            mode === "signup"
              ? "font-semibold bg-black text-white dark:bg-white dark:text-black"
              : ""
          }
          `}
            onClick={() => setMode("signup")}
          >
            Signup
          </div>
          <div
            className={`flex-1 text-center py-2 px-4 cursor-pointer rounded-r-md border
            ${
              mode === "signin"
                ? "font-semibold bg-black text-white dark:bg-white dark:text-black"
                : ""
            }
            `}
            onClick={() => setMode("signin")}
          >
            Signin
          </div>
        </div>
        <input
          name="email"
          type="text"
          placeholder="Email"
          className="px-4 py-2 border rounded-full dark:bg-neutral-800 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex items-center justify-between">
          <input
            name="password"
            type={viewPassword ? "text" : "password"}
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-full dark:bg-neutral-800 font-semibold"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div
            className="cursor-pointer pl-2"
            onClick={() => {
              setViewPassword(!viewPassword);
            }}
          >
            {viewPassword ? (
              <IoEyeOffOutline size={22} />
            ) : (
              <IoEyeOutline size={22} />
            )}
          </div>
        </div>
        {error !== null && (
          <div id="error" className="text-red-500 text-sm">
            Error: {error}
          </div>
        )}
        {mode === "signin" ? (
          <Popup
            modal
            trigger={
              <div
                aria-describedby="forgot-password-popup"
                className="text-blue-500 text-sm font-semibold hover:text-blue-600 text-right my-2 cursor-pointer"
                // onClick={async () => {
                //   if (email.length > 0 && email.includes("@")) {
                //     await sendPasswordResetEmail(email);
                //     await toast.success("Password reset email sent");
                //   } else {
                //     toast.error("Please enter a valid email");
                //   }
                // }}
              >
                Forgot password?
              </div>
            }
          >
            {/* @ts-ignore */}
            {(close) => (
              <div className="max-w-md bg-white px-4 pt-2 pb-6 rounded-sm flex flex-col gap-2">
                <h2 className="text-xl py-2 font-bold text-gray-900 mb-2 w-[50vw]">
                  Reset password
                </h2>
                <label className="font-semibold text-black">Email</label>
                <input
                  id="forgot-email"
                  defaultValue={email}
                  type="email"
                  className="p-2 border rounded-sm"
                  placeholder="Enter your email"
                />
                <div className="text-gray-600 my-4 font-medium">
                  You will receive an email with a link to reset your password.
                </div>
                <button
                  className="bg-gray-900 hover:bg-black text-white p-2 rounded-sm font-semibold"
                  onClick={async () => {
                    const email = (
                      document.getElementById(
                        "forgot-email"
                      ) as HTMLInputElement
                    )?.value;
                    if (email.length > 0 && email.includes("@")) {
                      await sendPasswordResetEmail(email);
                      await toast.success("Password reset email sent");
                      close();
                    } else {
                      toast.error("Please enter a valid email");
                    }
                  }}
                >
                  Send password reset email
                </button>
              </div>
            )}
          </Popup>
        ) : (
          <div className="my-4" />
        )}
        <button
          type="submit"
          className="bg-gray-900 hover:bg-black text-white dark:bg-white dark:text-black p-2 rounded-full font-semibold"
          onClick={async () => {
            setError(null);
            if (!email || !password)
              return setError("Email or password is empty");
            if (!email.includes("@")) return setError("Email is invalid");

            if (mode === "signin") {
              const res = await signInWithEmailAndPassword(email, password);
              if (res && res.error) {
                setError(res.error);
              }
            } else {
              const res = await createUserWithEmailAndPassword(email, password);
              if (res && res.error) {
                setError(res.error);
              }
            }
          }}
        >
          {mode === "signin" ? "Sign In" : "Sign Up"}
        </button>
        <button
          type="submit"
          className="border bg-white/75 text-black p-2 rounded-full font-semibold"
          onClick={async () => {
            setMethod(null);
          }}
        >
          {mode === "signin" ? "Sign in" : "Sign up"} using different method
        </button>
      </form>
    </>
  );
}
