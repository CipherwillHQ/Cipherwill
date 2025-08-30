"use client";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import ME from "../../graphql/ops/auth/queries/ME";
import { MeData } from "@/types/interfaces";

export default function Greetings() {
  const { loading, error, data } = useQuery<MeData>(ME);

  if (loading) return <p>Loading...</p>;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;

  if (data?.me?.birth_date === "0" || data?.me?.first_name === "") {
    return (
      <div className="w-full border border-default p-4 rounded-md flex items-center justify-between bg-secondary">
        <div>Profile not complete</div>
        <Link
          className="bg-orange-200 hover:bg-orange-300 text-sm px-3 py-1 rounded-full mx-2 text-black"
          href={"/app/profile"}
        >
          Complete
        </Link>
      </div>
    );
  }
  return (
    <div className="text-xl p-1 font-semibold">
      Hello, {data?.me?.first_name || "user"}
    </div>
  );
}
