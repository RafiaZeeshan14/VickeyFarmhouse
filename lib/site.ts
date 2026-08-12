export const siteContact = {
  address: "358R+X3V, A Rehman Gabol Goth Gadap Town, Karachi",
  phone: "+92 3712108053",
  phoneHref: "tel:+923712108053",
  email: "Vickyfarmhouse@gmail.com",
  emailHref: "mailto:Vickyfarmhouse@gmail.com",
  whatsapp:
    "https://wa.me/923712108053?text=Hello%20I%20want%20to%20book%20Vicky%20Farmhouse",
  mapEmbed:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3614.0128470269665!2d67.1894532!3d25.0675537!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3eb34f006e3045f5%3A0xbef464f04a192b17!2sVicky%E2%80%99s%20Farmhouse%20Gadap!5e0!3m2!1sen!2s!4v1780569888939!5m2!1sen!2s",
} as const;

export const navigationLinks = [
  { label: "Home", href: "#" },
  { label: "About Us", href: "#aboutus" },
  { label: "Facilities", href: "#facilities" },
  { label: "Pricing", href: "#pricing" },
  { label: "Gallery", href: "#gallery" },
  { label: "Location", href: "#location" },
  { label: "Terms & Conditions", href: "#terms" },
  { label: "Contact", href: "#contact" },
] as const;

export const footerLinks = [
  { label: "Home", href: "/" },
  { label: "About Us", href: "/#aboutus" },
  { label: "Facilities", href: "/#facilities" },
  { label: "Pricing", href: "/#pricing" },
  { label: "Gallery", href: "/#gallery" },
  { label: "Location", href: "/#location" },
  { label: "Track Booking", href: "/track" },
  { label: "Contact Us", href: "/#contact" },
] as const;
