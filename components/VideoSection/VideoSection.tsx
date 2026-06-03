export default function VideoSection() {
  return (
    <section className="relative overflow-hidden bg-white py-8 text-white sm:py-10 lg:py-12">
      <div className="relative mx-auto min-h-[440px] w-full overflow-hidden bg-[#062b45] lg:min-h-[470px]">
        <div className="absolute inset-y-0 left-0 z-0 w-full bg-[#062b45] lg:w-[57%]" />
        <div className="absolute inset-y-0 right-0 z-0 hidden w-[58%] overflow-hidden lg:block">
          <video
            className="h-full w-full object-cover"
            src="/tour-video.mp4"
            poster="/hero.png"
            muted
            loop
            playsInline
            controls
          />
          <div className="absolute inset-0 bg-black/10" />
        </div>

        <div className="absolute inset-y-0 left-[48%] z-10 hidden w-[220px] -skew-x-[18deg] bg-[#062b45] lg:block" />

        <div className="relative z-20 mx-auto grid min-h-[440px] w-full max-w-7xl items-center gap-8 px-4 py-14 sm:px-6 lg:min-h-[470px] lg:grid-cols-[0.9fr_1.1fr] lg:px-8 lg:py-16">
          <div className="max-w-xl text-center lg:text-left">
            <p className="mb-4 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(26px,6vw,42px)] italic leading-none text-[#e2a13a]">
              Take a Virtual Tour
            </p>

            <h2 className="text-[clamp(32px,8vw,58px)] font-black uppercase leading-[1.02] tracking-normal">
              Feel The Vibes
              <span className="block text-[#f5a40b]">Before You Arrive!</span>
            </h2>

            <p className="mx-auto mt-5 max-w-md text-[15px] font-semibold leading-7 text-white/80 sm:text-base lg:mx-0">
              Watch our video and explore the beauty, ambience, and experiences
              that await you.
            </p>

            <a
              className="mt-8 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-white px-7 text-[13px] font-black uppercase text-[#06233a] shadow-[0_12px_22px_rgba(0,0,0,.18)]"
              href="#tour-video"
            >
              <span className="grid h-6 w-6 place-items-center rounded-full border-2 border-[#06233a]">
                <span className="ml-0.5 h-0 w-0 border-y-[5px] border-l-[8px] border-y-transparent border-l-[#06233a]" />
              </span>
              Watch Video
            </a>
          </div>

          <div className="relative mx-auto w-full max-w-2xl lg:max-w-none">
            <div className="relative overflow-hidden rounded-none border-y-4 border-white/15 bg-black shadow-[0_22px_45px_rgba(0,0,0,.35)] lg:hidden">
              <video
                id="tour-video"
                className="aspect-[16/9] w-full object-cover"
                src="/tour-video.mp4"
                poster="/hero.png"
                muted
                loop
                playsInline
                controls
              />
            </div>

            <a
              className="absolute left-1/2 top-1/2 hidden h-28 w-28 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border-[10px] border-white/30 bg-white text-[#f5a40b] shadow-[0_16px_30px_rgba(0,0,0,.25)] outline outline-2 outline-offset-[12px] outline-white/55 lg:grid"
              href="#tour-video"
              aria-label="Watch video"
            >
              <span className="ml-2 h-0 w-0 border-y-[24px] border-l-[38px] border-y-transparent border-l-[#f5a40b]" />
            </a>
          </div>
        </div>

        <div className="pointer-events-none absolute -bottom-1 left-0 right-0 z-30 h-14 bg-white [clip-path:polygon(0_65%,26%_46%,48%_58%,72%_38%,100%_55%,100%_100%,0_100%)]" />
        <div className="pointer-events-none absolute -top-1 left-0 right-0 z-30 h-12 bg-white [clip-path:polygon(0_0,100%_0,100%_18%,72%_34%,48%_20%,25%_34%,0_18%)]" />
      </div>
    </section>
  );
}
