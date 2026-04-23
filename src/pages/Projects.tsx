import { motion } from "framer-motion"; // Changed to framer-motion just in case!
import { Link } from "react-router-dom";
import { ExternalLink, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

// 1. IMPORT SUPABASE HERE
import { supabase } from "../supabase";

// 2. We define the "Shape" of our data so TypeScript is happy
interface Project {
  id: number;
  title: string;
  image: string;
  category: string;
  problem: string;
  solution: string;
  result: string;
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const[loading, setLoading] = useState(true);

  // 3. This function runs automatically when the page loads
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        // Go to Supabase, open the 'projects' table, and grab everything (*)
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .order('created_at', { ascending: false }); // Puts newest projects first!

        // If Supabase complains, throw an error
        if (error) {
          throw error;
        }

        // If we got data, save it into our React state
        if (data) {
          setProjects(data);
        }
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      } finally {
        setLoading(false); // Turn off the loading spinner
      }
    };

    fetchProjects();
  },[]);

  return (
    <div className="pt-32 pb-24">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-6xl font-bold mb-6"
          >
            Case <span className="gradient-text">Studies</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-white/50"
          >
            Real-world results for modern enterprises scaling in the digital ether.
          </motion.p>
        </div>

        {/* If loading is true, show the spinning circle. If false, show the projects! */}
        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={48} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* If there are NO projects in Supabase yet, show a friendly message */}
            {projects.length === 0 ? (
               <div className="col-span-full text-center py-10 text-white/50">
                 No projects found. Add some in your Supabase dashboard!
               </div>
            ) : (
              /* If there ARE projects, map through them and display them */
              projects.map((project, idx) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass overflow-hidden group"
                >
                  <div className="aspect-video overflow-hidden relative">
                    <img
                      src={project.image}
                      alt={project.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-primary/20 backdrop-blur-md border border-primary/30 text-[10px] font-bold uppercase tracking-wider">
                      {project.category}
                    </div>
                  </div>
                  <div className="p-8">
                    <h3 className="text-2xl font-bold mb-6 group-hover:text-primary transition-colors">{project.title}</h3>
  
                    <div className="space-y-6 mb-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">The Problem</p>
                        <p className="text-sm text-white/60 leading-relaxed">{project.problem}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-white/30 mb-1">The Solution</p>
                        <p className="text-sm text-white/60 leading-relaxed">{project.solution}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-primary/50 mb-1">The Result</p>
                        <p className="text-sm font-medium text-white/90 leading-relaxed">{project.result}</p>
                      </div>
                    </div>
  
                    <button className="flex items-center gap-2 text-sm font-bold text-white/40 group-hover:text-primary transition-colors mt-auto">
                      View Full Case Study <ExternalLink size={14} />
                    </button>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-32 p-12 md:p-20 rounded-[40px] glass relative overflow-hidden text-center"
        >
          <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 -z-10" />
          <h2 className="text-4xl md:text-5xl font-black mb-8">Ready to be our next <br /><span className="gradient-text">Success Story?</span></h2>
          <p className="text-xl text-white/50 mb-12 max-w-2xl mx-auto">
            Join the ranks of high-growth companies automating their way to the top.
          </p>
          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Link 
              to="/booking"
              className="px-10 py-5 rounded-2xl gradient-bg font-bold text-lg hover:scale-105 transition-transform hover-glow"
            >
              Book a Strategy Call
            </Link>
            <Link 
              to="/services"
              className="px-10 py-5 rounded-2xl glass font-bold text-lg hover:bg-white/10 transition-all"
            >
              Explore Services
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}