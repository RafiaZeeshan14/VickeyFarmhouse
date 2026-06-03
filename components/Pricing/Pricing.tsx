const plans = [
  {
    icon: "S",
    title: "Day Outing",
    description: "Perfect for Picnics & Day Events",
    price: "RS 7999",
    unit: "/ Day",
    accent: "text-[#f2a10c]",
    button: "outline",
    features: ["Up to 25 People", "Pool Access", "Lawn Access", "Indoor Games", "Parking"],
  },
  {
    icon: "M",
    title: "Overnight Stay",
    description: "Stay, Relax & Enjoy",
    price: "RS 14999",
    unit: "/ Night",
    accent: "text-[#f2a10c]",
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
    icon: "C",
    title: "Weekend Package",
    description: "2 Days / 1 Night Experience",
    price: "RS 24999",
    unit: "/ 2 Days",
    accent: "text-[#f2a10c]",
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
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-2 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]">
          Pricing Plans
        </p>

        <h2 className="mx-auto max-w-4xl text-[clamp(30px,6vw,52px)] font-black uppercase leading-[1.05] tracking-normal">
          Choose The Plan That{" "}
          <span className="text-[#f2a10c]">Suits You</span>
        </h2>

        <div className="mt-10 grid gap-6 md:grid-cols-3 lg:mt-12 lg:gap-8">
          {plans.map((plan) => (
            <article
              key={plan.title}
              className={`relative rounded-xl border border-black/5 bg-white px-7 pb-7 pt-8 text-left shadow-[0_12px_26px_rgba(6,35,58,.12)] ${
                plan.popular ? "bg-[#fff8e8] md:-translate-y-2" : ""
              }`}
            >
              {plan.popular ? (
                <div className="absolute left-1/2 top-[-14px] -translate-x-1/2 rounded-full bg-[#d82028] px-8 py-1.5 text-[11px] font-black uppercase tracking-wide text-white shadow-[0_8px_14px_rgba(216,32,40,.25)]">
                  Most Popular
                </div>
              ) : null}

              <div className="grid grid-cols-[54px_auto] items-center gap-4">
                <span
                  className={`grid h-12 w-12 place-items-center rounded-full text-3xl font-black ${plan.accent}`}
                >
                  {plan.icon}
                </span>
                <div>
                  <h3 className="text-[clamp(18px,2vw,24px)] font-black uppercase leading-tight text-[#06233a]">
                    {plan.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-[#6a7480]">
                    {plan.description}
                  </p>
                </div>
              </div>

              <div className="mt-7 border-b border-black/10 pb-5">
                <span className="text-[clamp(34px,5vw,48px)] font-black leading-none text-[#f2a10c]">
                  {plan.price}
                </span>
                <span className="ml-2 text-sm font-bold text-[#6a7480]">
                  {plan.unit}
                </span>
              </div>

              <ul className="mt-6 space-y-4">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-4 text-sm font-bold text-[#2e3f4c]"
                  >
                    <span className="text-lg font-black text-[#5f9270]">v</span>
                    {feature}
                  </li>
                ))}
              </ul>

              <a
                className={`mt-8 inline-flex min-h-12 w-full items-center justify-center rounded-full text-[13px] font-black uppercase ${
                  plan.button === "solid"
                    ? "bg-[#06233a] text-white shadow-[0_12px_22px_rgba(6,35,58,.18)]"
                    : "border-2 border-[#e6a3346b] bg-white text-[#e6a334]"
                }`}
                href="#"
              >
                Book Now
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
