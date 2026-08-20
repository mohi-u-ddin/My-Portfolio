import type { ContactMessage } from "../../types";

export const mockContactMessages: ContactMessage[] = [
  {
    id: 1,
    name: "Sarah Jenkins",
    email: "sarah.jenkins@techcorp.io",
    subject: "Backend Developer Opportunity (Full-Time / Hybrid)",
    message:
      "Hi Mohi Ud Din,\n\nWe came across your portfolio and were really impressed by your Spring Boot and REST API work. We currently have an opening for a junior/mid backend engineer on our platform engineering team.\n\nAre you available for a brief introductory call this week?\n\nBest regards,\nSarah Jenkins\nTechCorp Talent Team",
    read: false,
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 2,
    name: "Alex Rivera",
    email: "alex@startupforge.com",
    subject: "Freelance Invoicing API Consultation",
    message:
      "Hello! I saw your Smart Invoice System project. We are building a similar microservice architecture for billing and would love to hire you for a 3-week contract to help design the Spring Boot services and database schema.\n\nLet me know your availability and rates.",
    read: false,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 3,
    name: "David Chen",
    email: "david.chen@cloudpulse.dev",
    subject: "Feedback & Collaboration on Open Source",
    message:
      "Hey Mohi, nice portfolio! Clean architecture and great documentation. I work on open source Spring modules and would love to collaborate on a few projects if you are interested.\n\nKeep up the great work!",
    read: true,
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];
