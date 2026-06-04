import Image from "next/image";

const galleryImages = [
  {
    src: "/villa1.jpg",
    alt: "Vicky Farmhouse pool area",
  },
  {
    src: "/villa2.jpg",
    alt: "Vicky Farmhouse outdoor lawn seating",
  },
  {
    src: "/villa3.jpg",
    alt: "Vicky Farmhouse evening event setup",
  },
  {
    src: "/villa4.jpg",
    alt: "Vicky Farmhouse indoor room",
  },
  {
    src: "/villa5.jpg",
    alt: "Vicky Farmhouse garden pathway",
  },
  {
    src: "/villa6.jpg",
    alt: "Vicky Farmhouse outdoor dining setup",
  },
  {
    src: "/villa7.jpg",
    alt: "Vicky Farmhouse outdoor setup",
  },
{
    src: "/villa8.jpg",
    alt: "Vicky Farmhouse indoor dining setup",
  },
];

export default function Gallery() {
  return (
    <section
      id="gallery"
      className="relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-20"
    >
      <div className="mx-auto max-w-7xl text-center">
        <p className="mb-2 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]">
          Gallery
        </p>

        <h2 className="mx-auto max-w-5xl text-[clamp(30px,6vw,52px)] font-black uppercase leading-[1.04] tracking-normal">
          Glimpses Of{" "}
          <span className="text-[#e6a334]">Vicky Farmhouse</span>
        </h2>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:mt-12 lg:grid-cols-4 xl:gap-5">
          {galleryImages.map((image) => (
            <div
              key={image.src}
              className="group relative aspect-[16/9] overflow-hidden rounded-lg bg-white shadow-[0_14px_34px_rgba(6,35,58,.12)] ring-1 ring-[#06233a]/8"
            >
              <Image
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                src={image.src}
                alt={image.alt}
                width={900}
                height={520}
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />
              <div className="absolute inset-0 bg-[#06233a]/0 transition-colors duration-300 group-hover:bg-[#06233a]/12" />
            </div>
          ))}
        </div>

        <a
          className="mt-9 inline-flex min-h-12 items-center justify-center gap-3 rounded-full bg-[#06233a] px-8 text-[13px] font-bold uppercase text-white shadow-[0_12px_22px_rgba(6,35,58,.18)] transition-colors hover:bg-[#e6a334] hover:text-[#06233a]"
          href="#gallery"
        >
          View More Photos
          <span aria-hidden="true">&gt;</span>
        </a>
      </div>
    </section>
  );
}
