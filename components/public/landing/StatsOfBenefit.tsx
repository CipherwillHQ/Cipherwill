import ComeupTransition from "@/components/animated/transitions/ComeUp";

export default function StatsOfBenefit() {
  return (
    <ComeupTransition>
      <div className="w-full max-w-7xl mx-auto p-4 my-20">
        {/* <h2 className="text-2xl md:text-4xl font-semibold py-12">
          Why consider Cipherwill?
        </h2> */}
        <div className="flex flex-col gap-4 font-medium">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:h-24">
            <div className="text-center content-center bg-neutral-50 border-neutral-200 w-full sm:w-4/6 text-xl p-4 rounded-md h-full">
              <span className="font-bold">60% of adults</span> don't have a will
              of any kind
            </div>
            <div className="text-center content-center bg-neutral-50 border-neutral-200 w-full text-xl p-4 rounded-md h-full">
              <span className="font-bold">73% of Americans</span> don't know
              what happens to their digital assets when they die
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:h-40">
            <div className="text-center content-center bg-neutral-50 border-neutral-200 w-full text-xl p-4 rounded-md h-full">
              Digital assets are projected to be worth{" "}
              <span className="font-bold">$5 trillion</span> globally by 2030
            </div>
            <div className="text-center content-center bg-neutral-50 border-neutral-200 w-full sm:w-4/6 text-xl p-4 rounded-md  h-full">
              The average person has over{" "}
              <span className="font-bold">90 online accounts.</span>
            </div>
          </div>
        </div>
      </div>
    </ComeupTransition>
  );
}
