import { ExternalLink } from "lucide-react";
import { GithubIcon } from "../common/BrandIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import { Modal } from "../common/Modal";
import { Badge } from "../common/Badge";
import { Button } from "../common/Button";
import { resolveMediaUrl } from "../../utils/media";
import type { Project } from "../../types";

export function ProjectDetailsModal({ project, onClose }: { project: Project | null; onClose: () => void }) {
  const { t } = useLanguage();
  const imageSrc = project ? resolveMediaUrl(project.image, "/projects/placeholder.svg") : "";

  return (
    <Modal isOpen={Boolean(project)} onClose={onClose} title={project?.title ?? ""} closeLabel={t.projects.close}>
      {project && (
        <>
          <div style={{ borderRadius: "var(--radius-md)", overflow: "hidden", marginBottom: "var(--sp-5)", background: "var(--bg-2)" }}>
            <img
              src={imageSrc}
              alt={project.title}
              style={{ width: "100%", display: "block", aspectRatio: "16/9", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src = "/projects/placeholder.svg";
              }}
            />
          </div>
          <p style={{ color: "var(--text-2)", lineHeight: "var(--lh-normal)" }}>{project.description}</p>

          <h4 style={{ marginTop: "var(--sp-5)", fontSize: "var(--fs-sm)", color: "var(--text-3)", fontFamily: "var(--font-mono)", textTransform: "uppercase", letterSpacing: "0.06em" }}>
            {t.projects.technologies}
          </h4>
          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "var(--sp-2)" }}>
            {project.technologies.map((tech) => (
              <Badge key={tech}>{tech}</Badge>
            ))}
          </div>

          <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-6)", flexWrap: "wrap" }}>
            {project.githubUrl && (
              <Button as="a" href={project.githubUrl} target="_blank" rel="noreferrer" variant="secondary" icon={<GithubIcon size={16} />}>
                {t.projects.github}
              </Button>
            )}
            {project.liveUrl && (
              <Button as="a" href={project.liveUrl} target="_blank" rel="noreferrer" variant="primary" icon={<ExternalLink size={16} />}>
                {t.projects.liveDemo}
              </Button>
            )}
          </div>
        </>
      )}
    </Modal>
  );
}
