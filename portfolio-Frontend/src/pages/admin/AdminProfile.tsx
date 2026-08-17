import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { portfolioService } from "../../services/portfolioService";
import { Button } from "../../components/common/Button";
import { StatusView } from "../../components/common/StatusView";
import type { Profile } from "../../types";
import "../../components/common/AdminPage.css";

export function AdminProfile() {
  const { t } = useLanguage();
  usePageMeta("Profile — Admin");
  const { data: profile, state, reload } = useAsyncData(() => portfolioService.getProfile());
  const [form, setForm] = useState<Profile | null>(null);
  const [saving, setSaving] = useState(false);
  const [savedMessage, setSavedMessage] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await portfolioService.updateProfile(form);
      setSavedMessage(true);
      setTimeout(() => setSavedMessage(false), 3000);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.profile}</h1>
          <p>Manage the public-facing profile details shown across the site.</p>
        </div>
      </div>

      {state === "loading" && (
        <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />
      )}
      {state === "error" && (
        <StatusView variant="error" loadingLabel="" emptyLabel="" errorLabel="Unable to load profile." retryLabel={t.common.retry} onRetry={reload} />
      )}

      {form && (
        <form className="admin-panel" style={{ padding: "var(--sp-6)" }} onSubmit={handleSubmit}>
          <div className="admin-form">
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="p-name">Name</label>
                <input id="p-name" value={form.name} onChange={(e) => update("name", e.target.value)} />
              </div>
              <div className="admin-form__field">
                <label htmlFor="p-title">Job title</label>
                <input id="p-title" value={form.title} onChange={(e) => update("title", e.target.value)} />
              </div>
            </div>

            <div className="admin-form__field">
              <label htmlFor="p-about">About</label>
              <textarea id="p-about" rows={4} value={form.bio} onChange={(e) => update("bio", e.target.value)} />
            </div>

            <div className="admin-form__field">
              <label htmlFor="p-avatar">Profile image URL</label>
              <input id="p-avatar" value={form.avatarUrl} onChange={(e) => update("avatarUrl", e.target.value)} />
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="p-email">Email</label>
                <input id="p-email" type="email" value={form.email} onChange={(e) => update("email", e.target.value)} />
              </div>
              <div className="admin-form__field">
                <label htmlFor="p-location">Location</label>
                <input id="p-location" value={form.location} onChange={(e) => update("location", e.target.value)} />
              </div>
            </div>

            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="p-github">GitHub URL</label>
                <input id="p-github" value={form.githubUrl} onChange={(e) => update("githubUrl", e.target.value)} />
              </div>
              <div className="admin-form__field">
                <label htmlFor="p-linkedin">LinkedIn URL</label>
                <input id="p-linkedin" value={form.linkedinUrl} onChange={(e) => update("linkedinUrl", e.target.value)} />
              </div>
            </div>

            <div className="admin-form__field">
              <label htmlFor="p-availability">Availability</label>
              <input id="p-availability" value={form.availability} onChange={(e) => update("availability", e.target.value)} />
            </div>

            <div className="admin-form__actions">
              {savedMessage && <span style={{ color: "var(--success-500)", fontSize: "var(--fs-sm)", alignSelf: "center", marginInlineEnd: "auto" }}>Saved.</span>}
              <Button type="button" variant="secondary" onClick={() => setForm(profile)}>
                {t.common.cancel}
              </Button>
              <Button type="submit" variant="primary" disabled={saving}>
                {saving ? "Saving..." : t.common.save}
              </Button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}
