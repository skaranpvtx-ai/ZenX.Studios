import { motion } from "framer-motion"; // Changed to framer-motion!
import { Link } from "react-router-dom";
import { Target, Eye, Rocket, Heart, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { AboutData } from "../types";

// 1. IMPORT SUPABASE HERE
import { supabase } from "../supabase";

const iconMap: Record<string, any> = {
  target: <Target className="text-primary" />,
  eye: <Eye className="text-accent" />,
  rocket: <Rocket className="text-primary" />,
  heart: <Heart className="text-accent" />,
};

export default function About() {
  const [aboutData, setAboutData] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  // 2. CREATE A STATE TO HOLD YOUR CUSTOM IMAGE (with a fallback just in case)
  const[aboutImage, setAboutImage] = useState("https://picsum.photos/seed/zenx-team/800/800");

  useEffect(() => {
    const fetchAbout = async () => {
      try {
        const data = await api.getAboutData();
        setAboutData(data);

        // 3. GO TO SUPABASE AND GET THE "about_team" IMAGE
        const { data: imgData, error } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('image_key', 'about_team')
          .single(); // Grab exactly one

        // If we found it, update the state!
        if (imgData && imgData.image_url) {
          setAboutImage(imgData.image_url);
        }

      } catch (error) {
        console.error("Failed to fetch about data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchAbout();
  },[]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-8">
              About <span className="gradient-text">ZenX Studios</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-8">
              ZenX Studios was founded on a simple premise: technology should serve business growth, not complicate it.
            </p>
            <div className="space-y-6 text-white/50 leading-relaxed">
              <p>
                In an era where AI is rapidly changing the landscape, many businesses find themselves overwhelmed by the sheer volume of tools and possibilities. We bridge that gap.
              </p>
              <p>
                Our team of engineers and designers specialize in creating "invisible" systems—automations and interfaces that work seamlessly in the background, allowing business owners to reclaim their time and scale without limits.
              </p>
            </div>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative"
          >
            <div className="aspect-square rounded-3xl overflow-hidden glass p-4">
              
              {/* 4. THE MAGIC IS HERE! We use the aboutImage variable */}
              <img
                src={aboutImage}
                alt="Our Team"
                className="w-full h-full object-cover rounded-2xl opacity-50"
                referrerPolicy="no-referrer"
              />
              {/* -------------------------------------------------------- */}

              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 mix-blend-overlay" />
            </div>
            <div className="absolute -bottom-6 -right-6 glass p-6 shadow-2xl">
              <p className="text-3xl font-bold">2024</p>
              <p className="text-xs text-white/40 uppercase tracking-widest">Est. Year</p>
            </div>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {aboutData?.values.map((value, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="glass p-8 glass-hover"
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mb-6">
                {iconMap[value.iconId]}
              </div>
              <h3 className="text-xl font-bold mb-4">{value.title}</h3>
              <p className="text-sm text-white/50 leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 glass p-12 md:p-20 text-center rounded-[40px] relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5 -z-10" />
          <h2 className="text-4xl md:text-5xl font-black mb-8">Our Philosophy</h2>
          <p className="text-2xl text-white/60 max-w-4xl mx-auto leading-relaxed italic font-light mb-12">
            "{aboutData?.philosophy}"
          </p>
          <Link 
            to="/booking"
            className="inline-block px-10 py-5 rounded-2xl gradient-bg font-bold text-lg hover:scale-105 transition-transform hover-glow"
          >
            Work With Us
          </Link>
        </motion.div>
      </div>
    </div>
  );
}