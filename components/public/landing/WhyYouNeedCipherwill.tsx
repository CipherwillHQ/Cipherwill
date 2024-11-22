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
          <div
          className="text-xl font-medium pb-12"
          >
            Your data vanishes into the digital void, lost forever with no one
            to retrieve it after you're gone. Unless you've digital will.
          </div>
          <div className="flex flex-col sm:flex-row gap-4 p-2">
            <div className="w-full border-l-4 border-accent-300 pl-4">
              <h3 className="text-xl font-semibold pb-2">Digital Will</h3>
              <p className="font-medium">
                A digital will is a platform where individuals can securely
                store their personal information and set up an{" "}
                <b>
                  automated system to ensure it is transferred to designated
                  beneficiaries
                </b>{" "}
                in the event of their incapacity or death.
              </p>
            </div>
            <div className="w-full border-l-4 border-accent-500 pl-4">
              <h3 className="text-xl font-semibold pb-2">Cipherwill</h3>
              <p className="font-medium">
                A <b>digital will platform</b> where you can
                securely store your important information (full encrypted) and create a will for
                it. When you pass away, we ensures that your digital assets are
                passed on to your chosen beneficiaries.
              </p>
            </div>
          </div>
        </div>
      </div>
    </ComeupTransition>
  );
}
