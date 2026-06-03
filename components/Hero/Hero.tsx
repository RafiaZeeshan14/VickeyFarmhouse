import Header from "../Header/Header";

const features = [
  {
    icon: "N",
    label: "Nature",
    subLabel: "All Around",
    color: "bg-[#3f8f51]",
  },
  {
    icon: "H",
    label: "Premium",
    subLabel: "Stay Experience",
    color: "bg-[#f49a20]",
  },
  {
    icon: "~",
    label: "Pool & Open",
    subLabel: "Spaces",
    color: "bg-[#2f9ad8]",
  },
];

const heroBackground = {
  backgroundImage:
    "linear-gradient(90deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.86) 27%, rgba(255,255,255,.42) 48%, rgba(255,255,255,.04) 74%), linear-gradient(180deg, rgba(255,255,255,.96) 0%, rgba(255,255,255,.28) 18%, rgba(255,255,255,0) 48%), url('/hero.png')",
};

export default function Hero() {
  return (
    <section
      className="relative min-h-[760px] overflow-hidden bg-cover bg-center sm:min-h-[820px] lg:min-h-screen"
      style={heroBackground}
    >
      <div className="pointer-events-none absolute left-[-170px] top-[86px] h-[610px] w-[90vw] max-w-[760px] rounded-full bg-[radial-gradient(circle,rgba(255,255,255,.98)_0%,rgba(255,255,255,.8)_45%,rgba(255,255,255,0)_73%)] lg:left-[-120px] lg:top-[76px] lg:h-[60vh]" />

      <Header />

      <div className="relative z-10 mx-auto mt-7 w-[calc(100%-28px)] max-w-[620px] sm:mt-10 sm:w-[calc(100%-36px)] lg:ml-9 lg:mr-auto lg:mt-16 lg:w-[min(760px,calc(100%-48px))] xl:mx-auto xl:mt-[92px] xl:w-[min(970px,calc(100%-64px))] xl:-translate-x-[21vw] 2xl:-translate-x-[350px]">
        <p className="mb-2.5 ml-[82px] font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,8vw,55px)] italic leading-none text-[rgba(81,163,122,.38)] sm:ml-[130px] lg:ml-[190px] xl:ml-[300px]">
          A Perfect Escape
        </p>

        <h1 className="m-0 max-w-[1040px] text-[clamp(37px,12vw,58px)] font-black uppercase leading-[.98] tracking-normal text-[#06233a] sm:text-[clamp(42px,8vw,82px)] xl:text-[clamp(64px,5.2vw,100px)]">
          Relax, Celebrate
          <span className="block text-[#ff980a]">& Create Memories</span>
        </h1>

        <p className="mt-5 flex max-w-[690px] items-start gap-3.5 text-[clamp(15px,3.8vw,18px)] font-semibold leading-[1.55] text-[#273f4f] lg:mt-7 xl:text-[clamp(18px,1.16vw,21px)]">
          <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full border-2 border-[#06233a] text-xs font-black">
            i
          </span>
          <span>
            <strong className="font-black">Vicky Farmhouse</strong> - Your
            perfect picnic & event destination surrounded by nature and comfort.
          </span>
        </p>

        <div
          className="mt-8 grid grid-cols-1 gap-5 sm:flex sm:flex-wrap sm:items-center sm:gap-x-8 sm:gap-y-5 lg:mt-12 xl:mt-[78px] xl:gap-x-16"
          aria-label="Farmhouse highlights"
        >
          {features.map((feature) => (
            <div
              key={feature.label}
              className="grid grid-cols-[44px_auto] items-center gap-3.5 text-[13px] font-black uppercase leading-tight text-[#08263c] sm:grid-cols-[50px_auto] xl:text-[15px]"
            >
              <span
                className={`grid h-[42px] w-[42px] place-items-center rounded-full text-[22px] font-black text-white sm:h-[50px] sm:w-[50px] sm:text-[28px] ${feature.color}`}
              >
                {feature.icon}
              </span>
              <span>
                {feature.label}
                <small className="mt-1 block text-[inherit] font-black">
                  {feature.subLabel}
                </small>
              </span>
            </div>
          ))}
        </div>

        <div className="mt-7 flex flex-wrap items-center gap-4 lg:mt-12 xl:mt-[70px] xl:gap-7">
          <a
            className="inline-flex min-h-[46px] w-[min(100%,260px)] items-center justify-center gap-2.5 rounded-full bg-[#06233a] px-7 text-[13px] font-black uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] sm:w-auto sm:min-w-[214px] lg:min-h-12"
            href="#"
          >
            <span className="grid h-4 w-4 place-items-center rounded-sm border border-white/70 text-[9px]">
              B
            </span>
            Book Now
            <span aria-hidden="true">&gt;</span>
          </a>
          <a
            className="inline-flex min-h-[46px] w-[min(100%,260px)] items-center justify-center gap-2.5 rounded-full border-2 border-[#e6a3346b] bg-white/60 px-7 text-[13px] font-black uppercase text-[#e6a334] shadow-[inset_0_0_0_1px_rgba(255,255,255,.72)] sm:w-auto sm:min-w-[218px] lg:min-h-12"
            href="#"
          >
            Explore More
            <span aria-hidden="true">&gt;</span>
          </a>
        </div>
      </div>

      <div
        className="absolute bottom-[-1px] left-0 right-0 z-10 h-[clamp(36px,5.5vw,76px)] bg-white"
        style={{
          clipPath:
            "polygon(0 43%, 18% 59%, 35% 50%, 52% 29%, 69% 51%, 84% 38%, 100% 54%, 100% 100%, 0 100%)",
        }}
      />
    </section>
  );
}
