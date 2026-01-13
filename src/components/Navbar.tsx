import { useState } from "react";
import { Menu, X, Code2 } from "lucide-react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "#home" },
    { name: "About", href: "#about" },
    { name: "Projects", href: "#projects" },
    { name: "Contact", href: "#contact" },
  ];

  return (
    // Header
    <nav className="fixed top-0 left-0 w-full z-50 glass-effect border-b border-cyan-500/20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo */}
          <div className="shrink-0 cursor-pointer flex items-center gap-2 group">
            <div className="p-2 rounded-lg bg-linear-to-br from-cyan-500 to-blue-500 group-hover:shadow-lg group-hover:shadow-cyan-500/50 transition-all duration-300">
              <Code2 size={20} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-linear-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
              Theodore<span className="text-cyan-500">.</span>
            </span>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-1">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  className="text-slate-300 hover:text-cyan-400 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300 relative group"
                >
                  {link.name}
                  <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-linear-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-300"></span>
                </a>
              ))}
            </div>
          </div>

          {/* Toggle Button */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 focus:outline-none transition-all duration-300"
            >
              <div className={`transition-all duration-300 ${isOpen ? "rotate-90 scale-110" : "rotate-0 scale-100"}`}>
                 {isOpen ? <X size={28} /> : <Menu size={28} />}
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden grid transition-all duration-300 ease-in-out ${
          isOpen 
            ? "grid-rows-[1fr] opacity-100"
            : "grid-rows-[0fr] opacity-0"
        }`}
      >
        <div className="overflow-hidden border-t border-cyan-500/20">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link, index) => (
              <a
                key={link.name}
                href={link.href}
                style={{ transitionDelay: `${index * 50}ms` }}
                className={`text-slate-300 hover:text-cyan-400 hover:bg-slate-800/50 block px-3 py-2 rounded-md text-base font-medium transition-all duration-300 transform ${
                    isOpen ? "translate-x-0 opacity-100" : "-translate-x-4 opacity-0"
                }`}
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}