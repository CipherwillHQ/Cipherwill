import { BsStarFill, BsStarHalf } from "react-icons/bs";

export default function RatingsAndUsers() {
  return (
    <div className="w-full max-w-7xl mx-auto text-center pt-10 pb-20 px-4">
      <h2 className="uppercase font-bold py-4">
        Trusted by individuals worldwide
      </h2>
      <div className="flex flex-col sm:flex-row items-center gap-2 text-[#8B8B8B] justify-center">
        <span className="flex items-center gap-1">
          <BsStarFill />
          <BsStarFill />
          <BsStarFill />
          <BsStarFill />
          <BsStarHalf />
        </span>
        <span>4.6 rating & open source codebase</span>
      </div>
    </div>
  );
}
