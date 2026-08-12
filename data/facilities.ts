import {
  Baby,
  BedDouble,
  CarFront,
  ConciergeBell,
  Dices,
  Flame,
  MonitorPlay,
  // ShieldCheck,
  Trees,
  TreePalm,
  Trophy,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";
import type { StaticImageData } from "next/image";
import bbqAreaImage from "@/public/bbqarea.png";
import bonfireAreaImage from "@/public/bonfirearea.png";
import cricketPlaceImage from "@/public/cricketplace.png";
import diningAreaImage from "@/public/diningarea.png";
import gameImage from "@/public/game.jpg";
import outdoorAreaImage from "@/public/outdoorar.png";
import parkingImage from "@/public/parking.png";
import playAreaImage from "@/public/playarea.png";
import poolAreaImage from "@/public/poolarea.png";
import projectorScreenImage from "@/public/projectorscreen.png";
import roomImage from "@/public/room.jpg";
import spaciousLawnImage from "@/public/spaciouslawn.png";
import swimmingPoolImage from "@/public/swimmingpool.png";

export interface Facility {
  Icon: LucideIcon;
  title: string;
  description: string;
  image: StaticImageData;
  showFullImage?: boolean;
}

export const facilities: Facility[] = [
   {
    Icon: Waves,
    title: "Big Size Pool",
    description: "A spacious pool for a premium farmhouse experience.",
    image: poolAreaImage,
  },
  {
    Icon: TreePalm,
    title: "Spacious Lawns",
    description: "Expansive green spaces for relaxation & events.",
    image: spaciousLawnImage,
  },
  {
    Icon: BedDouble,
    title: "Comfortable Rooms",
    description: "Elegant stays with modern comforts.",
    image: roomImage,
  },
  {
    Icon: Dices,
    title: "Indoor Games",
    description: "Fun-filled games for all ages.",
    image: gameImage,
  },
  {
    Icon: ConciergeBell,
    title: "BBQ & Food Area",
    description: "Perfect food setup for family gatherings.",
    image: bbqAreaImage,
  },
  {
    Icon: CarFront,
    title: "Safe Parking Space",
    description: "Spacious & secure parking for your convenience.",
    image: parkingImage,
  },
  {
    Icon: MonitorPlay,
    title: "Projector Screen",
    description: "Enjoy movie nights, presentations, and family screenings.",
    image: projectorScreenImage,
  },
  {
    Icon: Baby,
    title: "Children Play Area",
    description: "A safe and fun outdoor space for kids to enjoy.",
    image: playAreaImage,
  },
  // {
  //   Icon: ShieldCheck,
  //   title: "24 Hours Security",
  //   description: "Secure environment with round-the-clock safety support.",
  //   image: securityImage,
  // },
  {
    Icon: Trophy,
    title: "Cricket Place",
    description: "Open cricket space for friendly matches and outdoor fun.",
    image: cricketPlaceImage,
  },
  // {
  //   Icon: Snowflake,
  //   title: "4–5 AC Rooms",
  //   description: "Comfortable air-conditioned rooms for a relaxing stay.",
  //   image: "/room.jpg",
  // },
  {
    Icon: Waves,
    title: "Children Pool",
    description: "A separate pool area designed for kids’ enjoyment.",
    image: swimmingPoolImage,
  },
  {
    Icon: Flame,
    title: "Bonfire Area",
    description: "A cozy bonfire setup for memorable evenings.",
    image: bonfireAreaImage,
  },
  {
    Icon: Utensils,
    title: "Dining Area",
    description: "Comfortable dining space for families and groups.",
    image: diningAreaImage,
  },
  {
    Icon: Trees,
    title: "Beautiful Interior & Garden",
    description: "Refreshing greenery with a calm and peaceful ambience.",
    image: outdoorAreaImage,
    // showFullImage: true,
  },
];
