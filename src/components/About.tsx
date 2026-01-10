import { Code2, Database, Globe, Cpu } from "lucide-react";

export default function About() {
  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js"], icon: <Globe className="text-blue-500" /> },
    { category: "Backend", items: ["Node.js", "NestJS", "PostgreSQL", "Python"], icon: <Database className="text-green-500" /> },
    { category: "Tools & DevOps", items: ["Git", "Docker", "AWS", "Linux"], icon: <Cpu className="text-orange-500" /> },
    { category: "Others", items: ["Machine Learning", "Data Analysis", "UI/UX Design"], icon: <Code2 className="text-purple-500" /> },
  ];

  return (
    <section id="about" className="py-20 bg-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Về bản thân tôi</h2>
          <div className="w-20 h-1 bg-blue-500 mx-auto rounded"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Cột trái */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-100">
              Hành trình trở thành Developer
            </h3>
            <p className="text-slate-400 leading-relaxed">
              Tôi là một lập trình viên đam mê công nghệ với nền tảng vững chắc về khoa học máy tính. Tôi bắt đầu hành trình của mình bằng việc tò mò về cách các trang web hoạt động, và giờ đây tôi xây dựng các hệ thống full-stack phức tạp.
            </p>
            <p className="text-slate-400 leading-relaxed">
              Ngoài việc viết code, tôi còn thích tìm hiểu về các mô hình Machine Learning và tối ưu hóa hệ thống. Tôi tin rằng công nghệ không chỉ là những dòng code khô khan, mà là công cụ để giải quyết các vấn đề thực tế của cuộc sống.
            </p>
          </div>

          {/* Cột phải */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((group, index) => (
              <div key={index} className="bg-slate-800 p-6 rounded-xl border border-slate-700 hover:border-blue-500/50 transition-colors">
                <div className="flex items-center gap-3 mb-4">
                  {group.icon}
                  <h4 className="font-bold text-slate-200">{group.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span key={item} className="px-3 py-1 bg-slate-900 text-sm text-slate-300 border border-slate-700 rounded-full">
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