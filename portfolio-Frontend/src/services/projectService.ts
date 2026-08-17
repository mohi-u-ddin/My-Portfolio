import { api, USE_MOCKS, mockDelay } from "./api";
import { mockProjects } from "../data/mock/projects";
import type { Project } from "../types";

let localProjects = [...mockProjects];

export const projectService = {
  async getProjects(): Promise<Project[]> {
    if (USE_MOCKS) return mockDelay([...localProjects], 500);
    return api.get<Project[]>("/projects");
  },

  async getProjectById(id: number): Promise<Project | undefined> {
    if (USE_MOCKS) return mockDelay(localProjects.find((p) => p.id === id), 300);
    return api.get<Project>(`/projects/${id}`);
  },

  async createProject(project: Omit<Project, "id">): Promise<Project> {
    if (USE_MOCKS) {
      const created = { ...project, id: Date.now() };
      localProjects = [created, ...localProjects];
      return mockDelay(created, 400);
    }
    return api.post<Project>("/projects", project, { auth: true });
  },

  async updateProject(id: number, project: Partial<Project>): Promise<Project> {
    if (USE_MOCKS) {
      localProjects = localProjects.map((p) => (p.id === id ? { ...p, ...project } : p));
      return mockDelay(localProjects.find((p) => p.id === id)!, 400);
    }
    return api.put<Project>(`/projects/${id}`, project, { auth: true });
  },

  async deleteProject(id: number): Promise<void> {
    if (USE_MOCKS) {
      localProjects = localProjects.filter((p) => p.id !== id);
      return mockDelay(undefined, 300);
    }
    return api.delete<void>(`/projects/${id}`, { auth: true });
  },
};
