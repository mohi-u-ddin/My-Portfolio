import { useState } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { skillService } from "../../services/skillService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import type { Skill, SkillLevel } from "../../types";
import "../../components/common/AdminPage.css";

const CATEGORIES = ["Backend", "Database", "Frontend", "Tools"];
const LEVELS: SkillLevel[] = ["Beginner", "Intermediate", "Advanced", "Expert"];
const emptyForm: Omit<Skill, "id"> = { name: "", category: "Backend", icon: "java", level: "Intermediate", yearsOfExperience: 1 };

export function AdminSkills() {
  const { t } = useLanguage();
  usePageMeta("Skills — Admin");
  const { data: skills, state, errorMessage, reload } = useAsyncData(() => skillService.getSkills());

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [form, setForm] = useState<Omit<Skill, "id">>(emptyForm);
  const [busy, setBusy] = useState(false);

  function openCreate() {
    setEditingId(null);
    setForm(emptyForm);
    setModalOpen(true);
  }

  function openEdit(skill: Skill) {
    setEditingId(skill.id);
    setForm({ name: skill.name, category: skill.category, icon: skill.icon, level: skill.level, yearsOfExperience: skill.yearsOfExperience });
    setModalOpen(true);
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this skill?")) return;
    await skillService.deleteSkill(id);
    reload();
  }

  async function handleSubmit() {
    if (!form.name.trim()) return;
    setBusy(true);
    try {
      if (editingId) await skillService.updateSkill(editingId, form);
      else await skillService.createSkill(form);
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
          <h1>{t.admin.skills}</h1>
          <p>Manage the skills shown in the public Skills section.</p>
        </div>
        <Button variant="primary" icon={<Plus size={16} />} onClick={openCreate}>
          {t.common.add} Skill
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
                <th>Skill</th>
                <th>Category</th>
                <th>Level</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills!.map((skill) => (
                <tr key={skill.id}>
                  <td>{skill.name}</td>
                  <td>{skill.category}</td>
                  <td>{skill.level}</td>
                  <td>
                    <div className="admin-table__actions">
                      <button className="admin-icon-btn" onClick={() => openEdit(skill)} aria-label={`Edit ${skill.name}`}>
                        <Pencil size={14} />
                      </button>
                      <button className="admin-icon-btn admin-icon-btn--danger" onClick={() => handleDelete(skill.id)} aria-label={`Delete ${skill.name}`}>
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {skills!.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={4}>No skills yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal isOpen={modalOpen} onClose={() => setModalOpen(false)} title={editingId ? "Edit Skill" : "Add Skill"} closeLabel={t.common.close}>
        <div className="admin-form">
          <div className="admin-form__field">
            <label htmlFor="s-name">Name</label>
            <input id="s-name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="admin-form__row">
            <div className="admin-form__field">
              <label htmlFor="s-category">Category</label>
              <select id="s-category" value={form.category} onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}>
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div className="admin-form__field">
              <label htmlFor="s-level">Level</label>
              <select id="s-level" value={form.level} onChange={(e) => setForm((f) => ({ ...f, level: e.target.value as SkillLevel }))}>
                {LEVELS.map((l) => (
                  <option key={l} value={l}>{l}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="admin-form__field">
            <label htmlFor="s-icon">Icon key</label>
            <input id="s-icon" value={form.icon} onChange={(e) => setForm((f) => ({ ...f, icon: e.target.value }))} placeholder="java, spring, mysql, react..." />
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
