import { CalendarDays, Moon, SunMedium, type LucideIcon } from "lucide-react";
import type { PriceKey } from "@/lib/pricing";

type ButtonStyle = "solid" | "outline";

export interface PricingPlan {
  Icon: LucideIcon;
  title: string;
  description: string;
  price: string;
  unit: string;
  accentText: string;
  accentBg: string;
  accentBorder: string;
  buttonHover: string;
  button: ButtonStyle;
  priceKey: PriceKey;
  bookingType: "fullday" | "day" | "night";
}

const greenTheme = {
  accentText: "text-[#5f9270]",
  accentBg: "bg-[#eaf2eb]",
  accentBorder: "border-[#5f9270]",
  buttonHover: "hover:border-[#5f9270] hover:bg-[#5f9270] hover:text-white",
  button: "outline",
} as const;

const goldTheme = {
  accentText: "text-[#e6a334]",
  accentBg: "bg-[#fff4df]",
  accentBorder: "border-[#e6a334]",
  buttonHover:
    "hover:border-[#e6a334] hover:bg-[#e6a334] hover:text-[#06233a]",
  button: "solid",
} as const;

const blueTheme = {
  accentText: "text-[#3f78b2]",
  accentBg: "bg-[#eaf2fb]",
  accentBorder: "border-[#3f78b2]",
  buttonHover: "hover:border-[#3f78b2] hover:bg-[#3f78b2] hover:text-white",
  button: "outline",
} as const;

export const pricingPlans: PricingPlan[] = [
  {
    Icon: CalendarDays,
    title: "Weekend 24 hrs",
    description: "24 Hours Full Experience",
    price: "RS 150,000",
    unit: "/ Weekend",
    priceKey: "weekend24Hrs",
    bookingType: "fullday",
    ...greenTheme,
  },
  {
    Icon: SunMedium,
    title: "Weekend 12 hrs (Day)",
    description: "12 Hours Day Experience",
    price: "RS 100,000",
    unit: "/ Weekend",
    priceKey: "weekend12HrsDay",
    bookingType: "day",
    ...goldTheme,
  },
  {
    Icon: Moon,
    title: "Weekend 12 hrs (Night)",
    description: "12 Hours Night Experience",
    price: "RS 120,000",
    unit: "/ Weekend",
    priceKey: "weekend12Hrs",
    bookingType: "night",
    ...blueTheme,
  },
  {
    Icon: CalendarDays,
    title: "Non Weekend 24 hrs",
    description: "24 Hours Full Experience",
    price: "RS 100,000",
    unit: "/ Day",
    priceKey: "nonWeekend24Hrs",
    bookingType: "fullday",
    ...greenTheme,
  },
  {
    Icon: SunMedium,
    title: "Non Weekend 12 hrs (Day)",
    description: "12 Hours Day Experience",
    price: "RS 65,000",
    unit: "/ Day",
    priceKey: "nonWeekend12HrsDay",
    bookingType: "day",
    ...goldTheme,
  },
  {
    Icon: Moon,
    title: "Non Weekend 12 hrs (Night)",
    description: "12 Hours Night Experience",
    price: "RS 75,000",
    unit: "/ Night",
    priceKey: "nonWeekend40Person12Hrs",
    bookingType: "night",
    ...blueTheme,
  },
];
