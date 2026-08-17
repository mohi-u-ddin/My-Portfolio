import { FolderKanban, Sparkles, Briefcase, Eye } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { skillService } from "../../services/skillService";
import { projectService } from "../../services/projectService";
import { experienceService } from "../../services/experienceService";
import "../../components/common/AdminPage.css";

export function AdminDashboard() {
  const { t } = useLanguage();
  usePageMeta("Dashboard — Admin");

  const { data: skills } = useAsyncData(() => skillService.getSkills());
  const { data: projects } = useAsyncData(() => projectService.getProjects());
  const { data: experience } = useAsyncData(() => experienceService.getExperience());

  const stats = [
    { icon: FolderKanban, value: projects?.length ?? "—", label: t.admin.totalProjects },
    { icon: Sparkles, value: skills?.length ?? "—", label: t.admin.totalSkills },
    { icon: Briefcase, value: experience?.length ?? "—", label: t.admin.experienceYears },
    { icon: Eye, value: "1,204", label: t.admin.profileViews },
  ];

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.dashboard}</h1>
          <p>Overview of your portfolio content — powered by mock data until the Spring Boot API is live.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <span className="admin-stat-card__icon">
              <stat.icon size={20} />
            </span>
            <div>
              <p className="admin-stat-card__value">{stat.value}</p>
              <p className="admin-stat-card__label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>Recent projects</h2>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Technologies</th>
              <th>Featured</th>
            </tr>
          </thead>
          <tbody>
            {(projects ?? []).slice(0, 5).map((p) => (
              <tr key={p.id}>
                <td>{p.title}</td>
                <td>{p.technologies.join(", ")}</td>
                <td>{p.featured ? "Yes" : "No"}</td>
              </tr>
            ))}
            {projects && projects.length === 0 && (
              <tr className="admin-empty-row">
                <td colSpan={3}>No projects yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
