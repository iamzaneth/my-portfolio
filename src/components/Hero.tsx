import { Mail, ArrowDown, Zap } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16 overflow-hidden relative">
      {/* Background Effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          
          {/* Content */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <Zap size={20} className="text-cyan-400" />
              <span className="text-sm font-semibold text-cyan-400">Available for exciting projects</span>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-medium text-slate-300">
              Heyy, I'm
            </h2>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Tran Thien Phuc
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 font-semibold">
              <span className="text-cyan-400">Full Stack</span> Developer <span className="text-slate-400">&</span> <span className="text-slate-200">Data Engineer</span>
            </p>
            
            <p className="text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed text-base">
              I specialize in building modern web applications with optimized performance and exceptional user experience. Always exploring new technologies to solve real-world problems.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 transform hover:-translate-y-1 flex items-center gap-2"
              >
                <Mail size={18} />
                Get In Touch
              </a>
              <a 
                href="/cv.pdf" 
                className="px-8 py-3 bg-slate-800/50 text-cyan-400 border border-cyan-500/30 rounded-lg font-semibold hover:bg-slate-800 hover:border-cyan-500 transition-all duration-300"
              >
                Download CV
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-6 justify-center md:justify-start pt-6">
              <a 
                href="https://github.com/Zane-Theodore" 
                target="_blank" 
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hover:border hover:border-cyan-500/30 transition-all duration-300"
                title="GitHub"
              >
                <FaGithub size={20} />
              </a>
              <a 
                href="https://www.linkedin.com/in/phúc-thiên-09845a329" 
                target="_blank" 
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hover:border hover:border-cyan-500/30 transition-all duration-300"
                title="LinkedIn"
              >
                <FaLinkedin size={20} />
              </a>
              <a 
                href="mailto:tthienphuc1612@gmail.com" 
                className="p-3 rounded-lg bg-slate-800/50 text-slate-400 hover:text-cyan-400 hover:bg-slate-800 hover:border hover:border-cyan-500/30 transition-all duration-300"
                title="Email"
              >
                <Mail size={20} />
              </a>
            </div>
          </div>

          {/* Image Section */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <img 
              src="/avatar.png" 
              alt="Avatar" 
              className="w-64 h-64 md:w-96 md:h-96 object-cover rounded-2xl shadow-2xl border-2 border-cyan-500/30 hover:border-cyan-500/60 transition-all duration-500 transform hover:scale-105"
            />
          </div>
        </div>
        
        <a 
          href="#about" 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block cursor-pointer p-3 rounded-full hover:bg-slate-800/50 transition-all group"
          aria-label="Scroll down to About section"
        >
          <ArrowDown className="text-cyan-400/60 group-hover:text-cyan-400 transition-colors" size={32} />
        </a>
      </div>
    </section>
  );
}