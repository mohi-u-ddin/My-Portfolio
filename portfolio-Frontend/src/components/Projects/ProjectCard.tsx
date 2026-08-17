import { ExternalLink, Eye } from "lucide-react";
import { GithubIcon } from "../common/BrandIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import { Badge } from "../common/Badge";
import type { Project } from "../../types";
import "./ProjectCard.css";

export function ProjectCard({ project, onViewDetails }: { project: Project; onViewDetails: (p: Project) => void }) {
  const { t } = useLanguage();

  return (
    <article className="project-card">
      {project.featured && <span className="project-card__featured">Featured</span>}
      <div className="project-card__image">
        <img src={project.image} alt="" loading="lazy" />
      </div>
      <div className="project-card__body">
        <h3 className="project-card__title">{project.title}</h3>
        <p className="project-card__desc">{project.description}</p>
        <div className="project-card__tags">
          {project.technologies.map((tech) => (
            <Badge key={tech}>{tech}</Badge>
          ))}
        </div>
      </div>
      <div className="project-card__actions">
        {project.githubUrl && (
          <a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-card__action" aria-label={`${project.title} on GitHub`}>
            <GithubIcon size={16} /> {t.projects.github}
          </a>
        )}
        {project.liveUrl ? (
          <a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-card__action" aria-label={`${project.title} live demo`}>
            <ExternalLink size={16} /> {t.projects.liveDemo}
          </a>
        ) : (
          <span className="project-card__action project-card__action--disabled">{t.projects.noLiveDemo}</span>
        )}
        <button className="project-card__action" onClick={() => onViewDetails(project)}>
          <Eye size={16} /> {t.projects.viewDetails}
        </button>
      </div>
    </article>
  );
}
