"use client";

import Image from "next/image";
import { motion, useMotionValue, animate } from "framer-motion";
import { useState } from "react";

const galleryImages = [
  { src: "/villa1.jpg", alt: "Vicky Farmhouse pool area" },
  { src: "/villa2.jpg", alt: "Vicky Farmhouse outdoor lawn seating" },
  { src: "/villa3.jpg", alt: "Vicky Farmhouse evening event setup" },
  { src: "/villa4.jpg", alt: "Vicky Farmhouse indoor room" },
  { src: "/villa5.jpg", alt: "Vicky Farmhouse garden pathway" },
  { src: "/villa6.jpg", alt: "Vicky Farmhouse outdoor dining setup" },
  { src: "/villa7.jpg", alt: "Vicky Farmhouse outdoor setup" },
  { src: "/villa8.jpg", alt: "Vicky Farmhouse indoor dining setup" },
];

export default function Gallery() {
  const [active, setActive] = useState(0);
  const dragX = useMotionValue(0);

  const goToSlide = (index: number) => {
    const nextIndex = (index + galleryImages.length) % galleryImages.length;
    setActive(nextIndex);
    animate(dragX, 0, { duration: 0.35, ease: "easeOut" });
  };

  const handleDragEnd = () => {
    const currentX = dragX.get();

    if (currentX < -80) {
      goToSlide(active + 1);
    } else if (currentX > 80) {
      goToSlide(active - 1);
    } else {
      animate(dragX, 0, { duration: 0.35, ease: "easeOut" });
    }
  };

  return (
    <section
      id="gallery"
      className="scroll-mt-28 relative overflow-hidden bg-[#fbfaf7] px-4 py-16 text-[#06233a] sm:px-6 lg:px-8 lg:py-24"
    >
      <div className="pointer-events-none absolute -left-24 top-20 h-80 w-80 rounded-full bg-[#e6a334]/15 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-96 w-96 rounded-full bg-[#2f9ad8]/12 blur-3xl" />

      <div className="relative mx-auto max-w-[1700px] overflow-hidden rounded-[34px] border border-white/70 bg-[linear-gradient(135deg,#ffffff_0%,#fffaf0_48%,#eef7ff_100%)] px-4 py-12 shadow-[0_30px_90px_rgba(6,35,58,.13)] sm:px-8 lg:px-12 lg:py-16">
        <div className="pointer-events-none absolute right-10 top-10 hidden text-[120px] font-black uppercase leading-none text-[#06233a]/[0.04] lg:block xl:text-[160px]">
          Gallery
        </div>

        <div className="relative z-10 mx-auto text-center">
          <motion.p
            className="mb-2 font-['Brush_Script_MT','Segoe_Script',cursive] text-[clamp(28px,6vw,42px)] italic leading-none text-[#e4a43b]"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: "easeOut" }}
          >
            Gallery
          </motion.p>

          <motion.h2
            className="mx-auto max-w-5xl text-[clamp(30px,6vw,56px)] font-black uppercase leading-[1.04] tracking-normal"
            initial={{ opacity: 0, y: 22 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.75, ease: "easeOut" }}
          >
            Glimpses Of <br />
            <span className="text-[#e6a334]">Vicky Farmhouse</span>
          </motion.h2>

          <p className="mx-auto mt-5 max-w-3xl text-[15px] font-medium leading-7 text-[#294258] sm:text-lg">
            Explore beautiful moments, relaxing spaces, and premium farmhouse
            vibes captured from every corner.
          </p>

          <div className="relative mx-auto mt-14 h-[430px] max-w-[1200px] overflow-hidden sm:h-[500px] lg:h-[580px] xl:h-[620px]">
            <motion.div
              className="relative flex h-full w-full items-center justify-center"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.12}
              style={{ x: dragX }}
              onDragEnd={handleDragEnd}
            >
              {galleryImages.map((image, index) => {
                let offset = index - active;

                if (offset > galleryImages.length / 2) {
                  offset -= galleryImages.length;
                } else if (offset < -galleryImages.length / 2) {
                  offset += galleryImages.length;
                }

                const isActive = offset === 0;

                return (
                  <motion.div
                    key={image.src}
                    className="absolute cursor-grab overflow-hidden rounded-[28px] bg-white shadow-[0_28px_80px_rgba(6,35,58,.22)] ring-1 ring-white/70 active:cursor-grabbing"
                    animate={{
                      x: offset * 210,
                      scale: isActive ? 1 : 0.76,
                      rotateY: offset * -20,
                      opacity: Math.abs(offset) > 3 ? 0 : isActive ? 1 : 0.42,
                      zIndex: 20 - Math.abs(offset),
                    }}
                    transition={{
                      duration: 0.7,
                      ease: [0.25, 1, 0.5, 1],
                    }}
                    style={{
                      width: "min(78vw, 470px)",
                      height: "min(72vw, 540px)",
                      transformStyle: "preserve-3d",
                    }}
                    onClick={() => goToSlide(index)}
                  >
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover"
                      sizes="(min-width: 1280px) 470px, (min-width: 1024px) 430px, 78vw"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-[#06233a]/55 via-black/5 to-transparent" />
                  </motion.div>
                );
              })}
            </motion.div>

            <button
              onClick={() => goToSlide(active - 1)}
              className="absolute left-2 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl font-bold text-[#06233a] shadow-lg transition hover:bg-[#e6a334] sm:left-6"
              aria-label="Previous image"
            >
              ‹
            </button>

            <button
              onClick={() => goToSlide(active + 1)}
              className="absolute right-2 top-1/2 z-40 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/90 text-2xl font-bold text-[#06233a] shadow-lg transition hover:bg-[#e6a334] sm:right-6"
              aria-label="Next image"
            >
              ›
            </button>

            <div className="absolute bottom-6 left-1/2 z-40 flex -translate-x-1/2 gap-2">
              {galleryImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => goToSlide(index)}
                  className={`h-2.5 rounded-full transition-all ${
                    active === index
                      ? "w-8 bg-[#e6a334]"
                      : "w-2.5 bg-[#06233a]/30"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}