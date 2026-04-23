import { motion, useScroll, useTransform, useMotionValue, useSpring } from "framer-motion"; 
import { ArrowRight, Zap, Layers, Cpu, CheckCircle2, TrendingUp, Users, MessageSquare, Play, Loader2, Star, Activity, GitMerge, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import { useRef, useEffect, useState } from "react";
import { api } from "../services/api";
import { Service, HomeData } from "../types";
import { supabase } from "../supabase";

const iconMap: Record<string, any> = {
  zap: <Zap className="text-primary" />,
  layers: <Layers className="text-accent" />,
  cpu: <Cpu className="text-primary" />,
  users: <Users size={24} />,
  trending: <TrendingUp size={24} />,
  "AI Automation": <TrendingUp size={32} className="text-primary" />,
  "Website Development": <Layers size={32} className="text-accent" />,
  "AI Integrations": <Cpu size={32} className="text-primary" />,
};

const serviceTags: Record<string, string[]> = {
  "AI Automation": ["WhatsApp", "Email", "CRM"],
  "Website Development": ["React", "Vite", "SEO"],
  "AI Integrations": ["GPT-4", "Voice AI", "NLP"],
};

function HomeContent({ homeData, services, smartImage, featuredProject, testimonials }: { homeData: HomeData; services: Service[]; smartImage: string; featuredProject: any; testimonials: any[] }) {
  const heroRef = useRef(null);
  
  // --- 3D MOUSE TRACKING FOR HERO UI ---
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  
  // Springs for buttery smooth mouse follow
  const springX = useSpring(mouseX, { stiffness: 40, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 40, damping: 20 });

  // Transforms for 3D Tilt effect
  const rotateX = useTransform(springY, [-500, 500], [10, -10]);
  const rotateY = useTransform(springX, [-500, 500], [-10, 10]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate mouse offset from center
      const x = e.clientX - window.innerWidth / 2;
      const y = e.clientY - window.innerHeight / 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, 200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -150]);
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  // Background orb inverse movement
  const reverseSpringX = useTransform(springX, (v) => -v * 0.5);
  const reverseSpringY = useTransform(springY, (v) => -v * 0.5);

  return (
    <div className="pt-20">
      {/* ========================================== */}
      {/* PREMIUM 3D UI HERO SECTION */}
      {/* ========================================== */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden py-20 perspective-[2000px]">
        
        {/* Dynamic Background Glows */}
        <motion.div 
          style={{ x: reverseSpringX, y: reverseSpringY }}
          className="absolute top-1/4 -left-20 w-[600px] h-[600px] bg-primary/20 blur-[150px] rounded-full pointer-events-none" 
        />
        <motion.div 
          style={{ x: springX, y: springY }}
          className="absolute bottom-1/4 -right-20 w-[600px] h-[600px] bg-accent/10 blur-[150px] rounded-full pointer-events-none" 
        />

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:40px_40px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />

        <div className="container mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-8 items-center relative z-10">
          
          {/* --- LEFT SIDE: PREMIUM TEXT --- */}
          <div className="relative h-full flex flex-col justify-center">
            <motion.div
              style={{ y: y1, opacity }}
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/10 text-xs font-bold text-white/80 mb-8 tracking-widest backdrop-blur-md">
                <Sparkles size={14} className="text-primary" />
                NEXT-GEN AUTOMATION STUDIO
              </div>
              
              <h1 className="text-5xl sm:text-6xl md:text-7xl font-black leading-[1.1] mb-8 tracking-tighter">
                AUTOMATE <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">GROWTH.</span> <br />
                BUILD SMARTER. <br />
                SCALE FASTER.
              </h1>
              
              <p className="text-lg md:text-xl text-white/60 mb-12 max-w-lg leading-relaxed font-medium">
                Zenx Studios builds AI systems, n8n automation workflows, and premium websites that grow modern businesses on autopilot.
              </p>
            </motion.div>

            {/* FIXED FLOATING DOCK */}
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="fixed bottom-6 left-4 right-4 md:bottom-10 md:left-1/2 md:right-auto md:-translate-x-1/2 z-[100] md:w-max"
            >
              <div className="flex items-center justify-between md:justify-center gap-2 md:gap-4 bg-black/60 md:bg-black/40 p-2 md:p-3 rounded-2xl md:rounded-full backdrop-blur-xl border border-white/10 shadow-[0_0_40px_rgba(0,0,0,0.8)]">
                <Link 
                  to="/booking" 
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-full bg-white text-black font-black text-sm md:text-base hover:scale-105 transition-all shadow-[0_0_20px_rgba(255,255,255,0.3)] whitespace-nowrap"
                >
                  <span className="md:hidden">Book Call</span>
                  <span className="hidden md:inline">Book Free Call</span>
                  <ArrowRight size={16} className="md:w-[18px] md:h-[18px]" />
                </Link>
                <Link 
                  to="/services" 
                  className="flex-1 md:flex-none flex justify-center items-center gap-2 px-6 md:px-8 py-3 md:py-4 rounded-xl md:rounded-full bg-white/[0.05] border border-white/10 text-white font-black text-sm md:text-base hover:bg-white/10 transition-all whitespace-nowrap"
                >
                  <Layers size={16} className="md:w-[18px] md:h-[18px]" /> 
                  <span>Explore Services</span>
                </Link>
              </div>
            </motion.div>
          </div>

          {/* --- RIGHT SIDE: 3D INTERACTIVE DASHBOARD CLUSTER --- */}
          <motion.div
            style={{ y: y2 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full h-[500px] lg:h-[700px] flex items-center justify-center perspective-[1000px]"
          >
            {/* 3D Wrapper connected to Mouse */}
            <motion.div 
              style={{ 
                rotateX, 
                rotateY, 
                transformStyle: "preserve-3d" 
              }}
              className="relative w-full max-w-[550px]"
            >
              
              {/* 1. MAIN DASHBOARD CARD */}
              <div 
                className="relative bg-[#0A0A0F]/80 backdrop-blur-2xl border border-white/10 rounded-3xl p-6 md:p-8 shadow-[0_0_50px_rgba(147,51,234,0.15)] overflow-hidden"
                style={{ transform: "translateZ(0px)" }}
              >
                {/* Dashboard Header */}
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-[#FF5F56]" />
                    <div className="w-3 h-3 rounded-full bg-[#FFBD2E]" />
                    <div className="w-3 h-3 rounded-full bg-[#27C93F]" />
                  </div>
                  <div className="text-sm font-bold text-white/80">Automation Dashboard</div>
                  <div className="flex items-center gap-2 text-xs font-black text-green-400 bg-green-400/10 px-2 py-1 rounded-md">
                    <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" /> LIVE
                  </div>
                </div>

                {/* Top Metrics */}
                <div className="grid grid-cols-3 gap-4 mb-10">
                  <div>
                    <h3 className="text-3xl font-black text-white">1,248</h3>
                    <p className="text-[10px] text-white/50 font-semibold mb-1">Leads Captured</p>
                    <span className="text-[10px] font-bold text-green-400">↑ 23%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">98%</h3>
                    <p className="text-[10px] text-white/50 font-semibold mb-1">Response Rate</p>
                    <span className="text-[10px] font-bold text-green-400">↑ 12%</span>
                  </div>
                  <div>
                    <h3 className="text-3xl font-black text-white">₹2.4L</h3>
                    <p className="text-[10px] text-white/50 font-semibold mb-1">Revenue Auto</p>
                    <span className="text-[10px] font-bold text-green-400">↑ 41%</span>
                  </div>
                </div>

                {/* Chart Area */}
                <div>
                  <p className="text-xs text-white/40 font-bold tracking-widest uppercase mb-6">Weekly Performance</p>
                  <div className="flex items-end justify-between gap-2 h-32">
                    {[40, 60, 45, 80, 100, 70, 50].map((height, i) => (
                      <motion.div
                        key={i}
                        initial={{ height: 0 }}
                        animate={{ height: `${height}%` }}
                        transition={{ duration: 1, delay: 0.5 + i * 0.1 }}
                        className={`w-full rounded-t-sm ${
                          height === 100 
                            ? "bg-gradient-to-t from-cyan-600 to-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.5)]" 
                            : "bg-gradient-to-t from-purple-900 to-primary/80"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* 2. FLOATING TASK CARD (Top Right) */}
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-12 -right-8 md:-right-16 bg-[#0A0A0F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-5 shadow-2xl z-20"
                style={{ transform: "translateZ(60px)" }} // Pops out in 3D
              >
                <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-2">Tasks Today</p>
                <div className="text-3xl font-black text-green-400 mb-2">+347</div>
                <div className="flex items-end gap-1 h-6">
                  {[30, 50, 40, 80, 60].map((h, i) => (
                    <div key={i} className="w-1.5 bg-green-500/50 rounded-full" style={{ height: `${h}%` }} />
                  ))}
                </div>
              </motion.div>

              {/* 3. FLOATING WORKFLOW CARD (Bottom Left) */}
              <motion.div
                animate={{ y: [0, 10, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -bottom-16 -left-4 md:-left-20 w-[110%] md:w-auto bg-[#0A0A0F]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-4 md:p-6 shadow-2xl z-20 flex flex-col md:flex-row items-center gap-6"
                style={{ transform: "translateZ(80px)" }} // Pops out furthest
              >
                <div className="shrink-0 text-center md:text-left">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-1">AI Messages</p>
                  <p className="text-2xl md:text-3xl font-black text-cyan-400">2,891</p>
                  <p className="text-[10px] text-cyan-400 font-bold flex items-center justify-center md:justify-start gap-1 mt-1">
                    <CheckCircle2 size={10} /> All Delivered
                  </p>
                </div>
                
                <div className="hidden md:block w-px h-12 bg-white/10" />

                <div className="w-full">
                  <p className="text-[10px] text-white/50 font-bold uppercase tracking-widest mb-3">Active Workflow</p>
                  <div className="flex items-center gap-2 md:gap-3 text-xs font-semibold text-white/80">
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 md:px-3 py-1.5 rounded-lg border border-white/5">
                      <MessageSquare size={12} className="text-green-400" /> WhatsApp
                    </div>
                    <ArrowRight size={12} className="text-white/30" />
                    <div className="flex items-center gap-1.5 bg-primary/20 px-2 md:px-3 py-1.5 rounded-lg border border-primary/30 text-primary">
                      <Cpu size={12} /> AI Agent
                    </div>
                    <ArrowRight size={12} className="text-white/30" />
                    <div className="flex items-center gap-1.5 bg-white/5 px-2 md:px-3 py-1.5 rounded-lg border border-white/5">
                      <Users size={12} className="text-accent" /> CRM
                    </div>
                  </div>
                </div>
              </motion.div>

            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-32 relative">
        <div className="container mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              STOP LEAVING MONEY <br />
              <span className="gradient-text">ON THE TABLE</span>
            </h2>
            <p className="text-xl text-white/50 font-medium">
              Manual processes are killing your growth. It's time to upgrade your business engine.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {homeData?.problems.map((item, idx) => (
              <motion.div key={idx} whileHover={{ y: -15 }} className="glass p-10 glass-hover relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-full h-1 gradient-bg opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500">
                  {iconMap[item.iconId]}
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight">{item.title}</h3>
                <p className="text-white/50 text-base leading-relaxed font-medium">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-32 bg-white/[0.02] relative overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
        <div className="container mx-auto px-6 flex flex-col lg:flex-row items-center gap-20">
          <div className="flex-1">
            <h2 className="text-5xl md:text-7xl font-black mb-8 tracking-tighter leading-[0.9]">
              WE BUILD SMART SYSTEMS <br />
              <span className="gradient-text">THAT WORK 24/7</span>
            </h2>
            <p className="text-xl text-white/50 mb-10 leading-relaxed font-medium">
              From automation to modern websites, we create systems that run your business efficiently, allowing you to focus on what matters most—strategy and growth.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
              {[
                "Automated Lead Qualification",
                "Self-Correcting Workflows",
                "Real-time Performance Dashboards",
                "Seamless Tool Integrations",
              ].map((text, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="w-6 h-6 rounded-full gradient-bg flex items-center justify-center shrink-0">
                    <CheckCircle2 size={14} className="text-white" />
                  </div>
                  <span className="text-white/80 font-bold text-sm tracking-tight">{text}</span>
                </div>
              ))}
            </div>
            <Link to="/services" className="inline-flex items-center gap-3 text-primary font-black text-lg hover:gap-6 transition-all">
              Explore Our Solutions <ArrowRight size={24} />
            </Link>
          </div>
          <div className="flex-1 relative">
            <div className="aspect-square rounded-[40px] overflow-hidden glass p-3 relative group">
              <img src={smartImage} alt="AI Systems" className="w-full h-full object-cover rounded-[32px] opacity-40 group-hover:opacity-60 transition-opacity duration-700" referrerPolicy="no-referrer" />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent" />
            </div>
          </div>
        </div>
      </section>

      {/* OUR CORE EXPERTISE */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-20 gap-8">
            <div className="max-w-2xl">
              <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
                OUR CORE <br />
                <span className="gradient-text">EXPERTISE</span>
              </h2>
              <p className="text-xl text-white/50 font-medium">Specialized solutions for the AI-first era.</p>
            </div>
            <Link to="/services" className="px-8 py-4 rounded-xl glass font-bold text-sm hover:bg-white/10 transition-all">
              View All Services
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {services.map((service, idx) => (
              <motion.div
                key={service.id}
                whileHover={{ scale: 1.02, y: -10 }}
                className="glass p-10 glass-hover group relative overflow-hidden"
              >
                <div className="absolute bottom-0 right-0 w-32 h-32 bg-primary/5 blur-3xl -z-10 group-hover:bg-primary/20 transition-all" />
                <div className="mb-10 group-hover:scale-110 transition-transform duration-500">
                  {iconMap[service.title] || <Cpu size={32} className="text-primary" />}
                </div>
                <h3 className="text-2xl font-black mb-6 tracking-tight">{service.title}</h3>
                <p className="text-white/50 text-base mb-10 leading-relaxed font-medium">{service.desc}</p>
                <div className="flex flex-wrap gap-3">
                  {serviceTags[service.title]?.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-3 py-1.5 rounded-lg bg-white/5 border border-white/5 text-white/40 font-black uppercase tracking-widest"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* THE SYNTHESIS PROCESS */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter">
              THE SYNTHESIS <br />
              <span className="gradient-text">PROCESS</span>
            </h2>
            <p className="text-xl text-white/50 font-medium">From raw data to refined automation in three distinct phases.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-16">
            {homeData?.steps.map((step, idx) => (
              <div key={idx} className="relative text-center md:text-left group">
                
                <div className="text-9xl font-black text-white/10 mb-6 absolute -top-16 left-1/2 md:left-0 -translate-x-1/2 md:translate-x-0 group-hover:text-white/70 group-hover:drop-shadow-[0_0_10px_rgba(255,255,255,0.3)] transition-all duration-500">
                  {step.number}
                </div>
                
                <div className="w-20 h-20 rounded-3xl gradient-bg flex items-center justify-center mb-8 mx-auto md:mx-0 shadow-2xl shadow-primary/30 group-hover:scale-110 transition-transform">
                  <div className="transition-all duration-300 group-hover:brightness-0 group-hover:invert">
                    {iconMap[step.iconId]}
                  </div>
                </div>
                <h3 className="text-3xl font-black mb-6 tracking-tight relative z-10">{step.title}</h3>
                <p className="text-white/50 text-lg leading-relaxed font-medium relative z-10">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Case Study Preview (DATABASE DRIVEN) */}
      <section className="py-32 bg-white/[0.02] relative">
        <div className="container mx-auto px-6">
          <div className="glass p-10 md:p-20 flex flex-col lg:flex-row items-center gap-20 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-1/2 h-full bg-gradient-to-l from-primary/5 to-transparent -z-10" />
            <div className="flex-1">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-[10px] font-black text-primary mb-8 tracking-widest uppercase">
                Featured Case Study
              </div>
              
              <h2 className="text-4xl md:text-6xl font-black mb-8 tracking-tighter leading-[0.9] uppercase">
                {featuredProject ? featuredProject.title : "GYM AUTOMATION SYSTEM"}
              </h2>
              
              <p className="text-xl text-white/60 mb-8 leading-relaxed font-medium italic">
                "{featuredProject ? featuredProject.problem : "Manual processes were slowing down growth and losing leads."}"
              </p>

              <div className="glass p-6 border-l-4 border-primary mb-12 bg-primary/5">
                <p className="text-lg font-bold text-white tracking-wide">
                  {featuredProject ? featuredProject.result : "Increased engagement by 40% and saved 12 hours weekly."}
                </p>
              </div>

              <Link
                to="/projects"
                className="px-10 py-5 rounded-2xl border border-white/10 hover:bg-white/5 transition-all font-black text-lg inline-flex items-center gap-3"
              >
                View Case Study <ArrowRight size={20} />
              </Link>
            </div>
            
            <div className="flex-1 w-full relative">
              <div className="aspect-video rounded-3xl overflow-hidden glass p-2 group-hover:scale-[1.02] transition-transform duration-700">
                <img
                  src={featuredProject ? featuredProject.image : "https://picsum.photos/seed/gym-tech-v2/1200/800"}
                  alt="Featured Case Study"
                  className="w-full h-full object-cover rounded-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-700"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 glass p-6 shadow-2xl">
                <p className="text-2xl font-black text-green-400">Success</p>
                <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">Verified Result</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CLIENT ECHOES (Infinite Carousel) */}
      <section className="py-32 overflow-hidden">
        
        <style>{`
          @keyframes scroll-left {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-50% - 1.25rem)); }
          }
        `}</style>

        <div className="container mx-auto px-6 mb-24">
          <h2 className="text-4xl md:text-6xl font-black text-center tracking-tighter">
            CLIENT <span className="gradient-text">ECHOES</span>
          </h2>
        </div>

        <div className="w-full relative [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <div 
            className="flex w-max gap-10 hover:[animation-play-state:paused]" 
            style={{ animation: "scroll-left 25s linear infinite" }}
          >
            {[...testimonials, ...testimonials].map((t, i) => (
              <div 
                key={i} 
                className="group w-[350px] md:w-[450px] shrink-0 glass p-10 italic text-white/70 relative glass-hover hover:-translate-y-2 transition-transform duration-300"
              >
                <div className="text-6xl text-primary/10 absolute top-6 left-6 font-serif">"</div>
                
                <div className="flex items-center gap-1 mb-6 relative z-10">
                  {[...Array(5)].map((_, starIdx) => (
                    <Star 
                      key={starIdx} 
                      size={18} 
                      className="text-yellow-400 fill-yellow-400 group-hover:scale-110 group-hover:drop-shadow-[0_0_8px_rgba(250,204,21,0.6)] transition-all duration-300" 
                      style={{ transitionDelay: `${starIdx * 50}ms` }}
                    />
                  ))}
                </div>

                <p className="mb-10 relative z-10 text-lg leading-relaxed font-medium">{t.review_text}</p>
                <div className="flex items-center gap-5 not-italic">
                  <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/5 flex items-center justify-center font-black text-primary text-xl shadow-inner uppercase">
                    {t.client_name[0]}
                  </div>
                  <div>
                    <p className="font-black text-white text-base tracking-tight">{t.client_name}</p>
                    <p className="text-xs text-white/40 font-bold uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="glass p-16 md:p-32 text-center relative overflow-hidden rounded-[60px]">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-primary/20 via-transparent to-accent/20" />
            <div className="absolute -top-24 -left-24 w-96 h-96 bg-primary/20 blur-[120px] rounded-full" />
            <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-accent/20 blur-[120px] rounded-full" />

            <div className="relative z-10">
              <h2 className="text-5xl md:text-8xl font-black mb-10 tracking-tighter leading-[0.9]">
                READY TO ENTER <br />
                <span className="gradient-text">THE ETHER?</span>
              </h2>
              <p className="text-2xl text-white/50 mb-16 max-w-3xl mx-auto font-medium">
                Building automated businesses of the future. Start your transition today with a free strategy audit.
              </p>
              <div className="flex flex-wrap justify-center gap-8">
                <Link to="/booking" className="px-12 py-6 rounded-2xl gradient-bg font-black text-xl hover:scale-105 transition-all">
                  Book Demo
                </Link>
                <Link to="/contact" className="px-12 py-6 rounded-2xl glass font-black text-xl hover:bg-white/10 transition-all">
                  Contact Us
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

export default function Home() {
  const [homeData, setHomeData] = useState<HomeData | null>(null);
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [smartImage, setSmartImage] = useState("https://picsum.photos/seed/ai-tech-v2/1000/1000");
  const [featuredProject, setFeaturedProject] = useState<any>(null);
  
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [hData, sData] = await Promise.all([api.getHomeData(), api.getServices()]);
        setHomeData(hData);
        setServices(sData);

        const { data: imgData } = await supabase.from('site_images').select('image_url').eq('image_key', 'home_smart_systems').single();
        if (imgData && imgData.image_url) setSmartImage(imgData.image_url);

        const { data: projectData } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(1).single();
        if (projectData) setFeaturedProject(projectData);

        const { data: reviewsData } = await supabase.from('testimonials').select('*').order('created_at', { ascending: false });
        
        if (reviewsData && reviewsData.length > 0) {
          setTestimonials(reviewsData);
        } else {
          setTestimonials([
            {
              review_text: "ZenX transformed our workflow completely! Our response time dropped from hours to seconds.",
              client_name: "Sarah Johnson",
              role: "CEO, TechFlow",
            },
            {
              review_text: "The AI automation they built for our lead capture has doubled our conversion rate in 3 months.",
              client_name: "Michael Chen",
              role: "Founder, GrowthLab",
            },
            {
              review_text: "Professional, futuristic, and highly effective. They don't just build websites; they build systems.",
              client_name: "David Miller",
              role: "Director, Apex Solutions",
            }
          ]);
        }

      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !homeData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return <HomeContent homeData={homeData} services={services} smartImage={smartImage} featuredProject={featuredProject} testimonials={testimonials} />;
}