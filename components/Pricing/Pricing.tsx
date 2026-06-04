import { CalendarDays, Check, Moon, SunMedium } from "lucide-react";

const plans = [
  {
    Icon: SunMedium,
    title: "Day Outing",
    description: "Perfect for picnics & day events",
    price: "RS 7,999",
    unit: "/ Day",
    accentText: "text-[#5f9270]",
    accentBg: "bg-[#eaf2eb]",
    accentBorder: "border-[#5f9270]",
    checkBg: "bg-[#5f9270]",
    buttonHover: "hover:border-[#5f9270] hover:bg-[#5f9270] hover:text-white",
    button: "outline",
    features: [
      "Up to 25 People",
      "Pool Access",
      "Lawn Access",
      "Indoor Games",
      "Parking",
    ],
  },
  {
    Icon: Moon,
    title: "Overnight Stay",
    description: "Stay, relax & enjoy",
    price: "RS 14,999",
    unit: "/ Night",
    accentText: "text-[#e6a334]",
    accentBg: "bg-[#fff4df]",
    accentBorder: "border-[#e6a334]",
    checkBg: "bg-[#e6a334]",
    buttonHover: "hover:border-[#e6a334] hover:bg-[#e6a334] hover:text-[#06233a]",
    button: "solid",
    popular: true,
    features: [
      "Up to 25 People",
      "Pool Access",
      "Lawn Access",
      "Indoor Games",
      "1 Night Stay",
      "Complimentary Breakfast",
    ],
  },
  {
    Icon: CalendarDays,
    title: "Weekend Package",
    description: "2 days / 1 night experience",
    price: "RS 24,999",
    unit: "/ 2 Days",
    accentText: "text-[#3f78b2]",
    accentBg: "bg-[#eaf2fb]",
    accentBorder: "border-[#3f78b2]",
    checkBg: "bg-[#3f78b2]",
    buttonHover: "hover:border-[#3f78b2] hover:bg-[#3f78b2] hover:text-white",
    button: "outline",
    features: [
      "Up to 25 People",
      "Pool Access",
      "Lawn Access",
      "Indoor Games",
      "1 Night Stay",
      "Complimentary Breakfast",
    ],
  },
];

export default function Pricing() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-20">
      <div className="mx-auto max-w-[1580px] rounded-xl bg-white/80 px-4 py-14 shadow-[0_26px_70px_rgba(6,35,58,.1)] ring-1 ring-[#06233a]/5 sm:px-8 lg:px-10 lg:py-16">
        <div className="relative mx-auto max-w-6xl text-center">
          <p className="mb-2 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]">
            Pricing Plans
          </p>

          <h2 className="mx-auto max-w-4xl text-[clamp(30px,6vw,52px)] font-black uppercase leading-[1.05] tracking-normal text-[#06233a]">
            Choose The Plan That
            <span className="block">
              <span className="text-[#e4a43b]">Suits</span> You
            </span>
          </h2>

          <div className="pointer-events-none absolute left-1/2 top-[98px] hidden -translate-x-1/2 select-none text-[clamp(128px,16vw,220px)] font-black leading-none text-[#06233a]/[.075] lg:block">
            Pricing
          </div>
        </div>

        <div className="relative z-10 mt-12 grid items-stretch gap-6 md:grid-cols-3 lg:mt-16 lg:gap-8 xl:gap-10">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`relative flex min-h-[760px] w-full flex-col rounded-[22px] border bg-[#fbfaf7]  px-7 pb-8 pt-8 text-left shadow-[0_18px_45px_rgba(6,35,58,.1)] backdrop-blur-md xl:px-8 ${
                plan.popular
                  ? "border-[#e6a334] md:-translate-y-3"
                  : "border-[#06233a]/8"
              }`}
            >
              {plan.popular ? (
                <div className="absolute left-1/2 top-0 flex h-10 min-w-[180px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-b-full rounded-t-none bg-[#e6a334] px-8 text-[12px] font-bold uppercase text-white shadow-[0_10px_18px_rgba(230,163,52,.28)]">
                  Most Popular
                </div>
              ) : null}

              <div className="grid min-h-[96px] grid-cols-[76px_auto] items-center gap-4">
                <span
                  className={`grid h-16 w-16 place-items-center rounded-full ${plan.accentBg} ${plan.accentText}`}
                >
                  <plan.Icon
                    className="h-9 w-9"
                    strokeWidth={1.9}
                    aria-hidden="true"
                  />
                </span>
                <div>
                  <h3 className={`text-[clamp(20px,1.55vw,28px)] font-black leading-tight ${plan.accentText}`}>
                    {plan.title}
                  </h3>
                  <p className="mt-2 text-sm font-semibold leading-6 text-[#4b5863]">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mt-7 h-px bg-[#06233a]/10" />

              <div className="mt-7 flex min-h-[64px] items-end gap-2 whitespace-nowrap">
                <span className="text-[clamp(32px,3.15vw,56px)] font-bold leading-none text-[#06233a]">
                  {plan.price}
                </span>
                <span className="shrink-0 pb-1 text-sm font-bold text-[#5e6b75]">
                  {plan.unit}
                </span>
              </div>

              <a
                className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full border text-[13px] font-bold uppercase transition-colors ${
                  plan.button === "solid"
                    ? `border-[#e6a334] bg-[#e6a334] text-[#06233a] shadow-[0_12px_24px_rgba(230,163,52,.24)] ${plan.buttonHover}`
                    : `${plan.accentBorder} bg-white/55 ${plan.accentText} ${plan.buttonHover}`
                }`}
                href="#"
              >
                Book Now
              </a>

              <div className="mt-7 h-px bg-[#06233a]/10" />

              <ul className="mt-7 min-h-[190px] space-y-3.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-3 text-sm font-semibold text-[#2e3f4c]"
                  >
                    <span
                      className={`grid h-5 w-5 shrink-0 place-items-center rounded-full ${plan.checkBg}`}
                    >
                      <Check
                        className="h-3.5 w-3.5 text-white"
                        strokeWidth={3}
                        aria-hidden="true"
                      />
                    </span>
                    {feature}
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
