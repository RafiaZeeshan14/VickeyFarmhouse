const navItems = [
  "Home",
  "About Us",
  "Facilities",
  "Pricing",
  "Gallery",
  "Location",
  "Contact",
];

export default function Header() {
  return (
    <header className="relative z-20 mx-auto flex min-h-[92px] w-[calc(100%-24px)] items-start justify-between gap-4 pt-4 sm:w-[calc(100%-36px)] lg:min-h-28 lg:w-[min(1640px,calc(100%-64px))] lg:items-center lg:pt-0">
      <a
        className="relative grid min-h-[92px] w-[190px] origin-left scale-[.72] content-center pl-[22px] leading-none text-[#0a2b43] sm:scale-[.86] lg:scale-100"
        href="#"
        aria-label="Vicky Farmhouse home"
      >
        <span className="absolute left-0 top-3.5 h-[72px] w-[118px] rounded-t-[58px] rounded-b-[18px] bg-[linear-gradient(135deg,#ffd44a_0_42%,#f47f21_43%_68%,#df2340_69%)] shadow-[inset_0_-8px_0_rgba(7,42,67,.12)]">
          <span className="absolute right-[13px] top-[-8px] h-[70px] w-[13px] rotate-[9deg] rounded-full bg-[#07334f]" />
          <span className="absolute right-[-9px] top-[-13px] h-[45px] w-[58px] rotate-[-15deg] rounded-[100%_0_100%_0] bg-[#07334f]" />
          <span className="absolute right-[35px] top-[9px] h-7 w-7 rounded-full bg-[#0a6a74]" />
        </span>
        <span className="relative mt-3 font-['Trebuchet_MS'] text-[44px] font-black italic normal-case text-white [text-shadow:-2px_-2px_0_#0a3758,2px_-2px_0_#0a3758,-2px_2px_0_#0a3758,2px_2px_0_#0a3758,0_5px_0_#df243c]">
          Vicky
        </span>
        <span className="relative ml-[26px] mt-1.5 w-max text-[15px] font-black uppercase tracking-normal text-[#06314d]">
          Farmhouse
        </span>
        <span className="relative ml-[26px] mt-[3px] w-max text-[9px] font-black uppercase tracking-normal text-[#31546b]">
          Picnic & Event Spot
        </span>
      </a>

      <nav
        className="hidden flex-1 items-center justify-center gap-5 lg:flex xl:gap-10"
        aria-label="Primary navigation"
      >
        {navItems.map((item) => (
          <a
            key={item}
            className={`relative py-2.5 text-[11px] font-black uppercase tracking-normal xl:text-sm ${
              item === "Home"
                ? "text-[#e99c1c] after:absolute after:bottom-px after:left-0 after:right-0 after:h-[3px] after:rounded-full after:bg-[#e9a52a]"
                : "text-[#09293e]"
            }`}
            href="#"
          >
            {item}
          </a>
        ))}
      </nav>

      <a
        className="mt-[13px] inline-flex min-h-[42px] items-center justify-center gap-2.5 rounded-full bg-[#06233a] px-3.5 text-[11px] font-black uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.2)] sm:px-5 lg:mt-0 lg:min-h-12 lg:px-7 lg:text-[13px]"
        href="#"
      >
        <span className="grid h-4 w-4 place-items-center rounded-sm border border-white/70 text-[9px]">
          B
        </span>
        Book Now
      </a>
    </header>
  );
}
