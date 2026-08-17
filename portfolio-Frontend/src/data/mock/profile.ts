import type { Profile } from "../../types";

export const mockProfile: Profile = {
  name: "Mohi Ud Din",
  title: "Backend Developer",
  tagline: "Java • Spring Boot • REST APIs",
  bio: "I'm a Computer Science student focused on backend engineering — designing REST APIs, modeling data, and building the systems that sit underneath the interface. I work primarily in Java and Spring Boot, backed by MySQL, and I round it out with a working React/TypeScript frontend skillset so I can ship a feature end to end. Right now I'm looking for backend or full-stack internships where I can work on real production systems.",
  avatarUrl: "/avatar-placeholder.svg",
  email: "hello@mohiuddin.dev",
  location: "Islamabad, Pakistan",
  availability: "Open to internships & backend roles",
  githubUrl: "https://github.com/mohiuddin",
  linkedinUrl: "https://linkedin.com/in/mohiuddin",
  resumeUrl: "/resume/Mohi-Ud-Din-Resume.pdf",
  stats: [
    { id: 1, value: "10+", label: "Technologies" },
    { id: 2, value: "5+", label: "Projects" },
    { id: 3, value: "BS", label: "Computer Science" },
    { id: 4, value: "2+", label: "Years Learning" },
  ],
};
