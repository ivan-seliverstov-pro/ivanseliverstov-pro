import Hero from "./components/hero";
import Skills from "./components/skills";
import Clients from "./components/clients";
import Projects from "./components/projects";
import Recommendations from "./components/recommendations";
import Questions from "./components/questions";
import Contacts from "./components/contacts";

export default function Home() {
  return (
    <div>
      <Hero />
      <Skills />
      <Clients />
      <Projects />
      <Recommendations />
      <Questions />
      <Contacts />
    </div>
  );
}
