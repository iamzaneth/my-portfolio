import { Mail, Phone, MapPin, Send } from "lucide-react";
import { FaGithub, FaLinkedin, FaFacebook } from "react-icons/fa";

export default function Contact() {
  return (
    <section id="contact" className="pt-20 pb-10 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Let's Build Something Together
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            I'm always interested in hearing about new projects. Whether you have a question or just want to chat, feel free to reach out!
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Email Card */}
          <div className="glass-effect tech-border p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group flex flex-col items-center text-center">
            <div className="p-4 bg-cyan-600 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <Mail size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <a 
              href="mailto:tthienphuc1612@gmail.com" 
              className="text-slate-400 hover:text-cyan-400 transition-colors break-all"
            >
              tthienphuc1612@gmail.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="glass-effect tech-border p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group flex flex-col items-center text-center">
            <div className="p-4 bg-slate-700 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <Phone size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Phone</h3>
            <a 
              href="tel:+84348497984" 
              className="text-slate-400 hover:text-cyan-400 transition-colors"
            >
              +84 348 497 984
            </a>
          </div>

          {/* Location Card */}
          <div className="glass-effect tech-border p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 group flex flex-col items-center text-center">
            <div className="p-4 bg-slate-700 text-white rounded-full mb-4 group-hover:scale-110 transition-transform duration-300">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Location</h3>
            <p className="text-slate-400">
              Ho Chi Minh City, Vietnam
            </p>
          </div>

        </div>

        {/* Social Networks */}
        <div className="flex flex-col items-center mb-16">
          <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
            <Send size={18} className="text-cyan-400" />
            Follow Me
          </h4>
          <p className="text-slate-400 text-sm mb-6">Connect with me on social media</p>
          <div className="flex gap-4">
            <a 
              href="https://www.facebook.com/thien.phuc.310380" 
              target="_blank" 
              className="p-4 glass-effect tech-border rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all duration-300 transform hover:scale-110"
              title="Facebook"
            >
              <FaFacebook size={24} />
            </a>
            <a 
              href="https://www.linkedin.com/in/phúc-thiên-09845a329" 
              target="_blank" 
              className="p-4 glass-effect tech-border rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all duration-300 transform hover:scale-110"
              title="LinkedIn"
            >
              <FaLinkedin size={24} />
            </a>
            <a 
              href="https://github.com/Zane-Theodore" 
              target="_blank" 
              className="p-4 glass-effect tech-border rounded-full text-slate-400 hover:text-cyan-400 hover:bg-slate-800 transition-all duration-300 transform hover:scale-110"
              title="GitHub"
            >
              <FaGithub size={24} />
            </a>
          </div>
        </div>

        <div className="border-t border-cyan-500/20 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Tran Thien Phuc. All rights reserved.</p>
          <p className="text-slate-600 text-xs mt-2">Built with React • TypeScript • Tailwind CSS</p>
        </div>
      </div>
    </section>
  );
}