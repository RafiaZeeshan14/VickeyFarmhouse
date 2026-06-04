import Image from "next/image";
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
    title: "Swimming Pool",
    description: "Crystal-clear pool for a refreshing escape.",
    color: "bg-[#4f86d2]",
  },
  {
    Icon: TreePalm,
    title: "Spacious Lawns",
    description: "Expansive green spaces for relaxation & events.",
    color: "bg-[#559653]",
  },
  {
    Icon: BedDouble,
    title: "Comfortable Rooms",
    description: "Elegant stays with modern comforts.",
    color: "bg-[#eca323]",
  },
  {
    Icon: Dices,
    title: "Indoor Games",
    description: "Fun-filled games for all ages.",
    color: "bg-[#12375d]",
  },
  {
    Icon: ConciergeBell,
    title: "Delicious Food",
    description: "A variety of cuisines to satisfy every craving.",
    color: "bg-[#d73338]",
  },
  {
    Icon: CarFront,
    title: "Ample Parking",
    description: "Spacious & secure parking for your convenience.",
    color: "bg-[#559653]",
  },
];

export default function Facilities() {
  return (
    <section
      id="facilities"
      className="relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:min-h-[640px] lg:px-8 lg:pb-16 lg:pt-10"
    >
      
      

      <div className="absolute right-0 top-7 z-20 hidden rounded-l-[28px] bg-[#06233a] px-7 py-4 text-white shadow-xl lg:flex lg:items-center lg:gap-4">
        <ConciergeBell className="text-[#e6a334]" size={34} strokeWidth={1.9} />
        <span className="max-w-[150px] text-sm font-semibold leading-tight">
          Your Perfect Escape Awaits
        </span>
      </div>

      <div className="pointer-events-none absolute -left-24 top-28 z-10 hidden h-[440px] w-[440px] overflow-hidden rounded-full border-[14px] border-[#fbfaf7] shadow-[0_18px_45px_rgba(6,35,58,0.2)] lg:block xl:h-[470px] xl:w-[470px]">
        <Image
          src="/hero.png"
          alt="Vicky Farmhouse swimming pool"
          fill
          className="object-cover object-center"
          sizes="470px"
        />
      </div>

      <div className="pointer-events-none absolute -right-16 top-20 hidden h-[520px] w-[390px] opacity-[0.08] lg:block">
        <div className="absolute right-20 top-0 h-[500px] w-5 rotate-[28deg] rounded-full bg-[#06233a]" />
        {Array.from({ length: 10 }).map((_, index) => (
          <span
            key={index}
            className="absolute right-16 top-20 h-8 w-72 origin-right rounded-full bg-[#06233a]"
            style={{ transform: `rotate(${index * 13 - 50}deg)` }}
          />
        ))}
      </div>

      <div className="relative z-20 mx-auto max-w-7xl text-center lg:pl-[300px] lg:pt-24 xl:max-w-[1500px] xl:pl-[330px]">
        <div className="flex items-center justify-center gap-4 font-script text-4xl text-[#dca03a] sm:text-5xl">
          <span className="hidden h-px w-16 bg-[#dca03a] sm:block" />
          <span>Our Facilities</span>
          <span className="hidden h-px w-16 bg-[#dca03a] sm:block" />
        </div>

        <h2 className="mx-auto mt-4 max-w-5xl text-4xl font-extrabold uppercase leading-[1.08] tracking-wide text-[#06233a] sm:text-5xl lg:text-[54px] xl:text-[62px]">
          Everything You Need
          <br />
          For A <span className="text-[#e6a334]">Perfect Day Out!</span>
        </h2>

        <p className="mx-auto mt-5 max-w-3xl text-base font-medium leading-relaxed text-[#294258] sm:text-lg">
          Premium amenities designed for your comfort, enjoyment, and
          unforgettable moments.
        </p>

        <div className="mt-16 grid gap-x-6 gap-y-12 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 xl:gap-x-8">
          {facilities.map(({ Icon, title, description, color }) => (
            <article
              key={title}
              className="group relative rounded-[18px] border border-[#e6e0d4] bg-white/90 px-4 pb-6 pt-16 shadow-[0_12px_26px_rgba(6,35,58,0.12)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_18px_34px_rgba(6,35,58,0.18)]"
            >
              <span
                className={`absolute left-1/2 top-0 flex h-[86px] w-[86px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-[5px] border-white ${color} text-white shadow-[0_8px_20px_rgba(6,35,58,0.2)] ring-2 ring-[#e8e3da] transition duration-300 group-hover:scale-105`}
              >
                <Icon size={42} strokeWidth={2} />
              </span>

              <h3 className="text-[15px] font-extrabold uppercase leading-tight tracking-wide text-[#06233a]">
                {title}
              </h3>
              <p className="mt-3 text-[13px] font-medium leading-snug text-[#31475d]">
                {description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
