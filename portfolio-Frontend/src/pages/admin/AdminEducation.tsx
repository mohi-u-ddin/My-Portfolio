import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { educationService } from "../../services/educationService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import type { Education } from "../../types";
import "../../components/common/AdminPage.css";

const emptyForm: Omit<Education, "id"> = {
  degree: "",
  institution: "",
  startDate: new Date().toISOString().slice(0, 10),
  endDate: null,
  description: "",
  achievements: [],
};

export function AdminEducation() {
  const { t } = useLanguage();
  usePageMeta("Education — Admin");
  const { data: items, state, errorMessage, reload } = useAsyncData(() => educationService.getEducation());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Education, "id">>(emptyForm);
  const [achievementsInput, setAchievementsInput] = useState("");
  const [busy, setBusy] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setAchievementsInput("");
    setModalOpen(true);
  }

  function openEdit(item: Education) {
    setEditingId(item.id);
    setForm({ ...item });
    setAchievementsInput((item.achievements ?? []).join("\n"));
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this education entry?")) return;
    await educationService.deleteEducation(id);
    reload();
  }

  async function handleSubmit() {
    if (!form.degree.trim() || !form.institution.trim()) return;
    setBusy(true);
    const payload = { ...form, achievements: achievementsInput.split("\n").map((l) => l.trim()).filter(Boolean) };
    try {
      if (editingId) await educationService.updateEducation(editingId, payload);
      else await educationService.createEducation(payload);
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
          <h1>{t.admin.education}</h1>
          <p>Manage the academic background shown in the public Education section.</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
          Add Education
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
                <th>Degree</th>
                <th>Institution</th>
                <th>Dates</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {items!.map((item) => (
                <tr key={item.id}>
                  <td>{item.degree}</td>
                  <td>{item.institution}</td>
                  <td>{item.startDate.slice(0, 7)} — {item.endDate ? item.endDate.slice(0, 7) : "Present"}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(item)} aria-label={`Edit ${item.degree}`}>
                        <Pencil size={14} />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(item.id)} aria-label={`Delete ${item.degree}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {items!.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={4}>No education entries yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Education" : "Add Education"} closeLabel={t.common.close}>
        <div className="admin-form">
          <div className="admin-form__field">
            <label htmlFor="ed-degree">Degree</label>
            <input id="ed-degree" value={form.degree} onChange={(e) => setForm((f) => ({ ...f, degree: e.target.value }))} />
          </div>
          <div className="admin-form__field">
            <label htmlFor="ed-institution">Institution</label>
            <input id="ed-institution" value={form.institution} onChange={(e) => setForm((f) => ({ ...f, institution: e.target.value }))} />
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="ed-start">Start date</label>
              <input id="ed-start" type="date" value={form.startDate.slice(0, 10)} onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="ed-end">End date</label>
              <input id="ed-end" type="date" value={form.endDate?.slice(0, 10) ?? ""} onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))} />
            </div>
          </div>
          <div className="admin-form__field">
            <label htmlFor="ed-desc">Description</label>
            <textarea id="ed-desc" rows={3} value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} />
          </div>
          <div className="admin-form__field">
            <label htmlFor="ed-achievements">Achievements (one per line)</label>
            <textarea id="ed-achievements" rows={3} value={achievementsInput} onChange={(e) => setAchievementsInput(e.target.value)} />
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
