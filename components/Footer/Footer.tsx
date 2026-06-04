import Image from "next/image";
import {
  Clock,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  Share2,
  Video,
} from "lucide-react";

const quickLinks = [
  "Home",
  "About Us",
  "Facilities",
  "Pricing",
  "Gallery",
  "Location",
  "Contact Us",
];

const socialLinks = [
  { Icon: Share2, label: "Facebook" },
  { Icon: Send, label: "Instagram" },
  { Icon: Video, label: "YouTube" },
  { Icon: MessageCircle, label: "WhatsApp" },
];

export default function Footer() {
  return (
    <footer className="bg-[#06233a] px-4 pt-14 text-white sm:px-6 lg:px-8">
      <div className="mx-auto grid max-w-7xl gap-10 pb-10 lg:grid-cols-[1.15fr_0.9fr_1.3fr_1fr] lg:gap-12">
        <div>
          <a
            className="relative block h-28 w-52 overflow-hidden"
            href="#"
            aria-label="Vicky Farmhouse home"
          >
            <Image
              className="absolute left-1/2 top-1/2 h-[440px] w-[440px] max-w-none -translate-x-1/2 -translate-y-1/2 object-contain"
              src="/vlogo.png"
              alt="Vicky Farmhouse"
              width={2000}
              height={2000}
            />
          </a>
          <p className="mt-4 max-w-xs text-sm font-semibold leading-7 text-white/72">
            Vicky Farmhouse is your perfect getaway for picnics, parties, and
            peaceful stays surrounded by nature.
          </p>
        </div>

        <div className="border-white/10 lg:border-l lg:pl-12">
          <h3 className="text-base font-black uppercase">Quick Links</h3>
          <nav className="mt-5 grid gap-2.5">
            {quickLinks.map((link) => (
              <a
                key={link}
                className="text-sm font-semibold text-white/72 transition-colors hover:text-[#e6a334]"
                href="#"
              >
                {link}
              </a>
            ))}
          </nav>
        </div>

        <div className="border-white/10 lg:border-l lg:pl-12">
          <h3 className="text-base font-black uppercase">Contact Us</h3>
          <div className="mt-5 grid gap-4">
            <div className="grid grid-cols-[34px_auto] gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a334] text-[#06233a]">
                <MapPin className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="text-sm font-semibold leading-6 text-white/76">
                358R+X3V, A Rehman Gabol Goth Gadap Town, Karachi
              </span>
            </div>
            <div className="grid grid-cols-[34px_auto] items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a334] text-[#06233a]">
                <Phone className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="text-sm font-semibold text-white/76">
               +92 3712108053
              </span>
            </div>
            <div className="grid grid-cols-[34px_auto] items-center gap-3">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#e6a334] text-[#06233a]">
                <Mail className="h-4 w-4" strokeWidth={2.4} />
              </span>
              <span className="text-sm font-semibold text-white/76">
                Vickyyfarmhouse@gmail.com
              </span>
            </div>
          </div>

          <div className="mt-6 flex gap-3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                className="grid h-10 w-10 place-items-center rounded-full bg-white text-[#06233a] transition-colors hover:bg-[#e6a334]"
                href="#"
                aria-label={social.label}
              >
                <social.Icon className="h-5 w-5" strokeWidth={2.2} />
              </a>
            ))}
          </div>
        </div>

        <div className="border-white/10 lg:border-l lg:pl-12">
          <h3 className="text-base font-black uppercase">Opening Hours</h3>
          <div className="mt-8 grid grid-cols-[34px_auto] gap-3">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/10 text-[#e6a334]">
              <Clock className="h-4 w-4" strokeWidth={2.4} />
            </span>
            <p className="text-sm font-bold leading-7 text-white/78">
              Monday - Sunday
              <span className="block">8.00 AM - 10:00 PM</span>
            </p>
          </div>

          <a
            className="mt-10 inline-flex min-h-12 w-full items-center justify-center rounded-full bg-[#e6a334] px-8 text-[13px] font-black uppercase text-[#06233a] shadow-[0_12px_22px_rgba(0,0,0,.22)] transition-colors hover:bg-white"
            href="#"
          >
            Book Now
          </a>
        </div>
      </div>

      <div className="border-t border-white/10 py-5 text-center text-sm font-semibold text-white/58">
        © 2026 Vicky Farmhouse. All Rights Reserved.
      </div>
    </footer>
  );
}
