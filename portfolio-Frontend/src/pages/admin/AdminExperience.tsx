import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { experienceService } from "../../services/experienceService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import type { Experience } from "../../types";
import "../../components/common/AdminPage.css";

const emptyForm: Omit<Experience, "id"> = {
  company: "",
  position: "",
  location: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: null,
  description: [],
  technologies: [],
};

export function AdminExperience() {
  const { t } = useLanguage();
  usePageMeta("Experience — Admin");
  const { data: items, state, errorMessage, reload } = useAsyncData(() => experienceService.getExperience());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Experience, "id">>(emptyForm);
  const [descInput, setDescInput] = useState("");
  const [techInput, setTechInput] = useState("");
  const [isPresent, setIsPresent] = useState(false);
  const [busy, setBusy] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setDescInput("");
    setTechInput("");
    setIsPresent(false);
    setModalOpen(true);
  }

  function openEdit(item: Experience) {
    setEditingId(item.id);
    setForm({ ...item });
    setDescInput(item.description.join("\n"));
    setTechInput(item.technologies.join(", "));
    setIsPresent(item.endDate === null);
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this experience entry?")) return;
    await experienceService.deleteExperience(id);
    reload();
  }

  async function handleSubmit() {
    if (!form.company.trim() || !form.position.trim()) return;
    setBusy(true);
    const payload = {
      ...form,
      endDate: isPresent ? null : form.endDate,
      description: descInput.split("\n").map((l) => l.trim()).filter(Boolean),
      technologies: techInput.split(",").map((t) => t.trim()).filter(Boolean),
    };
    try {
      if (editingId) await experienceService.updateExperience(editingId, payload);
      else await experienceService.createExperience(payload);
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
          <h1>{t.admin.experience}</h1>
          <p>Manage the timeline shown in the public Experience section.</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
          Add Experience
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
                <th>Position</th>
                <th>Company</th>
                <th>Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items!.map((item) => (
                <tr key={item.id}>
                  <td>{item.position}</td>
                  <td>{item.company}</td>
                  <td>{item.startDate.slice(0, 7)} — {item.endDate ? item.endDate.slice(0, 7) : "Present"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(item)} aria-label={`Edit ${item.position}`}>
                        <Pencil size={14} />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.position}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items!.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={4}>No experience entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Experience" : "Add Experience"} closeLabel={t.common.close}>
        <div className="admin-form">
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="e-company">Company</label>
              <input id="e-company" value={form.company} onChange={(e) => setForm((f) => ({ ...f, company: e.target.value }))} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="e-position">Position</label>
              <input id="e-position" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} />
            </div>
          </div>
          <div className="admin-form__field">
            <label htmlFor="e-location">Location</label>
            <input id="e-location" value={form.location} onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))} />
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="e-start">Start date</label>
              <input id="e-start" type="date" value={form.startDate.slice(0, 10)} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="e-end">End date</label>
              <input id="e-end" type="date" disabled={isPresent} value={form.endDate?.slice(0, 10) ?? ""} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "var(--fs-sm)", color: "var(--text-2)" }}>
            <input type="checkbox" checked={isPresent} onChange={(e) => setIsPresent(e.target.checked)} />
            Currently working here
          </label>
          <div className="admin-form__field">
            <label htmlFor="e-desc">Description (one bullet per line)</label>
            <textarea id="e-desc" rows={4} value={descInput} onChange={(e) => setDescInput(e.target.value)} />
          </div>
          <div className="admin-form__field">
            <label htmlFor="e-tech">Technologies (comma-separated)</label>
            <input id="e-tech" value={techInput} onChange={(e) => setTechInput(e.target.value)} />
          </div>
          <div className="admin-form__actions">
            <Button variant="secondary" onClick={() => setModalOpen(false)}>{t.common.cancel}</Button>
            <Button variant="primary" onClick={handleSubmit} disabled={busy}>{busy ? "Saving..." : t.common.save}</Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
