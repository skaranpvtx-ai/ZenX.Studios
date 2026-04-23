import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion"; 
import { Menu, X } from "lucide-react";
import { useState, useEffect } from "react";

const navLinks = [
  { name: "Home", path: "/" },
  { name: "Services", path: "/services" },
  { name: "Projects", path: "/projects" },
  { name: "About", path: "/about" },
  { name: "Pricing", path: "/pricing" },
  { name: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className="fixed top-4 left-0 right-0 z-50 transition-all duration-500 ease-in-out px-6 outline-none border-none"
    >
      <div 
        /* 
          FIX APPLIED HERE: Added border-transparent, shadow-none, outline-none to the non-scrolled state. 
          Added ease-in-out for a seamless, buttery transition.
        */
        className={`container mx-auto transition-all duration-500 ease-in-out ${
          scrolled 
            ? "glass-navbar py-3 px-8 max-w-6xl" 
            : "bg-transparent border border-transparent shadow-none outline-none py-4 px-0"
        } flex items-center justify-between`}
      >
        <Link to="/" className="flex items-center gap-3 group outline-none">
          <div className="relative flex items-center justify-center outline-none">
            
            {/* YOUR CUSTOM LOGO IMPLEMENTED HERE */}
            <img 
              src="/logo.png" 
              alt="ZenX Logo" 
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform duration-300 relative z-10"
            />
            
          </div>
        </Link>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`text-sm font-semibold tracking-wide transition-all hover:text-primary relative group outline-none ${
                location.pathname === link.path ? "text-primary" : "text-white/70"
              }`}
            >
              {link.name}
              <span className={`absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full ${
                location.pathname === link.path ? "w-full" : ""
              }`} />
            </Link>
          ))}
          <Link
            to="/booking"
            className="px-6 py-2.5 rounded-full gradient-bg text-sm font-bold hover:opacity-90 transition-all hover-glow shadow-lg shadow-primary/20 outline-none"
          >
            Book Call
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button className="md:hidden text-white p-2 glass rounded-lg outline-none" onClick={() => setIsOpen(!isOpen)}>
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-6 right-6 mt-4 glass-navbar p-6 flex flex-col gap-4 md:hidden"
        >
          {navLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              className={`text-lg font-bold outline-none ${
                location.pathname === link.path ? "text-primary" : "text-white/70"
              }`}
            >
              {link.name}
            </Link>
          ))}
          <Link
            to="/booking"
            onClick={() => setIsOpen(false)}
            className="w-full py-3 rounded-xl gradient-bg text-center font-bold shadow-lg shadow-primary/20 outline-none"
          >
            Book Call
          </Link>
        </motion.div>
      )}
    </nav>
  );
}