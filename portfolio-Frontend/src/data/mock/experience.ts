import type { Experience } from "../../types";

export const mockExperience: Experience[] = [
  {
    id: 1,
    company: "Company Name",
    position: "Backend Developer Intern",
    location: "Remote",
    startDate: "2026-01-01",
    endDate: null,
    description: [
      "Developed and maintained REST APIs used by the internal web dashboard",
      "Worked with Spring Boot to build service and repository layers",
      "Integrated MySQL for persistence, including schema design and migrations",
      "Wrote and executed API tests to catch regressions before release",
    ],
    technologies: ["Java", "Spring Boot", "MySQL", "Postman"],
  },
  {
    id: 2,
    company: "Freelance",
    position: "Full-Stack Developer",
    location: "Remote",
    startDate: "2025-06-01",
    endDate: "2025-12-31",
    description: [
      "Delivered small business web applications end to end, from schema to UI",
      "Built REST APIs in Spring Boot and connected them to React frontends",
      "Managed client requirements and iterated based on feedback",
    ],
    technologies: ["Java", "Spring Boot", "React", "MySQL"],
  },
];
