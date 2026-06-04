import {
  BedDouble,
  CarFront,
  ConciergeBell,
  Dices,
  TreePalm,
  Waves,
} from "lucide-react";

const facilities = [
  {
    Icon: Waves,
    title: "Swimming",
    subtitle: "Pool",
    color: "bg-[#2f82c8]",
  },
  {
    Icon: TreePalm,
    title: "Spacious",
    subtitle: "Lawns",
    color: "bg-[#3f8f51]",
  },
  {
    Icon: BedDouble,
    title: "Comfortable",
    subtitle: "Rooms",
    color: "bg-[#f49a20]",
  },
  {
    Icon: Dices,
    title: "Indoor",
    subtitle: "Games",
    color: "bg-[#12385f]",
  },
  {
    Icon: ConciergeBell,
    title: "Delicious",
    subtitle: "Food",
    color: "bg-[#e02f32]",
  },
  {
    Icon: CarFront,
    title: "Ample",
    subtitle: "Parking",
    color: "bg-[#438f4d]",
  },
];

export default function Facilities() {
  return (
    <section className="relative overflow-hidden bg-[#fbfaf7] px-4 pb-14 pt-8 text-[#06233a] sm:px-6 lg:px-8 lg:pb-20 lg:pt-10">
      <div className="pointer-events-none absolute right-[-20px] top-12 hidden h-64 w-64 opacity-10 lg:block">
        <div className="absolute left-[112px] top-[75px] h-44 w-5 rotate-[-10deg] rounded-full bg-[#06233a]" />
        {Array.from({ length: 7 }).map((_, index) => (
          <span
            key={index}
            className="absolute left-[98px] top-[36px] h-24 w-28 origin-bottom-left rounded-[100%_0_100%_0] bg-[#06233a]"
            style={{ transform: `rotate(${index * 28 - 78}deg)` }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-2 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]">
          Our Facilities
        </p>

        <h2 className="mx-auto max-w-3xl text-[clamp(30px,6vw,52px)] font-black uppercase leading-[1.04] tracking-normal">
          Everything You Need
          <span className="block">
            For <span className="text-[#f2a10c]">A Perfect Day Out!</span>
          </span>
        </h2>

        <div className="mt-10 grid grid-cols-2 gap-x-5 gap-y-9 sm:grid-cols-3 lg:mt-14 lg:grid-cols-6 lg:gap-x-8">
          {facilities.map((facility) => (
            <div key={facility.title} className="grid place-items-center">
              <div
                className={`grid h-[88px] w-[88px] place-items-center rounded-full border-[5px] border-white text-white shadow-[0_10px_18px_rgba(6,35,58,.16)] ring-1 ring-[#06233a]/15 sm:h-[98px] sm:w-[98px] ${facility.color}`}
              >
                <facility.Icon
                  className="h-9 w-9 sm:h-10 sm:w-10"
                  strokeWidth={1.9}
                  aria-hidden="true"
                />
              </div>
              <p className="mt-5 text-[13px] font-semibold uppercase leading-tight text-[#06233a] sm:text-sm">
                {facility.title}
                <span className="block">{facility.subtitle}</span>
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
