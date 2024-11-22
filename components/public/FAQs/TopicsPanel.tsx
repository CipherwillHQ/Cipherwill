"use client";
import { useRouter } from "next/navigation";
import questions_list from "./questions";
import { GoDotFill } from "react-icons/go";
export default function TopicsPanel() {
  const router = useRouter();
  return (
    <div className="bg-purple-100 rounded-md p-2 w-full sm:w-1/3 h-fit sm:sticky sm:top-20">
      <h2 className="font-medium py-2">Popular topics</h2>
      {Object.keys(questions_list).map((category, index) => {
        return (
          <div key={index} className="flex items-center gap-2">
            <GoDotFill className="text-gray-400 text-xs" />

            <h3
              className="text-indigo-600 font-semibold hover:underline cursor-pointer"
              onClick={() => {
                const heading = document.getElementById(`q:${category}`);
                if (heading) {
                  window.scrollTo({
                    top:
                      document.getElementById(`q:${category}`).offsetTop - 200,
                    behavior: "smooth",
                  });
                }
                {
                  router.push(
                    `/i/frequently-asked-questions?topic=${category}`
                  );
                }
              }}
            >
              {category}
            </h3>
          </div>
        );
      })}
    </div>
  );
}
