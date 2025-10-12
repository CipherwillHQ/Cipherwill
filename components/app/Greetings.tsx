"use client";
import Link from "next/link";
import { useQuery } from "@apollo/client/react";
import ME from "../../graphql/ops/auth/queries/ME";
import { MeData } from "@/types/interfaces";

export default function Greetings() {
  const { loading, error, data } = useQuery<MeData>(ME);

  if (loading) return null;
  if (error) return <div>Error : {JSON.stringify(error)}</div>;

  if (data?.me?.first_name === "") {
    return null;
  }
  return (
    <div className="text-xl p-1 font-semibold">
      Hello,{" "}
      <span className="capitalize">{data?.me?.first_name || "user"}</span>
    </div>
  );
}
