import {
  Baby,
  BedDouble,
  CarFront,
  ConciergeBell,
  Dices,
  Flame,
  MonitorPlay,
  ShieldCheck,
  Snowflake,
  Trees,
  TreePalm,
  Trophy,
  Utensils,
  Waves,
  type LucideIcon,
} from "lucide-react";

export interface Facility {
  Icon: LucideIcon;
  title: string;
  description: string;
  image: string;
}

export const facilities: Facility[] = [
  {
    Icon: Waves,
    title: "Swimming Pool",
    description: "Crystal-clear pool for a refreshing escape.",
    image: "/villa1.jpg",
  },
  {
    Icon: TreePalm,
    title: "Spacious Lawns",
    description: "Expansive green spaces for relaxation & events.",
    image: "/lawn.jpg",
  },
  {
    Icon: BedDouble,
    title: "Comfortable Rooms",
    description: "Elegant stays with modern comforts.",
    image: "/room.jpg",
  },
  {
    Icon: Dices,
    title: "Indoor Games",
    description: "Fun-filled games for all ages.",
    image: "/game.jpg",
  },
  {
    Icon: ConciergeBell,
    title: "BBQ & Food Area",
    description: "Perfect food setup for family gatherings.",
    image: "/bbq.jpg",
  },
  {
    Icon: CarFront,
    title: "Safe Parking Space",
    description: "Spacious & secure parking for your convenience.",
    image: "/car.jpg",
  },
  {
    Icon: MonitorPlay,
    title: "Projector Screen",
    description: "Enjoy movie nights, presentations, and family screenings.",
    image: "/screen.jpg",
  },
  {
    Icon: Baby,
    title: "Children Play Area",
    description: "A safe and fun outdoor space for kids to enjoy.",
    image: "/play.jpg",
  },
  {
    Icon: ShieldCheck,
    title: "24 Hours Security",
    description: "Secure environment with round-the-clock safety support.",
    image: "/security.jpg",
  },
  {
    Icon: Trophy,
    title: "Cricket Place",
    description: "Open cricket space for friendly matches and outdoor fun.",
    image: "/cricket.jpg",
  },
  {
    Icon: Snowflake,
    title: "4–5 AC Rooms",
    description: "Comfortable air-conditioned rooms for a relaxing stay.",
    image: "/room.jpg",
  },
  {
    Icon: Waves,
    title: "Children Pool",
    description: "A separate pool area designed for kids’ enjoyment.",
    image: "/villa1.jpg",
  },
  {
    Icon: Flame,
    title: "Bonfire Area",
    description: "A cozy bonfire setup for memorable evenings.",
    image: "/bonfire.jpg",
  },
  {
    Icon: Utensils,
    title: "Dining Area",
    description: "Comfortable dining space for families and groups.",
    image: "/dining.jpg",
  },
  {
    Icon: Trees,
    title: "Beautiful Lawn & Garden",
    description: "Refreshing greenery with a calm and peaceful ambience.",
    image: "/lawn.jpg",
  },
  {
    Icon: Waves,
    title: "Big Size Pool",
    description: "A spacious pool for a premium farmhouse experience.",
    image: "/villa1.jpg",
  },
];
