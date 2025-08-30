"use client";
import dynamic from "next/dynamic";

const DynamicToaster = dynamic(() => import("react-hot-toast").then(mod => mod.Toaster), {
  ssr: false,
  loading: () => <div className="hidden" />,
});


export default DynamicToaster;
