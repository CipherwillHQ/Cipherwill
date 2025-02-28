export default function Simple() {
  return (
    <section className="w-full max-w-7xl mx-auto flex flex-col gap-8 py-8">
      <h2 className="text-5xl font-bold text-center">
        It's simple to get started
      </h2>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4 px-4 py-8 xl:px-0">
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">1.</div>
          <h3 className="font-bold py-2 text-lg">Signup</h3>
          <p>
            Create your secure account in just a few clicks. Your data stays
            protected with advanced encryption from the start.
          </p>
        </div>
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">2.</div>
          <h3 className="font-bold py-2 text-lg">Add data</h3>
          <p>
            Store your important information with end-to-end encryption. From
            bank details to digital assets, everything is safely locked in.
          </p>
        </div>
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">3.</div>
          <h3 className="font-bold py-2 text-lg">Add beneficiary</h3>
          <p>
            Choose who gets access to your data when the time comes. Only your
            trusted people will receive what you&apos;ve securely planned for
            them.
          </p>
        </div>
        <div className="border border-[#F1F1F1] bg-gradient-to-b from-white to-[#F4F4F4] p-2 rounded-lg">
          <div className="font-bold">4.</div>
          <h3 className="font-bold py-2 text-lg">All set & done</h3>
          <p>
            Relax knowing your digital legacy is securely handled. Your
            information stays safe, ready to be passed on when needed.
          </p>
        </div>
      </div>
    </section>
  );
}
