"use client";
import toast from "react-hot-toast";

export default function QuestionFeedback() {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mt-6">
      <h3 className="font-semibold">Did this answer your question?</h3>
      <button
        className="border rounded-md py-2 px-4 text-sm font-semibold hover:bg-slate-100"
        onClick={() => {
          toast.success("Thanks for the feedback!");
        }}
      >
        Yes
      </button>
      <button
        className="border rounded-md py-2 px-4 text-sm font-semibold hover:bg-slate-100"
        onClick={() => {
          toast.success("Thanks for the feedback!");
        }}
      >
        No
      </button>
    </div>
  );
}
