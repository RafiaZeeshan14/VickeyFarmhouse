export default function VideoSection() {
  return (
    <section className="relative -mt-px overflow-hidden bg-[#062b45] px-4 pb-24 pt-14 text-white sm:px-6 lg:px-8 lg:pb-28 lg:pt-16">
      <div className="mx-auto grid w-full max-w-7xl items-stretch gap-8 lg:grid-cols-[0.48fr_0.52fr] xl:max-w-[1500px] xl:gap-10">
        <div className="relative min-h-[620px] overflow-hidden lg:min-h-[640px]">
          <div className="absolute inset-y-0 left-0 w-full rounded-xl bg-white shadow-[0_28px_70px_rgba(0,0,0,.2)] [clip-path:polygon(7%_0,100%_0,92%_100%,0_100%)]" />
          <div className="absolute inset-y-0 right-0 w-[44%] rounded-xl bg-[linear-gradient(90deg,rgba(255,255,255,.88),#fff)] shadow-[0_28px_70px_rgba(0,0,0,.12)] [clip-path:polygon(14%_0,100%_0,86%_100%,0_100%)]" />
          <div className="pointer-events-none absolute right-[39%] top-0 z-10 h-28 w-1.5 -skew-x-[10deg] bg-[#062b45]" />
          <div className="pointer-events-none absolute bottom-0 right-[39%] z-10 h-28 w-1.5 -skew-x-[10deg] bg-[#062b45]" />

          <div className="relative z-10 flex min-h-[620px] max-w-[430px] flex-col justify-center px-8 py-12 text-[#06233a] sm:px-12 lg:min-h-[640px] xl:px-14">
            <p className="mb-8 max-w-[280px] font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(42px,5vw,60px)] italic leading-[.95] text-[#e2a13a]">
              Take a Virtual Tour
            </p>

            <h2 className="text-[clamp(42px,4.5vw,62px)] font-black uppercase leading-[1.02] tracking-normal">
              Feel The Vibes
              <span className="block text-[#f5a40b]">Before You Arrive!</span>
            </h2>

            <p className="mt-9 max-w-[360px] text-[17px] font-semibold leading-8 text-[#17334a]">
              Watch our video and explore the beauty, ambience, and experiences
              that await you.
            </p>

            <a
              className="mt-9 inline-flex min-h-14 w-max items-center justify-center gap-3 rounded-full bg-[#06233a] px-7 text-[13px] font-bold uppercase text-white shadow-[0_14px_26px_rgba(6,35,58,.22)] transition-colors hover:bg-[#e6a334] hover:text-[#06233a]"
              href="#tour-video"
            >
              <span className="grid h-8 w-8 place-items-center rounded-full bg-white text-[#06233a]">
                <span className="ml-0.5 h-0 w-0 border-y-[6px] border-l-[9px] border-y-transparent border-l-current" />
              </span>
              Watch Video
            </a>
          </div>
        </div>

        <div className="relative min-h-[340px] overflow-hidden rounded-xl bg-black shadow-[0_28px_70px_rgba(0,0,0,.26)] ring-1 ring-white/10 sm:min-h-[420px] lg:min-h-[640px]">
          <video
            id="tour-video"
            className="h-full w-full object-cover"
            src="/video.mp4"
            poster="/hero.png"
            muted
            loop
            playsInline
            autoPlay
          />
          <div className="absolute inset-0 bg-black/10" />

          <a
            className="absolute left-1/2 top-1/2 grid h-24 w-24 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[6px] border-white/80 bg-white/10 text-white backdrop-blur-sm transition-colors hover:border-[#e6a334] hover:bg-[#e6a334] hover:text-[#06233a] sm:h-28 sm:w-28"
            href="#tour-video"
            aria-label="Watch video"
          >
            <span className="ml-1 h-0 w-0 border-y-[18px] border-l-[28px] border-y-transparent border-l-current sm:border-y-[22px] sm:border-l-[34px]" />
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-[-1px] left-0 right-0 z-30 h-[clamp(36px,5.5vw,76px)] bg-[#fbfaf7]"
        style={{
          clipPath:
            "polygon(0 43%, 18% 59%, 35% 50%, 52% 29%, 69% 51%, 84% 38%, 100% 54%, 100% 100%, 0 100%)",
        }}
      />
    </section>
  );
}
