import { Mail, Phone, MapPin, Github, Linkedin, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="pt-20 pb-10 bg-slate-900">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Liên hệ</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div>
          <p className="text-slate-400 mt-4 max-w-2xl mx-auto">
            Kết nối với tôi qua các kênh dưới đây.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Email Card */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="p-4 bg-slate-900 text-blue-500 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mail size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Email</h3>
            <a href="mailto:thienphuc@example.com" className="text-slate-400 hover:text-blue-400 transition-colors">
              thienphuc@example.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="p-4 bg-slate-900 text-blue-500 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Phone size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Điện thoại</h3>
            <a href="tel:+84123456789" className="text-slate-400 hover:text-blue-400 transition-colors">
              +84 123 456 789
            </a>
          </div>

          {/* Address Card */}
          <div className="flex flex-col items-center text-center p-6 bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-all duration-300 group">
            <div className="p-4 bg-slate-900 text-blue-500 rounded-full mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Địa chỉ</h3>
            <p className="text-slate-400">
              Hồ Chí Minh, Việt Nam
            </p>
          </div>

        </div>

        {/* Mạng xã hội */}
        <div className="flex flex-col items-center mb-16">
          <h4 className="font-semibold text-white mb-6">Mạng xã hội</h4>
          <div className="flex gap-6">
            <a href="https://facebook.com" target="_blank" className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-1">
              <Facebook size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com" target="_blank" className="p-4 bg-slate-800 rounded-full text-slate-400 hover:bg-[#333] hover:text-white transition-all transform hover:-translate-y-1">
              <Github size={24} />
            </a>
          </div>
        </div>

        <div className="border-t border-slate-800 pt-8 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Thiên Phúc. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}