import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../supabase"; 
// 1. Import Social Icons
import { Instagram, Linkedin, Twitter, Github } from "lucide-react";

export default function Footer() {
  const [logoUrl, setLogoUrl] = useState("/logo.png");
  
  // 2. State to hold the social links from the database
  const [socialLinks, setSocialLinks] = useState<Record<string, string>>({});

  useEffect(() => {
    // Fetch Logo
    const fetchLogo = async () => {
      try {
        const { data } = await supabase
          .from('site_images')
          .select('image_url')
          .eq('image_key', 'main_logo')
          .single();
          
        if (data && data.image_url) {
          setLogoUrl(data.image_url);
        }
      } catch (err) {
        console.error("Failed to fetch footer logo:", err);
      }
    };

    // 3. Fetch Social Links from Supabase
    const fetchSocials = async () => {
      try {
        const { data } = await supabase.from('social_links').select('*');
        if (data) {
          // Convert database array into an easy dictionary { "Instagram": "url" }
          const linksObj: Record<string, string> = {};
          data.forEach(item => linksObj[item.platform] = item.url);
          setSocialLinks(linksObj);
        }
      } catch (err) {
        console.error("Failed to fetch social links:", err);
      }
    };

    fetchLogo();
    fetchSocials();
  }, []);

  return (
    <footer className="border-t border-white/10 pt-20 pb-10 mt-20 relative z-10 bg-[#02000A]/50 backdrop-blur-md">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-1 md:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img 
                src={logoUrl} 
                alt="ZenX Logo" 
                className="h-16 w-auto object-contain" 
              />
            </Link>
            <p className="text-white/50 max-w-sm font-medium leading-relaxed mb-8">
              We build intelligent systems and premium digital experiences for forward-thinking enterprises.
            </p>
            
            {/* 4. DYNAMIC SOCIAL ICONS */}
            <div className="flex gap-4">
              {socialLinks['Instagram'] && (
                <a href={socialLinks['Instagram']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-all hover:-translate-y-1">
                  <Instagram size={18} />
                </a>
              )}
              {socialLinks['LinkedIn'] && (
                <a href={socialLinks['LinkedIn']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-all hover:-translate-y-1">
                  <Linkedin size={18} />
                </a>
              )}
              {socialLinks['Twitter'] && (
                <a href={socialLinks['Twitter']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-all hover:-translate-y-1">
                  <Twitter size={18} />
                </a>
              )}
              {socialLinks['GitHub'] && (
                <a href={socialLinks['GitHub']} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl glass flex items-center justify-center text-white/50 hover:text-primary hover:bg-white/10 transition-all hover:-translate-y-1">
                  <Github size={18} />
                </a>
              )}
            </div>
            
          </div>
          
          <div>
            <h4 className="font-black mb-6 text-lg tracking-tight">Navigation</h4>
            <ul className="space-y-4">
              <li><Link to="/services" className="text-white/50 hover:text-primary transition-colors font-medium">Services</Link></li>
              <li><Link to="/projects" className="text-white/50 hover:text-primary transition-colors font-medium">Projects</Link></li>
              <li><Link to="/about" className="text-white/50 hover:text-primary transition-colors font-medium">About</Link></li>
              <li><Link to="/pricing" className="text-white/50 hover:text-primary transition-colors font-medium">Pricing</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-black mb-6 text-lg tracking-tight">Contact</h4>
            <ul className="space-y-4">
              <li><a href="mailto:hello@zenxstudios.ai" className="text-white/50 hover:text-primary transition-colors font-medium">hello@zenxstudios.ai</a></li>
              <li className="text-white/50 font-medium">+91 98765 43210</li>
              <li className="text-white/50 font-medium">Coimbatore, Tamilnadu</li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-white/10 text-white/30 text-sm font-bold uppercase tracking-widest">
          <p>&copy; {new Date().getFullYear()} ZenX Studios. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}