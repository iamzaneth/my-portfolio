import { Mail, ArrowDown } from "lucide-react";
import { FaGithub, FaLinkedin } from "react-icons/fa";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center pt-16 overflow-hidden relative">
      {/* Hiệu ứng nền */}
      <div className="absolute inset-0 bg-linear-to-b from-blue-900/10 to-transparent -z-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          
          {/* Nội dung chữ */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-2xl md:text-4xl font-medium text-blue-400">
              Hello !! I'm
            </h2>
            
            <h1 className="text-5xl md:text-7xl font-bold text-white leading-tight">
              Tran Thien Phuc
            </h1>
            
            <p className="text-xl md:text-2xl text-slate-300 font-medium">
              Data Engineer
              <span className="text-blue-400"> & </span> 
              Full Stack Developer 
            </p>
            
            <p className="text-slate-400 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Mình chuyên xây dựng các ứng dụng web hiện đại, tối ưu hiệu năng và trải nghiệm người dùng. Luôn tìm tòi công nghệ mới để giải quyết các vấn đề thực tế.
            </p>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-500 transition-all shadow-lg shadow-blue-500/30"
              >
                Contact Me
              </a>
              <a 
                href="#" 
                className="px-8 py-3 bg-transparent text-white border border-slate-600 rounded-full font-medium hover:bg-slate-800 transition-all"
              >
                Download CV
              </a>
            </div>

            {/* Social Icons */}
            <div className="flex items-center gap-6 justify-center md:justify-start pt-6">
              <a href="https://github.com/Zane-Theodore" target="_blank" className="text-slate-400 hover:text-white transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="https://www.linkedin.com/in/phúc-thiên-09845a329" target="_blank" className="text-slate-400 hover:text-blue-400 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="mailto:tthienphuc1612@gmail.com" className="text-slate-400 hover:text-red-400 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Ảnh */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-blue-600/20 rounded-full blur-3xl -z-10 animate-pulse"></div>
            
            <img 
              src="/avatar.png" 
              alt="Moomin Avatar" 
              className="w-64 h-64 md:w-96 md:h-112 object-cover rounded-2xl shadow-2xl border-4 border-slate-800 rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
        
        <a 
          href="#about" 
          className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block cursor-pointer p-2 rounded-full hover:bg-slate-800/50 transition-all"
          aria-label="Scroll down to About section"
        >
            <ArrowDown className="text-slate-500 hover:text-blue-400 transition-colors" size={32} />
        </a>
      </div>
    </section>
  );
}