import { motion, AnimatePresence } from "framer-motion"; // Changed to framer-motion!
import { Check, Zap, Rocket, Crown, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../supabase";

const iconMap: Record<string, any> = {
  Starter: <Zap className="text-primary" />,
  Growth: <Rocket className="text-accent" />,
  Pro: <Crown className="text-primary" />,
};

// We define what the Supabase data looks like
interface SupabasePlan {
  id: number;
  name: string;
  desc: string;
  monthlyPrice: string;
  yearlyPrice: string;
  popular: boolean;
  cta: string;
  features: string[]; // Supabase returns the JSONB array automatically as string[]
}

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);
  const [plans, setPlans] = useState<SupabasePlan[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPricing = async () => {
      try {
        // GO FETCH FROM SUPABASE 'pricing_plans' TABLE!
        const { data, error } = await supabase
          .from('pricing_plans')
          .select('*')
          .order('id', { ascending: true }); // Keep them in order (Starter, Growth, Pro)

        if (error) {
          throw error;
        }

        if (data) {
          setPlans(data as SupabasePlan[]);
        }
      } catch (error) {
        console.error("Failed to fetch pricing:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPricing();
  }, []);

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-black mb-8 tracking-tighter"
          >
            INVEST IN <span className="gradient-text">SPEED</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 font-medium mb-12"
          >
            Choose the tier that aligns with your scaling objectives.
          </motion.p>

          {/* Toggle Switch */}
          <div className="flex items-center justify-center gap-4 mb-16">
            <span className={`text-sm font-bold tracking-widest uppercase ${!isYearly ? "text-white" : "text-white/30"}`}>Monthly</span>
            <button 
              onClick={() => setIsYearly(!isYearly)}
              className="w-16 h-8 rounded-full bg-white/5 border border-white/10 relative p-1 transition-colors hover:border-primary/50"
            >
              <motion.div 
                animate={{ x: isYearly ? 32 : 0 }}
                className="w-6 h-6 rounded-full gradient-bg shadow-lg"
              />
            </button>
            <span className={`text-sm font-bold tracking-widest uppercase ${isYearly ? "text-white" : "text-white/30"}`}>
              Yearly <span className="text-[10px] text-primary ml-1">(Save 20%)</span>
            </span>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            
            {/* If no plans exist yet, show a fallback message */}
            {plans.length === 0 ? (
               <div className="col-span-3 text-center py-10 text-white/50">
                 No pricing plans found. Add them in Supabase!
               </div>
            ) : (
              plans.map((plan, idx) => (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className={`glass p-10 relative flex flex-col glass-hover ${plan.popular ? "border-primary/50 shadow-2xl shadow-primary/10 scale-105 z-10" : "border-white/5"}`}
                >
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-6 py-1.5 rounded-full gradient-bg text-[10px] font-black uppercase tracking-widest shadow-xl">
                      Most Popular
                    </div>
                  )}
  
                  <div className="mb-10">
                    <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8">
                      {iconMap[plan.name] || <Zap className="text-primary" />}
                    </div>
                    <h3 className="text-3xl font-black mb-3 tracking-tight">{plan.name}</h3>
                    <p className="text-sm text-white/40 mb-8 font-medium leading-relaxed">{plan.desc}</p>
                    
                    <div className="h-16 flex items-baseline gap-2 overflow-hidden">
                      <AnimatePresence mode="wait">
                        <motion.div
                          key={isYearly ? "yearly" : "monthly"}
                          initial={{ y: 20, opacity: 0 }}
                          animate={{ y: 0, opacity: 1 }}
                          exit={{ y: -20, opacity: 0 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-baseline gap-2"
                        >
                          <span className="text-5xl font-black tracking-tighter">
                            {isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                          </span>
                          {/* If the price says "Custom", we don't want to show "/ mo" next to it */}
                          {plan.monthlyPrice !== "Custom" && plan.yearlyPrice !== "Custom" && (
                            <span className="text-white/30 text-sm font-bold uppercase tracking-widest">
                              / {isYearly ? "year" : "mo"}
                            </span>
                          )}
                        </motion.div>
                      </AnimatePresence>
                    </div>
                  </div>
  
                  <ul className="space-y-5 mb-12 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-4 text-sm text-white/70 font-medium">
                        <Check size={18} className="text-primary mt-0.5 shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
  
                  <Link
                    to="/booking"
                    className={`w-full py-5 rounded-2xl font-black text-lg text-center transition-all ${
                      plan.popular
                        ? "gradient-bg shadow-2xl shadow-primary/30 hover:scale-[1.02] hover-glow"
                        : "glass hover:bg-white/10"
                    }`}
                  >
                    {plan.cta}
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        )}

        <div className="mt-32 glass p-16 text-center max-w-4xl mx-auto rounded-[40px] relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-3xl" />
          <h3 className="text-3xl font-black mb-6 tracking-tight">Need a Custom Solution?</h3>
          <p className="text-lg text-white/50 mb-10 font-medium leading-relaxed">
            We build bespoke AI ecosystems tailored to your specific business logic and industry requirements.
          </p>
          <Link to="/contact" className="inline-flex items-center gap-3 text-primary font-black text-xl hover:gap-6 transition-all">
            Schedule a Strategy Audit <ArrowRight size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
}