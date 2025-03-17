import SimpleButton from "../common/SimpleButton";

export default function VideoHero() {
  return (
    <section className="min-h-screen">
      <video className="absolute" autoPlay loop muted>
        <source src="/videos/hero.mp4" type="video/mp4" />
      </video>
      {/* dark overlay */}
      <div className="absolute w-full h-full bg-black bg-radial-[at_25%_25%] from-white to-zinc-900 to-75%"></div>

      <div className="relative z-5 flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-white max-w-7xl w-full">
          <div className="max-w-3xl flex flex-col gap-4">
            <div className="300 text-5xl">
              Lorem ipsum dolor sit amet consectetur
            </div>
            <div className="">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Vel
              cupiditate a alias, non repellendus aliquid
            </div>
            <SimpleButton className="w-fit">Get started</SimpleButton>
          </div>
        </div>
      </div>
    </section>
  );
}
