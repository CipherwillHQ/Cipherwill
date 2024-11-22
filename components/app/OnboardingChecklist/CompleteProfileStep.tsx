import { useUserContext } from "@/contexts/UserSetupContext";
import Link from "next/link";
import { BiCheckCircle, BiCircle } from "react-icons/bi";

export default function CompleteProfileStep() {
  const { user } = useUserContext();
  const is_complete = user
    ? (user.first_name === "" || user.birth_date === "0")
      ? false
      : true
    : false;
  return (
    <div className="w-full max-w-sm">
      <Link
        className={`${is_complete ? "pointer-events-none" : ""}`}
        href={"/app/profile"}
      >
        <div className="flex py-1">
          {is_complete ? (
            <BiCheckCircle className="text-green-500 mr-2" size={22} />
          ) : (
            <BiCircle className="text-gray-500 mr-2" size={22} />
          )}
          <span className="font-medium">Add your name and date of birth</span>
        </div>
      </Link>
      <div className="text-sm font-medium text-gray-500 dark:text-gray-400">
        When you complete your profile, your Cipherwill Schedule is generated for automated
        will execution events.
      </div>
    </div>
  );
}
