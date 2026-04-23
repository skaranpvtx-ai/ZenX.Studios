import { motion } from "framer-motion"; 
import { Link } from "react-router-dom";
import { Mail, MessageSquare, Instagram, Linkedin, Send, Loader2, CheckCircle2 } from "lucide-react";
import React, { useState, useEffect } from "react";
import { supabase } from "../supabase"; 

export default function Contact() {
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "AI Automation",
    message: ""
  });

  // --- NEW: State to hold social media links from database ---
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    const fetchSocials = async () => {
      const { data } = await supabase.from('social_links').select('*');
      if (data) {
        // Convert array to an easy dictionary: { "Instagram": "url", "LinkedIn": "url" }
        const linksObj: Record<string, string> = {};
        data.forEach(item => linksObj[item.platform] = item.url);
        setSocialLinks(linksObj);
      }
    };
    fetchSocials();
  }, []);
  // -----------------------------------------------------------

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('leads')
        .insert([
          { 
            name: formData.name, 
            email: formData.email, 
            subject: formData.subject,
            message: formData.message 
          }
        ]);

      if (error) {
        alert("Oops! Something went wrong: " + error.message);
      } else {
        setSubmitted(true);
        setFormData({ name: "", email: "", subject: "AI Automation", message: "" });
      }
    } catch (error) {
      console.error("Failed to submit contact:", error);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="max-w-3xl mb-16">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Let's Build Your <br />
            <span className="gradient-text">Future System</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50"
          >
            Ready to automate? Send us a message or book a direct demo call.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            className="glass p-8 md:p-12"
          >
            {submitted ? (
              <div className="text-center py-12">
                <div className="w-20 h-20 rounded-full gradient-bg flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-primary/30">
                  <CheckCircle2 size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-black mb-4 tracking-tight">Message Sent!</h3>
                <p className="text-white/50 mb-8 leading-relaxed">
                  Thanks for reaching out. Our team will get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="w-full py-4 rounded-xl glass font-black text-lg hover:bg-white/10 transition-all"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Name</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-white/40">Email</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="john@example.com"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Subject</label>
                  <select 
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors appearance-none"
                  >
                    <option className="bg-background">AI Automation</option>
                    <option className="bg-background">Website Development</option>
                    <option className="bg-background">AI Integration</option>
                    <option className="bg-background">Other Inquiry</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-white/40">Message</label>
                  <textarea
                    rows={5}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your business bottlenecks..."
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors resize-none"
                  />
                </div>
                <button 
                  disabled={submitting}
                  className="w-full py-4 rounded-xl gradient-bg font-bold flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform shadow-lg shadow-primary/20"
                >
                  {submitting ? <Loader2 className="animate-spin" size={18} /> : "Send Message"} <Send size={18} />
                </button>
              </form>
            )}
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-8"
          >
            <div className="glass p-8 glass-hover">
              <h3 className="text-xl font-bold mb-6">Direct Contact</h3>
              <div className="space-y-6">
                <a href="#" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500 group-hover:bg-green-500 group-hover:text-white transition-all">
                    <MessageSquare size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase font-bold">WhatsApp</p>
                    <p className="font-medium">+91 98765 43210</p>
                  </div>
                </a>
                <a href="mailto:hello@zenxstudios.ai" className="flex items-center gap-4 group">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                    <Mail size={24} />
                  </div>
                  <div>
                    <p className="text-xs text-white/40 uppercase font-bold">Email</p>
                    <p className="font-medium">hello@zenxstudios.ai</p>
                  </div>
                </a>
              </div>
            </div>

            <div className="glass p-8 glass-hover">
              <h3 className="text-xl font-bold mb-6">Follow Our Journey</h3>
              <div className="flex gap-4">
                {/* --- NEW: Social Icons dynamically pulling from Database! --- */}
                <a 
                  href={socialLinks['Instagram'] || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Instagram size={24} />
                </a>
                <a 
                  href={socialLinks['LinkedIn'] || '#'} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="w-12 h-12 rounded-xl glass flex items-center justify-center hover:text-primary transition-colors"
                >
                  <Linkedin size={24} />
                </a>
                {/* ---------------------------------------------------------- */}
              </div>
            </div>

            <div className="p-8 gradient-bg rounded-3xl shadow-2xl shadow-primary/20 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-2xl font-bold mb-2">Book a 15-min Demo</h3>
                <p className="text-white/80 text-sm mb-6">Let's see if we're a good fit for your business.</p>
                <Link 
                  to="/booking"
                  className="inline-block px-8 py-3 bg-white text-background font-bold rounded-full hover:bg-white/90 transition-all hover:scale-105"
                >
                  Schedule Now
                </Link>
              </div>
              <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}