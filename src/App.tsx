// src/App.tsx
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import About from "@/components/About";
import Projects from "@/components/Projects";
import Contact from "@/components/Contact";

function App() {
  return (
    <div className="bg-gray-50 text-gray-900 font-sans">
      <Navbar />

      <main>
        <Hero />

        <About />

        <Projects />

        <Contact />
      </main>
    </div>
  );
}

export default App;