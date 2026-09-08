import { Mail, ArrowDown } from "lucide-react"; 
import { FaGithub } from "react-icons/fa";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16 overflow-hidden relative">
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-72 h-72 bg-cyan-500/5 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-12">
          
          {/* Content */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            
            {/* Status Badge */}
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <div className="px-3 py-1 rounded-full bg-slate-800/50 border border-cyan-500/20 flex items-center gap-2 backdrop-blur-sm">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
                </span>
                <span className="text-xs font-medium text-cyan-300 tracking-wide">Open to Work</span>
              </div>
            </div>
            
            <h2 className="text-2xl md:text-4xl font-medium text-slate-300">
              Hello, I'm
            </h2>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Tran Thien Phuc
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-200 font-semibold">
              <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-blue-500">Data Analyst</span> 
              <span className="text-slate-500 mx-3">|</span> 
              <span className="text-slate-300">AI Engineer</span>
            </p>
            
            {/* Description */}
            <p className="text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed text-base">
              Data Engineering student passionate about data analysis, AI engineering, and applied mathematics. I transform raw data into reliable insights and build practical data-driven systems for real-world problems.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg font-semibold transition-all duration-300 shadow-lg shadow-cyan-900/20 flex items-center gap-2 group"
              >
                <Mail size={18} className="group-hover:rotate-12 transition-transform" />
                Contact Me
              </a>
              <a 
                href="/cv.pdf" 
                className="px-8 py-3 bg-transparent text-slate-300 border border-slate-700 rounded-lg font-semibold hover:bg-slate-800 hover:text-white transition-all duration-300"
              >
                View Resume
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-5 justify-center md:justify-start pt-6">
              <a href="https://github.com/iamzaneth" target="_blank" className="text-slate-400 hover:text-white transition-colors"><FaGithub size={24} /></a>
              <a href="mailto:tthienphuc1612@gmail.com" className="text-slate-400 hover:text-red-400 transition-colors"><Mail size={24} /></a>
            </div>
          </div>

          {/* Avatar */}
          <div className="w-full md:w-1/2 flex justify-center relative z-10">
            <div className="relative w-64 h-64 md:w-80 md:h-80 group">
                
                <div className="absolute inset-0 border-2 border-slate-800 rounded-4xl transform rotate-6 transition-transform duration-500 group-hover:rotate-12 bg-slate-900/50"></div>
                
                <div className="absolute inset-0 rounded-4xl overflow-hidden border border-slate-700/50 bg-slate-900 shadow-2xl">
                    <img 
                      src="/avatar.png" 
                      alt="AI Engineer Avatar" 
                      className="w-full h-full object-cover opacity-90 group-hover:opacity-100 group-hover:scale-105 transition-all duration-500"
                    />
                    <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-linear-to-t from-slate-950/80 to-transparent"></div>
                </div>

            </div>
          </div>
        </div>
        
        {/* Scroll Down */}
        <a 
          href="#about" 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block cursor-pointer p-2 rounded-full hover:bg-slate-800/50 transition-all text-slate-500 hover:text-cyan-400"
        >
          <ArrowDown size={28} />
        </a>
      </div>
    </section>
  );
}