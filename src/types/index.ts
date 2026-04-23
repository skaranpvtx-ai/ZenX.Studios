import { ReactNode } from "react";

export interface Service {
  id: string;
  title: string;
  icon?: ReactNode;
  iconName?: string; // For dynamic loading if needed
  desc: string;
  features: string[];
  image: string;
}

export interface Project {
  id: string;
  title: string;
  category: string;
  image: string;
  problem: string;
  solution: string;
  result: string;
}

export interface PricingPlan {
  id: string;
  name: string;
  desc: string;
  monthlyPrice: string;
  yearlyPrice: string;
  features: string[];
  cta: string;
  popular?: boolean;
}

export interface BookingSlot {
  id: string;
  time: string;
  available: boolean;
}

export interface HomeData {
  problems: {
    title: string;
    desc: string;
    iconId: string;
  }[];
  steps: {
    number: string;
    title: string;
    desc: string;
    iconId: string;
  }[];
}

export interface AboutData {
  values: {
    title: string;
    desc: string;
    iconId: string;
  }[];
  philosophy: string;
}
