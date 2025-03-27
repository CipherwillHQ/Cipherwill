import ComeupTransition from "@/components/animated/transitions/ComeUp";

export default function WhyYouNeedCipherwill() {
  return (
    <ComeupTransition>
      <div className="bg-neutral-50 py-32">
        <div className="w-full max-w-7xl mx-auto p-4">
          <h3 className="text-lg font-semibold pb-8">
            Have you ever wondered!
          </h3>
          <h2 className="text-4xl md:text-6xl font-bold pb-12 italic">
            What happens to your data,
            <br />
            When you're gone?
          </h2>
          <div className="text-xl font-medium pb-12">
            Your data vanishes into the digital void, lost forever with no one
            to retrieve it after you're gone. Unless you've digital will.
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="w-full border-l-4 border-accent-300 pl-4">
              <div>
                <h3 className="text-4xl font-semibold pb-2">60%</h3>
                <div className="font-medium text-xl">
                  of adults don't have will of any kind
                </div>
              </div>
              <div className="mt-2">
                Without a will, most adults risk leaving their assets
                unprotected, leading to legal complications and delays for their
                loved ones. This lack of planning can result in lost wealth,
                family disputes, and unwanted government involvement.
              </div>
            </div>

            <div className="w-full border-l-4 border-accent-300 pl-4">
              <div>
                <h3 className="text-4xl font-semibold pb-2">90+</h3>
                <div className="font-medium text-xl">
                  The average number of online accounts a person has.
                </div>
              </div>
              <div className="mt-2">
                Managing or passing down these accounts becomes overwhelming for
                loved ones. Important data, assets, and memories risk being lost
                or locked away forever.
              </div>
            </div>
            <div className="w-full border-l-4 border-accent-300 pl-4">
              <div>
                <h3 className="text-4xl font-semibold pb-2">73%</h3>
                <div className="font-medium text-xl">
                  of Americans don't know what happens to their digital assets
                  when they die
                </div>
              </div>
              <div className="mt-2">
                Digital assets can be lost forever or fall into the wrong hands.
                Most people remain unaware of how their online accounts, crypto,
                and important files will be handled after they're gone.
              </div>
            </div>
            <div className="w-full border-l-4 border-accent-300 pl-4">
              <div>
                <h3 className="text-4xl font-semibold pb-2">$5 trillion</h3>
                <div className="font-medium text-xl">
                  The projected global worth of digital assets by 2030.
                </div>
              </div>
              <div className="mt-2">
                A significant portion of these digital assets could be lost,
                inaccessible, or mismanaged. Failing to secure them puts wealth,
                businesses, and personal legacies at risk.
              </div>
            </div>
          </div>
        </div>
      </div>
    </ComeupTransition>
  );
}
