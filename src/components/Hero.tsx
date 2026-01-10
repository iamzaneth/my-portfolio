// src/components/Hero.tsx
import { Github, Linkedin, Mail, ArrowDown } from "lucide-react";

export default function Hero() {
  return (
    <section id="home" className="min-h-screen flex items-center bg-gray-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="flex flex-col-reverse md:flex-row items-center justify-between gap-10">
          
          {/* Phần nội dung chữ (Bên trái) */}
          <div className="w-full md:w-1/2 text-center md:text-left space-y-6">
            <h2 className="text-xl md:text-2xl font-medium text-blue-600">
              Xin chào, mình là
            </h2>
            
            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 leading-tight">
              Thiên Phúc
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 font-medium">
              Full Stack Developer 
              <span className="text-blue-500"> & </span> 
              UI/UX Enthusiast
            </p>
            
            <p className="text-gray-500 max-w-lg mx-auto md:mx-0 leading-relaxed">
              Mình chuyên xây dựng các ứng dụng web hiện đại, tối ưu hiệu năng và trải nghiệm người dùng. Luôn tìm tòi công nghệ mới để giải quyết các vấn đề thực tế.
            </p>

            {/* Các nút bấm hành động */}
            <div className="flex flex-col sm:flex-row items-center gap-4 justify-center md:justify-start pt-4">
              <a 
                href="#contact" 
                className="px-8 py-3 bg-blue-600 text-white rounded-full font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-500/30"
              >
                Liên hệ ngay
              </a>
              <a 
                href="#" 
                className="px-8 py-3 bg-white text-gray-700 border border-gray-300 rounded-full font-medium hover:bg-gray-50 transition-all shadow-sm"
              >
                Tải CV
              </a>
            </div>

            {/* Icon Mạng xã hội */}
            <div className="flex items-center gap-6 justify-center md:justify-start pt-6">
              <a href="https://github.com" target="_blank" className="text-gray-500 hover:text-gray-900 transition-colors">
                <Github size={24} />
              </a>
              <a href="https://linkedin.com" target="_blank" className="text-gray-500 hover:text-blue-700 transition-colors">
                <Linkedin size={24} />
              </a>
              <a href="mailto:email@example.com" className="text-gray-500 hover:text-red-500 transition-colors">
                <Mail size={24} />
              </a>
            </div>
          </div>

          {/* Phần Hình ảnh (Bên phải) */}
          <div className="w-full md:w-1/2 flex justify-center relative">
            {/* Hình tròn trang trí phía sau (tạo hiệu ứng) */}
            <div className="absolute w-72 h-72 md:w-96 md:h-96 bg-blue-200 rounded-full blur-3xl opacity-30 -z-10 animate-pulse"></div>
            
            {/* Ảnh đại diện */}
            <img 
              src="/avt.jpg" 
              alt="Moomin Avatar" 
              className="w-64 h-64 md:w-80 md:h-80 object-cover rounded-2xl shadow-2xl border-4 border-white rotate-3 hover:rotate-0 transition-transform duration-500"
            />
          </div>
        </div>
        
        {/* Nút chỉ dẫn cuộn xuống */}
        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce hidden md:block">
            <ArrowDown className="text-gray-400" />
        </div>
      </div>
    </section>
  );
}