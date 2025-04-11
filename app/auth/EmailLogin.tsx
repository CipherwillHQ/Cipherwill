import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { IoEyeOutline, IoEyeOffOutline } from "react-icons/io5";
import toast from "react-hot-toast";
import Popup from "reactjs-popup";

export default function EmailLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [viewPassword, setViewPassword] = useState(false);
  const {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    sendPasswordResetEmail,
  } = useAuth();

  return (
    <>
      <h1 className="text-xl font-semibold py-8">Welcome to Cipherwill</h1>
      <form
        onSubmit={(e) => {
          e.preventDefault();
        }}
        className="flex flex-col gap-2 mb-4"
      >
        <label className="font-semibold text-black">Email</label>
        <input
          name="email"
          type="text"
          placeholder="Enter email address"
          className="px-4 py-2 border rounded-md dark:bg-neutral-800 font-semibold"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <label className="font-semibold text-black">Password</label>
        <div className="flex items-center justify-between">
          <input
            name="password"
            type={viewPassword ? "text" : "password"}
            placeholder="Enter password"
            className="w-full px-4 py-2 border rounded-md dark:bg-neutral-800 font-semibold"
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

        <Popup
          modal
          overlayStyle={{
            background: "rgba(0, 0, 0, 0.8)",
          }}
          trigger={
            <div
              aria-describedby="forgot-password-popup"
              className="text-primary text-sm font-semibold hover:text-primary-900 text-right my-2 cursor-pointer"
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
                className="bg-primary hover:bg-primary-900 hover:cursor-pointer text-white p-2 rounded-sm font-semibold"
                onClick={async () => {
                  const email = (
                    document.getElementById("forgot-email") as HTMLInputElement
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

        <button
          type="submit"
          className="bg-primary hover:bg-primary-900 transition-colors duration-300 text-white hover:cursor-pointer p-2 rounded-full font-semibold"
          onClick={async () => {
            setError(null);
            if (!email || !password)
              return setError("Email or password is empty");
            if (!email.includes("@")) return setError("Email is invalid");

            const res = await signInWithEmailAndPassword(email, password);
            if (res && res.error) {
              setError(res.error);
            }
          }}
        >
          Sign In
        </button>
        <button
          className="border border-primary transition-colors duration-300 hover:bg-primary-50 text-primary hover:cursor-pointer p-2 rounded-full font-semibold"
          onClick={async () => {
            setError(null);
            if (!email || !password)
              return setError("Email or password is empty");
            if (!email.includes("@")) return setError("Email is invalid");

            const res = await createUserWithEmailAndPassword(email, password);
            if (res && res.error) {
              setError(res.error);
            }
          }}
        >
          Sign Up
        </button>
      </form>
    </>
  );
}
