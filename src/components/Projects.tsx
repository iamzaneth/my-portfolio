import { ExternalLink } from "lucide-react";
import { FaGithub } from "react-icons/fa";

const PROJECTS_DATA = [
  {
    title: "E-Commerce Platform",
    description: "A comprehensive e-commerce website with shopping cart, secure payment processing, and order management system.",
    tags: ["React", "Node.js", "MongoDB", "Redux"],
    image: "https://images.unsplash.com/photo-1557821552-17105176677c?fit=crop&w=800&q=80",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "Task Management App",
    description: "Personal task management application with Drag & Drop functionality and Dark mode support for enhanced user experience.",
    tags: ["Next.js", "TypeScript", "Tailwind", "Supabase"],
    image: "https://images.unsplash.com/photo-1540350394557-8d14678e7f91?fit=crop&w=800&q=80",
    github: "https://github.com",
    demo: "https://demo.com",
  },
  {
    title: "AI Image Generator",
    description: "Web application that integrates with AI APIs to generate images from user-provided text descriptions using advanced neural networks.",
    tags: ["Python", "Flask", "OpenAI API", "React"],
    image: "https://images.unsplash.com/photo-1617791160505-6f00504e3519?fit=crop&w=800&q=80",
    github: "https://github.com",
    demo: "https://demo.com",
  },
];

export default function Projects() {

  return (
    <section id="projects" className="py-20 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Featured Projects
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full mb-6"></div>
          <p className="text-slate-400 max-w-2xl mx-auto">
            Here are some personal projects I've developed to enhance my skills and explore cutting-edge technologies.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {PROJECTS_DATA.map((project, index) => (
            <div 
              key={index} 
              className="glass-effect tech-border rounded-xl overflow-hidden hover:shadow-xl hover:shadow-cyan-500/20 transition-all duration-300 group flex flex-col"
            >
              {/* Image Section */}
              <div className="relative overflow-hidden h-48">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
                  <a 
                    href={project.github} 
                    target="_blank" 
                    className="p-3 bg-cyan-500 rounded-full hover:bg-cyan-400 text-slate-950 transition-all duration-300 transform hover:scale-110" 
                    title="View Code"
                  >
                    <FaGithub size={20} />
                  </a>
                  <a 
                    href={project.demo} 
                    target="_blank" 
                    className="p-3 bg-slate-600 hover:bg-slate-500 text-white transition-all duration-300 transform hover:scale-110 rounded-full" 
                    title="View Demo"
                  >
                    <ExternalLink size={20} />
                  </a>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-6 flex-1 flex flex-col">
                <h3 className="text-xl font-bold text-slate-100 mb-2 group-hover:text-cyan-400 transition-colors">
                  {project.title}
                </h3>
                <p className="text-slate-400 mb-4 line-clamp-3 text-sm leading-relaxed flex-1">
                  {project.description}
                </p>
                <div className="flex flex-wrap gap-2 mt-auto">
                  {project.tags.map((tag) => (
                    <span 
                      key={tag} 
                      className="px-2 py-1 bg-slate-800/50 text-cyan-300 text-xs font-medium rounded-full border border-cyan-500/20 hover:border-cyan-500/50 transition-all cursor-default"
                    >
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