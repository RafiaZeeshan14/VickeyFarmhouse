import bbqAreaImage from "@/public/bbqarea.png";
import bonfireAreaImage from "@/public/bonfirearea.png";
import diningAreaImage from "@/public/diningarea.png";
import gallery01Image from "@/public/gallery01.png";
import gallery02Image from "@/public/gallery02.png";
import gallery03Image from "@/public/gallery03.png";
import outdoorAreaImage from "@/public/outdoorar.png";
import playAreaImage from "@/public/playarea.png";
import poolAreaImage from "@/public/poolarea.png";
import spaciousLawnImage from "@/public/spaciouslawn.png";
import swimmingPoolImage from "@/public/swimmingpool.png";
import parkingImage from "@/public/parking.png";

export const galleryImages = [
  { src: outdoorAreaImage, alt: "Outdoor lawn and farmhouse rooms" },
  { src: gallery01Image, alt: "Vicky Farmhouse lawn and play area" },
  { src: gallery02Image, alt: "Vicky Farmhouse illuminated gazebo" },
  { src: gallery03Image, alt: "Vicky Farmhouse poolside lawn seating" },
  { src: poolAreaImage, alt: "Aerial view of the farmhouse pools" },
  { src: swimmingPoolImage, alt: "Covered swimming pool at night" },
  { src: spaciousLawnImage, alt: "Spacious circular farmhouse lawn" },
  { src: diningAreaImage, alt: "Covered dining and gathering area" },
  { src: bbqAreaImage, alt: "BBQ and outdoor gathering area" },
  { src: bonfireAreaImage, alt: "Farmhouse bonfire area" },
  { src: playAreaImage, alt: "Children's outdoor play area" },
  { src: parkingImage, alt: "Farmhouse parking area" },
] as const;
