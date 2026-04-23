import { motion } from "framer-motion"; // Changed to framer-motion!
import { MessageSquare, Globe, Cpu, CheckCircle2, ArrowRight, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { api } from "../services/api";
import { Service } from "../types";

// 1. IMPORT SUPABASE HERE
import { supabase } from "../supabase";

const iconMap: Record<string, any> = {
  automation: <MessageSquare size={40} className="text-primary" />,
  web: <Globe size={40} className="text-accent" />,
  integrations: <Cpu size={40} className="text-primary" />,
};

export default function Services() {
  const[services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        // 2. Get your existing text data
        const data = await api.getServices();

        // 3. Get all your custom images from Supabase!
        const { data: dbImages, error } = await supabase
          .from('site_images')
          .select('*');

        if (error) {
          console.error("Supabase Error:", error);
        }

        // 4. THE MAGIC: Merge them together!
        const updatedServices = data.map((service) => {
          // Look for an image_key that matches "service_automation", "service_web", etc.
          const customImage = dbImages?.find(img => img.image_key === `service_${service.id}`);

          return {
            ...service,
            // If we found a custom image in Supabase, use it! Otherwise, fallback to the old fake one.
            image: customImage ? customImage.image_url : service.image
          };
        });

        // Save the perfectly merged data to be displayed
        setServices(updatedServices);
      } catch (error) {
        console.error("Failed to fetch services:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchServices();
  },[]);

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Our <span className="gradient-text">Services</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50 leading-relaxed"
          >
            We provide the digital infrastructure needed to thrive in an automated world. From simple landing pages to complex AI ecosystems.
          </motion.p>
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="space-y-32">
            {services.map((service, idx) => (
              <motion.section
                key={service.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className={`flex flex-col ${idx % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"} gap-16 items-center`}
              >
                <div className="flex-1">
                  <div className="mb-6">{iconMap[service.id] || <Cpu size={40} className="text-primary" />}</div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">{service.title}</h2>
                  <p className="text-lg text-white/60 mb-8 leading-relaxed">
                    {service.desc}
                  </p>
                  <ul className="space-y-4 mb-10">
                    {service.features.map((feature, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <CheckCircle2 className="text-primary" size={20} />
                        <span className="text-white/80">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Link
                    to="/booking"
                    className="inline-flex items-center gap-2 px-8 py-4 rounded-xl gradient-bg font-bold hover:scale-105 transition-transform hover-glow"
                  >
                    Book a Demo <ArrowRight size={20} />
                  </Link>
                </div>
                <div className="flex-1 w-full">
                  <div className="aspect-video rounded-3xl overflow-hidden glass p-2 relative group">
                    <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 opacity-0 group-hover:opacity-100 transition-opacity z-10" />
                    
                    {/* The image is now pulling your dynamic Supabase link! */}
                    <img
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity"
                      referrerPolicy="no-referrer"
                    />
                    
                  </div>
                </div>
              </motion.section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}