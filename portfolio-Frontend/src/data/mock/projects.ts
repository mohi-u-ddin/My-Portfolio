import type { Project } from "../../types";

export const mockProjects: Project[] = [
  {
    id: 1,
    title: "Student Management System",
    description:
      "A full-stack application for managing student records — enrollment, grades and attendance — built on Spring Boot REST APIs with a React frontend and role-based access.",
    image: "/projects/student-management.svg",
    technologies: ["Java", "Spring Boot", "React", "MySQL", "REST API"],
    githubUrl: "https://github.com/mohiuddin/student-management-system",
    liveUrl: "",
    featured: true,
    date: "2026-05-01",
  },
  {
    id: 2,
    title: "E-Commerce Application",
    description:
      "A backend-driven e-commerce platform with product catalog, cart, and order management, exposing REST endpoints consumed by a React storefront.",
    image: "/projects/ecommerce.svg",
    technologies: ["Java", "Spring Boot", "React", "MySQL"],
    githubUrl: "https://github.com/mohiuddin/ecommerce-app",
    liveUrl: "",
    featured: true,
    date: "2026-02-15",
  },
  {
    id: 3,
    title: "Smart Invoice System",
    description:
      "An invoicing tool for small businesses that generates, tracks and exports invoices, with a normalized MySQL schema and a Spring Boot service layer.",
    image: "/projects/invoice-system.svg",
    technologies: ["Java", "Spring Boot", "MySQL"],
    githubUrl: "https://github.com/mohiuddin/smart-invoice-system",
    liveUrl: "",
    featured: true,
    date: "2025-11-20",
  },
  {
    id: 4,
    title: "Task Tracker API",
    description:
      "A lightweight REST API for personal task management with JWT authentication, built to practice Spring Security fundamentals.",
    image: "/projects/task-tracker.svg",
    technologies: ["Java", "Spring Boot", "Spring Security", "MySQL"],
    githubUrl: "https://github.com/mohiuddin/task-tracker-api",
    liveUrl: "",
    featured: false,
    date: "2025-08-10",
  },
  {
    id: 5,
    title: "Portfolio CMS Frontend",
    description:
      "This very portfolio — a React + TypeScript frontend designed API-first, ready to be wired to a Spring Boot content-management backend.",
    image: "/projects/portfolio.svg",
    technologies: ["React", "TypeScript", "Vite"],
    githubUrl: "https://github.com/mohiuddin/portfolio",
    liveUrl: "",
    featured: false,
    date: "2026-06-01",
  },
];
