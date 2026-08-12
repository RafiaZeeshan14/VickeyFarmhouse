import {
  AlertTriangle,
  CalendarCheck,
  Clock,
  ShieldCheck,
  Trash2,
  UsersRound,
  Volume2,
  Waves,
  type LucideIcon,
} from "lucide-react";

interface FarmhouseTerm {
  Icon: LucideIcon;
  title: string;
  description: string;
}

export const farmhouseTerms: FarmhouseTerm[] = [
  {
    Icon: CalendarCheck,
    title: "Advance Booking",
    description: "Booking confirmation requires advance payment.",
  },
  {
    Icon: Clock,
    title: "Check-in & Check-out",
    description: "Guests must follow the confirmed booking time slot.",
  },
  {
    Icon: UsersRound,
    title: "Guest Limit",
    description: "Extra guests may require additional charges.",
  },
  {
    Icon: Waves,
    title: "Pool Safety",
    description: "Children must be supervised by adults near the pool.",
  },
  {
    Icon: Volume2,
    title: "Sound Policy",
    description: "Loud music is not allowed after the permitted time.",
  },
  {
    Icon: Trash2,
    title: "Cleanliness",
    description: "Guests are requested to keep the farmhouse clean.",
  },
  {
    Icon: AlertTriangle,
    title: "Damage Policy",
    description: "Any damage to property will be charged separately.",
  },
  {
    Icon: ShieldCheck,
    title: "Security Rules",
    description: "Management is not responsible for personal belongings.",
  },
];
