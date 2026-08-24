import { FolderKanban, Sparkles, Briefcase, Mail, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { skillService } from "../../services/skillService";
import { projectService } from "../../services/projectService";
import { experienceService } from "../../services/experienceService";
import { contactService } from "../../services/contactService";
import "../../components/common/AdminPage.css";

export function AdminDashboard() {
  const { t } = useLanguage();
  usePageMeta("Dashboard — Admin");

  const { data: skills } = useAsyncData(() => skillService.getSkills());
  const { data: projects } = useAsyncData(() => projectService.getProjects());
  const { data: experience } = useAsyncData(() => experienceService.getExperience());
  const { data: messages } = useAsyncData(() => contactService.getMessages());

  const unreadCount = messages?.filter((m) => !m.read).length ?? 0;

  const stats = [
    { icon: FolderKanban, value: projects?.length ?? "—", label: t.admin.totalProjects },
    { icon: Sparkles, value: skills?.length ?? "—", label: t.admin.totalSkills },
    { icon: Briefcase, value: experience?.length ?? "—", label: t.admin.experienceYears },
    {
      icon: Mail,
      value: messages ? `${unreadCount} new` : "—",
      label: t.admin.totalMessages,
      highlight: unreadCount > 0,
    },
  ];

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.dashboard}</h1>
          <p>Overview of your portfolio content and inbound inquiries.</p>
        </div>
      </div>

      <div className="admin-stat-grid">
        {stats.map((stat) => (
          <div className="admin-stat-card" key={stat.label}>
            <span
              className="admin-stat-card__icon"
              style={stat.highlight ? { color: "var(--accent-400)", background: "rgba(56, 189, 248, 0.15)" } : undefined}
            >
              <stat.icon size={20} />
            </span>
            <div>
              <p
                className="admin-stat-card__value"
                style={stat.highlight ? { color: "var(--accent-400)" } : undefined}
              >
                {stat.value}
              </p>
              <p className="admin-stat-card__label">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="admin-panel" style={{ marginBottom: "var(--sp-6)" }}>
        <div className="admin-panel__head">
          <h2>Recent Messages</h2>
          <Link
            to="/admin/messages"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "var(--fs-xs)",
              color: "var(--accent-400)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            View all messages <ArrowRight size={14} />
          </Link>
        </div>
        <table className="admin-table">
          <thead>
            <tr>
              <th>Status</th>
              <th>Sender</th>
              <th>Subject</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {(messages ?? []).slice(0, 4).map((msg) => (
              <tr key={msg.id}>
                <td>
                  {!msg.read ? (
                    <span
                      style={{
                        padding: "2px 8px",
                        borderRadius: "10px",
                        fontSize: "var(--fs-2xs)",
                        fontWeight: 600,
                        backgroundColor: "rgba(56, 189, 248, 0.15)",
                        color: "var(--accent-400)",
                      }}
                    >
                      New
                    </span>
                  ) : (
                    <span style={{ fontSize: "var(--fs-2xs)", color: "var(--text-3)" }}>Read</span>
                  )}
                </td>
                <td style={{ fontWeight: msg.read ? 400 : 600 }}>{msg.name}</td>
                <td>{msg.subject}</td>
                <td style={{ color: "var(--text-3)", fontSize: "var(--fs-xs)" }}>
                  {new Date(msg.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {messages && messages.length === 0 && (
              <tr className="admin-empty-row">
                <td colSpan={4}>No contact messages received yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="admin-panel">
        <div className="admin-panel__head">
          <h2>Recent Projects</h2>
          <Link
            to="/admin/projects"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "4px",
              fontSize: "var(--fs-xs)",
              color: "var(--accent-400)",
              textDecoration: "none",
              fontWeight: 500,
            }}
          >
            Manage projects <ArrowRight size={14} />
          </Link>
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
