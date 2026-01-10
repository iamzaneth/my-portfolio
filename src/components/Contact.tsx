// src/components/Contact.tsx
import { Mail, Phone, MapPin, Github, Linkedin, Facebook } from "lucide-react";

export default function Contact() {
  return (
    <section id="contact" className="pt-20 pb-10 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Tiêu đề */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Liên hệ</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div>
          <p className="text-gray-600 mt-4 max-w-2xl mx-auto">
            Kết nối với tôi qua các kênh dưới đây.
          </p>
        </div>

        {/* Các thẻ thông tin liên hệ (3 cột) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          
          {/* Email Card */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="p-4 bg-white text-blue-600 rounded-full shadow-sm mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Mail size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Email</h3>
            <a href="mailto:thienphuc@example.com" className="text-gray-600 hover:text-blue-600 transition-colors">
              thienphuc@example.com
            </a>
          </div>

          {/* Phone Card */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="p-4 bg-white text-blue-600 rounded-full shadow-sm mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <Phone size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Điện thoại</h3>
            <a href="tel:+84123456789" className="text-gray-600 hover:text-blue-600 transition-colors">
              +84 123 456 789
            </a>
          </div>

          {/* Address Card */}
          <div className="flex flex-col items-center text-center p-6 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-300 group">
            <div className="p-4 bg-white text-blue-600 rounded-full shadow-sm mb-4 group-hover:bg-blue-600 group-hover:text-white transition-colors">
              <MapPin size={28} />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Địa chỉ</h3>
            <p className="text-gray-600">
              Hồ Chí Minh, Việt Nam
            </p>
          </div>

        </div>

        {/* Mạng xã hội (Căn giữa) */}
        <div className="flex flex-col items-center mb-16">
          <h4 className="font-semibold text-gray-900 mb-6">Mạng xã hội</h4>
          <div className="flex gap-6">
            <a href="https://facebook.com" target="_blank" className="p-4 bg-gray-100 rounded-full text-gray-600 hover:bg-[#1877F2] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
              <Facebook size={24} />
            </a>
            <a href="https://linkedin.com" target="_blank" className="p-4 bg-gray-100 rounded-full text-gray-600 hover:bg-[#0A66C2] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
              <Linkedin size={24} />
            </a>
            <a href="https://github.com" target="_blank" className="p-4 bg-gray-100 rounded-full text-gray-600 hover:bg-[#333] hover:text-white transition-all transform hover:-translate-y-1 shadow-sm">
              <Github size={24} />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t border-gray-200 pt-8 text-center text-gray-500 text-sm">
          <p>&copy; {new Date().getFullYear()} Thiên Phúc. All rights reserved.</p>
        </div>
      </div>
    </section>
  );
}