import { Code2, Database, Globe, Cpu, Zap } from "lucide-react";

export default function About() {
  const skills = [
    { category: "Frontend", items: ["React", "TypeScript", "Tailwind CSS", "Next.js"], icon: <Globe className="text-cyan-400" /> },
    { category: "Backend", items: ["Node.js", "NestJS", "PostgreSQL", "Python"], icon: <Database className="text-blue-400" /> },
    { category: "Tools & DevOps", items: ["Git", "Docker", "AWS", "Linux"], icon: <Cpu className="text-purple-400" /> },
    { category: "Others", items: ["Machine Learning", "Data Analysis", "UI/UX Design"], icon: <Code2 className="text-cyan-400" /> },
  ];

  return (
    <section id="about" className="py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl"></div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            About Me
          </h2>
          <div className="w-20 h-1 bg-cyan-500 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
          {/* Left Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
              <Zap size={24} className="text-cyan-400" />
              My Journey as a Developer
            </h3>
            <p className="text-slate-400 leading-relaxed text-base">
              I'm a passionate technologist with a strong foundation in computer science. My journey started with curiosity about how websites work, and now I build complex full-stack systems. I'm experienced in creating modern, scalable applications with a focus on performance and user experience.
            </p>
            <p className="text-slate-400 leading-relaxed text-base">
              Beyond coding, I'm enthusiastic about Machine Learning models and system optimization. I believe technology is not just lines of code, but a powerful tool to solve real-world problems and make a positive impact.
            </p>
            <div className="pt-4">
              <div className="text-slate-300 font-semibold mb-3 flex items-center gap-2">
                <Code2 size={18} className="text-cyan-400" />
                Tech Stack
              </div>
              <div className="code-block text-cyan-300">
                const dev = {'{'}
                <br />
                &nbsp;&nbsp;languages: ['JS', 'Python', 'SQL'],
                <br />
                &nbsp;&nbsp;frameworks: ['React', 'Next.js'],
                <br />
                &nbsp;&nbsp;databases: ['PostgreSQL', 'MongoDB']
                <br />
                {'}'}
              </div>
            </div>
          </div>

          {/* Right Column - Skills */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {skills.map((group, index) => (
              <div 
                key={index} 
                className="glass-effect tech-border p-6 rounded-xl hover:shadow-lg hover:shadow-cyan-500/10 transition-all duration-300 group"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-lg bg-slate-800/50 group-hover:bg-slate-800 transition-colors">
                    {group.icon}
                  </div>
                  <h4 className="font-bold text-slate-200">{group.category}</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <span 
                      key={item} 
                      className="px-3 py-1 bg-slate-800/50 text-sm text-cyan-300 border border-cyan-500/20 rounded-full hover:border-cyan-500/50 transition-colors cursor-default"
                    >
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