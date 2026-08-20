import { useRef, useState } from "react";
import { Plus, Pencil, Trash2, Upload } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { projectService } from "../../services/projectService";
import { mediaService } from "../../services/mediaService";
import { resolveMediaUrl } from "../../utils/media";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import type { Project } from "../../types";
import "../../components/common/AdminPage.css";

const emptyForm: Omit<Project, "id"> = {
  title: "",
  description: "",
  image: "/projects/placeholder.svg",
  technologies: [],
  githubUrl: "",
  liveUrl: "",
  featured: false,
  date: new Date().toISOString().slice(0, 10),
};

export function AdminProjects() {
  const { t } = useLanguage();
  usePageMeta("Projects — Admin");
  const { data: projects, state, errorMessage, reload } = useAsyncData(() => projectService.getProjects());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Project, "id">>(emptyForm);
  const [techInput, setTechInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setTechInput("");
    setModalOpen(true);
  }

  function openEdit(project: Project) {
    setEditingId(project.id);
    setForm({ ...project });
    setTechInput(project.technologies.join(", "));
    setModalOpen(true);
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const res = await mediaService.uploadImage(file, "PROJECT_IMAGE");
      setForm((f) => ({ ...f, image: res.url }));
    } catch (err: any) {
      alert(err.message || "Failed to upload image to database.");
    } finally {
      setUploadingImage(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this project?")) return;
    await projectService.deleteProject(id);
    reload();
  }

  async function handleSubmit() {
    if (!form.title.trim()) return;
    setBusy(true);
    const technologies = techInput.split(",").map((t) => t.trim()).filter(Boolean);
    const payload = { ...form, technologies };
    try {
      if (editingId) await projectService.updateProject(editingId, payload);
      else await projectService.createProject(payload);
      setModalOpen(false);
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.projects}</h1>
          <p>Add, edit, or remove projects. Images are saved directly into the PostgreSQL database.</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
          {t.common.add} Project
        </Button>
      </div>

      {state === "loading" && <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />}
      {state === "error" && (
        <StatusView variant="error" loadingLabel="" emptyLabel="" errorLabel={errorMessage ?? "Error"} retryLabel={t.common.retry} onRetry={reload} />
      )}

      {state === "success" && (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Preview</th>
                <th>Title</th>
                <th>Technologies</th>
                <th>Featured</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects!.map((project) => (
                <tr key={project.id}>
                  <td>
                    <img
                      src={resolveMediaUrl(project.image, "/projects/placeholder.svg")}
                      alt=""
                      style={{ width: 44, height: 32, borderRadius: 4, objectFit: "cover" }}
                      onError={(e) => {
                        (e.currentTarget as HTMLImageElement).src = "/projects/placeholder.svg";
                      }}
                    />
                  </td>
                  <td>{project.title}</td>
                  <td>{project.technologies.join(", ")}</td>
                  <td>{project.featured ? "Yes" : "No"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(project)} aria-label={`Edit ${project.title}`}>
                        <Pencil size={14} />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(project.id)} aria-label={`Delete ${project.title}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {projects!.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={5}>No projects in database yet. Click "Add Project" above to create one.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Project" : "Add Project"} closeLabel={t.common.close}>
        <div className="admin-form">
          <div className="admin-form__field">
            <label htmlFor="pr-title">Title</label>
            <input id="pr-title" value={form.title} onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))} />
          </div>
          <div className="admin-form__field">
            <label htmlFor="pr-desc">Description</label>
            <textarea id="pr-desc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>

          <div className="admin-form__field">
            <label>Project Thumbnail Image (Saved in PostgreSQL)</label>
            <div style={{ display: "flex", gap: "12px", alignItems: "center", marginTop: "4px" }}>
              <img
                src={resolveMediaUrl(form.image, "/projects/placeholder.svg")}
                alt=""
                style={{ width: 64, height: 44, borderRadius: 6, objectFit: "cover", backgroundColor: "var(--bg-2)" }}
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src = "/projects/placeholder.svg";
                }}
              />
              <input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/webp,image/svg+xml"
                onChange={handleImageUpload}
                style={{ display: "none" }}
              />
              <Button
                type="button"
                variant="secondary"
                icon={<Upload size={14} />}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingImage}
              >
                {uploadingImage ? "Saving to Database..." : "Upload Image to Database"}
              </Button>
            </div>
            <input
              id="pr-image"
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
              placeholder="/api/media/... or https://..."
              style={{ marginTop: "8px" }}
            />
          </div>

          <div className="admin-form__field">
            <label htmlFor="pr-tech">Technologies (comma-separated)</label>
            <input id="pr-tech" value={techInput} onChange={(e) => setTechInput(e.target.value)} placeholder="Java, Spring Boot, PostgreSQL" />
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="pr-github">GitHub URL</label>
              <input id="pr-github" value={form.githubUrl} onChange={(e) => setForm((f) => ({ ...f, githubUrl: e.target.value }))} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="pr-live">Live URL</label>
              <input id="pr-live" value={form.liveUrl} onChange={(e) => setForm((f) => ({ ...f, liveUrl: e.target.value }))} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-sm)", color: "var(--text-2)" }}>
            <input type="checkbox" checked={form.featured} onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))} />
            Mark as featured
          </label>
          <div className="admin-form__actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={busy}>{busy ? "Saving..." : t.common.save}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
