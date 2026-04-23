import { Service, Project, PricingPlan, BookingSlot, HomeData, AboutData } from "../types";

// Mock data that would normally come from an API
const SERVICES: Service[] = [
  {
    id: "automation",
    title: "AI Automation",
    desc: "Streamline your business operations with intelligent workflows that never sleep.",
    features: [
      "WhatsApp & SMS Automation",
      "Lead Capture & Qualification Systems",
      "Automated CRM Workflows",
      "Email Marketing Automation"
    ],
    image: "https://picsum.photos/seed/automation/800/600"
  },
  {
    id: "web",
    title: "Website Development",
    desc: "We build high-performance, conversion-focused websites that act as your 24/7 salesperson.",
    features: [
      "Custom Landing Pages",
      "Full Business Websites",
      "Conversion Rate Optimization (CRO)",
      "Modern, Responsive Design"
    ],
    image: "https://picsum.photos/seed/webdev/800/600"
  },
  {
    id: "integrations",
    title: "AI Integrations",
    desc: "Connect the power of Large Language Models directly into your existing business stack.",
    features: [
      "Custom AI Chatbots",
      "API & Third-party Integrations",
      "Intelligent Data Dashboards",
      "AI-Powered Content Systems"
    ],
    image: "https://picsum.photos/seed/ai-integration/800/600"
  }
];

const PROJECTS: Project[] = [
  {
    id: "1",
    title: "Gym Automation System",
    category: "AI Automation",
    problem: "Manual tracking of trial bookings and follow-ups led to 30% lead leakage.",
    solution: "Implemented automated WhatsApp follow-up sequences and Google Sheets integration.",
    result: "Improved lead retention by 40% and saved 15 hours of manual work weekly.",
    image: "https://picsum.photos/seed/gym/800/600"
  },
  {
    id: "2",
    title: "Coaching Funnel",
    category: "Web Dev & Automation",
    problem: "High traffic but low conversion due to a complex, non-responsive lead system.",
    solution: "Built a high-converting landing page with integrated AI lead scoring.",
    result: "Increased conversion rate from 2% to 8.5% within the first month.",
    image: "https://picsum.photos/seed/coach/800/600"
  },
  {
    id: "3",
    title: "Local Business Website",
    category: "Web Development",
    problem: "No online presence; relying solely on word-of-mouth in a digital age.",
    solution: "Modern, SEO-optimized business website with automated inquiry handling.",
    result: "Generated 25+ qualified inquiries in the first 2 weeks of launch.",
    image: "https://picsum.photos/seed/local/800/600"
  }
];

const PRICING_PLANS: PricingPlan[] = [
  {
    id: "starter",
    name: "Starter",
    monthlyPrice: "₹5,000",
    yearlyPrice: "₹4,000",
    desc: "Perfect for small businesses starting their digital journey.",
    features: [
      "Modern Landing Page",
      "Mobile Responsive Design",
      "Basic SEO Setup",
      "Contact Form Integration",
      "1 Month Support"
    ],
    cta: "Get Started",
    popular: false
  },
  {
    id: "growth",
    name: "Growth",
    monthlyPrice: "₹10,000",
    yearlyPrice: "₹8,000",
    desc: "The sweet spot for scaling businesses needing automation.",
    features: [
      "Full Business Website",
      "Basic AI Automation",
      "Lead Capture System",
      "CRM Integration",
      "3 Months Support",
      "Performance Dashboard"
    ],
    cta: "Most Popular",
    popular: true
  },
  {
    id: "pro",
    name: "Pro",
    monthlyPrice: "₹20,000+",
    yearlyPrice: "₹16,000+",
    desc: "Full-scale AI ecosystem for enterprises ready to dominate.",
    features: [
      "Custom AI System",
      "WhatsApp Automation",
      "Advanced AI Chatbots",
      "Full Stack Development",
      "Priority 24/7 Support",
      "Continuous Optimization"
    ],
    cta: "Contact for Quote",
    popular: false
  }
];

const BOOKING_SLOTS: BookingSlot[] = [
  { id: "1", time: "09:00 AM", available: true },
  { id: "2", time: "10:00 AM", available: true },
  { id: "3", time: "11:00 AM", available: false },
  { id: "4", time: "01:00 PM", available: true },
  { id: "5", time: "02:00 PM", available: true },
  { id: "6", time: "03:00 PM", available: true },
  { id: "7", time: "04:00 PM", available: false },
  { id: "8", time: "05:00 PM", available: true }
];

// Simulated API calls with delay
export const api = {
  getServices: async (): Promise<Service[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(SERVICES), 500);
    });
  },
  getProjects: async (): Promise<Project[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PROJECTS), 500);
    });
  },
  getPricing: async (): Promise<PricingPlan[]> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve(PRICING_PLANS), 500);
    });
  },
  getBookingSlots: async (date: string): Promise<BookingSlot[]> => {
    console.log(`Fetching slots for ${date}`);
    return new Promise((resolve) => {
      setTimeout(() => resolve(BOOKING_SLOTS), 500);
    });
  },
  submitBooking: async (data: any): Promise<{ success: boolean; message: string }> => {
    console.log("Submitting booking:", data);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: "Booking confirmed!" }), 1000);
    });
  },
  submitContact: async (data: any): Promise<{ success: boolean; message: string }> => {
    console.log("Submitting contact form:", data);
    return new Promise((resolve) => {
      setTimeout(() => resolve({ success: true, message: "Message sent!" }), 1000);
    });
  },
  getHomeData: async (): Promise<HomeData> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        problems: [
          {
            title: "Losing leads due to slow response",
            desc: "Every minute you wait to respond, your lead gets colder. Our AI responds in seconds.",
            iconId: "zap"
          },
          {
            title: "Manual repetitive work",
            desc: "Stop wasting hours on data entry and scheduling. Let automation handle the grunt work.",
            iconId: "layers"
          },
          {
            title: "No proper business system",
            desc: "Fragmented tools lead to chaos. We build unified systems that scale with you.",
            iconId: "cpu"
          }
        ],
        steps: [
          {
            number: "01",
            title: "Analyze",
            desc: "We audit your existing manual bottlenecks and map out a digital blueprint for growth.",
            iconId: "users"
          },
          {
            number: "02",
            title: "Build",
            desc: "Rapid development of workflows and interfaces, connecting your entire tech ecosystem.",
            iconId: "cpu"
          },
          {
            number: "03",
            title: "Scale",
            desc: "Continuous monitoring and optimization to ensure your systems evolve as you expand.",
            iconId: "trending"
          }
        ]
      }), 500);
    });
  },
  getAboutData: async (): Promise<AboutData> => {
    return new Promise((resolve) => {
      setTimeout(() => resolve({
        values: [
          {
            title: "Mission",
            desc: "To simplify business systems using AI and automation, making growth accessible to every ambitious company.",
            iconId: "target"
          },
          {
            title: "Vision",
            desc: "To build the world's most scalable digital systems that empower humans to focus on creativity while AI handles the rest.",
            iconId: "eye"
          },
          {
            title: "Innovation",
            desc: "We stay at the bleeding edge of AI tech to ensure our clients are always two steps ahead of their competition.",
            iconId: "rocket"
          },
          {
            title: "Integrity",
            desc: "We build systems that are ethical, transparent, and designed for long-term sustainable success.",
            iconId: "heart"
          }
        ],
        philosophy: "We don't just build software; we engineer freedom. Freedom from repetitive tasks, freedom from lead leakage, and freedom to scale your vision."
      }), 500);
    });
  }
};
