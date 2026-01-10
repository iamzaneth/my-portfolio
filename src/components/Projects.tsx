import { Github, ExternalLink } from "lucide-react";

export default function Projects() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "Một trang web thương mại điện tử đầy đủ tính năng với giỏ hàng, thanh toán và quản lý đơn hàng.",
      tags: ["React", "Node.js", "MongoDB", "Redux"],
      image: "https://images.unsplash.com/photo-1557821552-17105176677c?fit=crop&w=800&q=80",
      github: "https://github.com",
      demo: "https://demo.com",
    },
    {
      title: "Task Management App",
      description: "Ứng dụng quản lý công việc cá nhân, hỗ trợ Drag & Drop và giao diện tối (Dark mode).",
      tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
      image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?fit=crop&w=800&q=80",
      github: "https://github.com",
      demo: "https://demo.com",
    },
    {
      title: "AI Image Generator",
      description: "Website tích hợp API trí tuệ nhân tạo để tạo ảnh từ văn bản mô tả của người dùng.",
      tags: ["Python", "Flask", "OpenAI API", "React"],
      image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?fit=crop&w=800&q=80",
      github: "https://github.com",
      demo: "https://demo.com",
    },
  ];

  return (
    <section id="projects" className="py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Dự án nổi bật</h2>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Dưới đây là một số dự án cá nhân mà tôi đã thực hiện để rèn luyện kỹ năng và áp dụng công nghệ mới.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <div key={index} className="bg-slate-900 rounded-xl overflow-hidden border border-slate-800 hover:border-blue-500/50 transition-all duration-300 group">
              <div className="relative overflow-hidden h-48">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-4">
                  <a href={project.github} target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-white text-white hover:text-slate-900 transition-colors" title="View Code">
                    <Github size={20} />
                  </a>
                  <a href={project.demo} target="_blank" className="p-2 bg-slate-800 rounded-full hover:bg-white text-white hover:text-slate-900 transition-colors" title="View Demo">
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              <div className="p-6">
                <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                <p className="text-slate-400 mb-4 line-clamp-3 text-sm">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-900/30 text-blue-300 text-xs font-medium rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}