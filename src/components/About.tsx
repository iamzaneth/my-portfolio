// src/components/About.tsx
import { Code2, Database, Globe, Cpu } from "lucide-react";

export default function About() {
  // Danh sách kỹ năng (Bạn có thể sửa lại theo thực tế)
  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js"], icon: <Globe className="text-blue-500" /> },
    { category: "Backend", items: ["Node.js", "NestJS", "PostgreSQL", "Python"], icon: <Database className="text-green-500" /> },
    { category: "Tools & DevOps", items: ["Git", "Docker", "AWS", "Linux"], icon: <Cpu className="text-orange-500" /> },
    { category: "Others", items: ["Machine Learning", "Data Analysis", "UI/UX Design"], icon: <Code2 className="text-purple-500" /> },
  ];

  return (
    <section id="about" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Về bản thân tôi</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Cột trái: Giới thiệu */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-gray-800">
              Hành trình trở thành Developer
            </h3>
            <p className="text-gray-600 leading-relaxed">
              Tôi là một lập trình viên đam mê công nghệ với nền tảng vững chắc về khoa học máy tính. Tôi bắt đầu hành trình của mình bằng việc tò mò về cách các trang web hoạt động, và giờ đây tôi xây dựng các hệ thống full-stack phức tạp.
            </p>
            <p className="text-gray-600 leading-relaxed">
              Ngoài việc viết code, tôi còn thích tìm hiểu về các mô hình Machine Learning và tối ưu hóa hệ thống. Tôi tin rằng công nghệ không chỉ là những dòng code khô khan, mà là công cụ để giải quyết các vấn đề thực tế của cuộc sống.
            </p>
          </div>

          {/* Cột phải: Grid Kỹ năng */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((group, index) => (
              <div key={index} className="bg-gray-50 p-6 rounded-xl border border-gray-100 hover:shadow-md transition-shadow">
                <div className="flex items-center gap-3 mb-4">
                  {group.icon}
                  <h4 className="font-bold text-gray-900">{group.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="px-3 py-1 bg-white text-sm text-gray-600 border border-gray-200 rounded-full">
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}