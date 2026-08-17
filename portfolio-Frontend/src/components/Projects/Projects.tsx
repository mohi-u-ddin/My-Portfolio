import { useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { projectService } from "../../services/projectService";
import { useAsyncData } from "../../hooks/useAsyncData";
import { StatusView } from "../common/StatusView";
import { ProjectCard } from "./ProjectCard";
import { ProjectDetailsModal } from "./ProjectDetailsModal";
import type { Project } from "../../types";
import "./Projects.css";

export function Projects() {
  const { t } = useLanguage();
  const { data: projects, state, errorMessage, reload } = useAsyncData(() => projectService.getProjects());
  const [activeProject, setActiveProject] = useState<Project | null>(null);

  return (
    <section id="projects" className="section projects">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{t.projects.eyebrow}</p>
          <h2 className="section-title">{t.projects.title}</h2>
          <p className="section-sub">{t.projects.subtitle}</p>
        </div>

        {state === "loading" && (
          <StatusView variant="loading" loadingLabel={t.projects.loading} emptyLabel="" errorLabel="" retryLabel="" />
        )}

        {state === "error" && (
          <StatusView
            variant="error"
            loadingLabel=""
            emptyLabel=""
            errorLabel={errorMessage ?? t.projects.error}
            retryLabel={t.projects.retry}
            onRetry={reload}
          />
        )}

        {state === "empty" && (
          <StatusView variant="empty" loadingLabel="" emptyLabel={t.projects.empty} errorLabel="" retryLabel="" />
        )}

        {state === "success" && (
          <div className="projects__grid">
            {projects!.map((project) => (
              <ProjectCard key={project.id} project={project} onViewDetails={setActiveProject} />
            ))}
          </div>
        )}
      </div>

      <ProjectDetailsModal project={activeProject} onClose={() => setActiveProject(null)} />
    </section>
  );
}
