const aboutFeatures = [
  {
    icon: "S",
    title: "Spacious",
    subtitle: "Outdoor Areas",
  },
  {
    icon: "B",
    title: "Comfortable",
    subtitle: "Stay Options",
  },
  {
    icon: "H",
    title: "Hygienic",
    subtitle: "& Clean",
  },
  {
    icon: "E",
    title: "Events & Party",
    subtitle: "Friendly",
  },
];

export default function About() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-24">
      <div className="pointer-events-none absolute -top-12 left-0 right-0 h-20 bg-white" />

      <div className="mx-auto grid w-full max-w-6xl items-center gap-12 lg:grid-cols-[1fr_1.05fr] lg:gap-20">
        <div className="relative mx-auto h-[360px] w-full max-w-[520px] sm:h-[430px]">
          <div className="absolute left-2 top-16 grid grid-cols-7 gap-2 opacity-50 sm:left-0 sm:top-20">
            {Array.from({ length: 42 }).map((_, index) => (
              <span
                key={index}
                className="h-1 w-1 rounded-full bg-[#6b747c]"
              />
            ))}
          </div>

          <div className="absolute bottom-4 left-0 h-48 w-24 rounded-full bg-[#f6a313] blur-[1px] sm:bottom-8 sm:left-4" />
          <div className="absolute bottom-2 left-4 h-28 w-28 -rotate-45 rounded-tl-[90px] bg-[#f6a313]" />
          <div className="absolute bottom-0 left-2 h-28 w-36 origin-bottom-left rotate-[-24deg] bg-[#06233a] [clip-path:polygon(0_75%,100%_0,78%_100%,0_100%)]" />

          <div className="absolute left-[20%] top-4 w-[68%] rotate-[-4deg] rounded-md bg-white p-2 shadow-[0_10px_18px_rgba(6,35,58,.22)] sm:left-[18%] sm:w-[70%]">
            <div className="h-36 overflow-hidden rounded bg-[#d7e6d6] sm:h-44">
              <img
                className="h-full w-full object-cover object-[50%_28%]"
                src="/hero.png"
                alt="Green farmhouse garden pathway"
              />
            </div>
          </div>

          <div className="absolute bottom-6 left-[28%] w-[68%] rotate-[4deg] rounded-md bg-white p-2 shadow-[0_12px_20px_rgba(6,35,58,.24)] sm:bottom-8 sm:left-[25%] sm:w-[72%]">
            <div className="h-40 overflow-hidden rounded bg-[#d7e6d6] sm:h-52">
              <img
                className="h-full w-full object-cover object-[75%_58%]"
                src="/hero.png"
                alt="Farmhouse lawn with poolside seating"
              />
            </div>
          </div>
        </div>

        <div className="relative z-10 mx-auto max-w-xl text-center lg:mx-0 lg:text-left">
          <p className="mb-3 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]">
            About Us
          </p>

          <h2 className="text-[clamp(32px,7vw,52px)] font-black uppercase leading-[1.02] tracking-normal text-[#06233a]">
            Welcome To
            <span className="block text-[#f2a10c]">Vicky Farmhouse</span>
          </h2>

          <p className="mt-5 text-[15px] font-semibold leading-7 text-[#4b5863] sm:text-base">
            Vicky Farmhouse is the ideal getaway for family picnics, weekend
            outings, birthday parties, corporate events, and more.
          </p>
          <p className="mt-2 text-[15px] font-semibold leading-7 text-[#4b5863] sm:text-base">
            Spread across lush greenery with modern amenities, we ensure a
            perfect blend of nature, comfort, and fun.
          </p>

          <div className="mt-8 grid grid-cols-2 gap-x-4 gap-y-5 sm:grid-cols-4">
            {aboutFeatures.map((feature) => (
              <div
                key={feature.title}
                className="flex items-center gap-3 text-left text-[#06233a]"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-md border-2 border-[#6f8799] text-sm font-black text-[#06233a]">
                  {feature.icon}
                </span>
                <span className="text-[11px] font-black leading-tight">
                  {feature.title}
                  <small className="block text-[10px] font-semibold text-[#536271]">
                    {feature.subtitle}
                  </small>
                </span>
              </div>
            ))}
          </div>

          <a
            className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#06233a] px-8 text-[13px] font-black uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.18)]"
            href="#"
          >
            Read More
            <span aria-hidden="true">&gt;</span>
          </a>
        </div>
      </div>

      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-14 bg-[#06233a] opacity-95 [clip-path:polygon(0_70%,36%_70%,52%_10%,68%_70%,100%_38%,100%_100%,0_100%)]" />
    </section>
  );
}
