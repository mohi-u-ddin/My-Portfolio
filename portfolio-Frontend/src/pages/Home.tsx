import { useAsyncData } from "../hooks/useAsyncData";
import { usePageMeta } from "../hooks/usePageMeta";
import { portfolioService } from "../services/portfolioService";
import { Hero } from "../components/Hero/Hero";
import { About } from "../components/About/About";
import { Skills } from "../components/Skills/Skills";
import { Projects } from "../components/Projects/Projects";
import { Experience } from "../components/Experience/Experience";
import { Education } from "../components/Education/Education";
import { Resume } from "../components/Resume/Resume";
import { Contact } from "../components/Contact/Contact";

export function Home() {
  const { data: profile } = useAsyncData(() => portfolioService.getProfile());

  usePageMeta(
    "Mohi Ud Din — Backend Developer | Java & Spring Boot",
    "Computer Science student and aspiring backend developer specializing in Java, Spring Boot and REST APIs."
  );

  return (
    <>
      <Hero profile={profile} />
      <About profile={profile} />
      <Skills />
      <Projects />
      <Experience />
      <Education />
      <Resume profile={profile} />
      <Contact profile={profile} />
    </>
  );
}
