import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { settingsService } from "../../services/settingsService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import type { SiteSettings } from "../../types";
import "../../components/common/AdminPage.css";

export function AdminSettings() {
  const { t } = useLanguage();
  usePageMeta("Settings — Admin");
  const { data, state, reload } = useAsyncData(() => settingsService.getSettings());
  const [form, setForm] = useState<SiteSettings | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setForm(data);
  }, [data]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      await settingsService.updateSettings(form);
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.settings}</h1>
          <p>Site-wide configuration, SEO, and social links.</p>
        </div>
      </div>

      {state === "loading" && <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />}
      {state === "error" && (
        <StatusView variant="error" loadingLabel="" emptyLabel="" errorLabel="Unable to load settings." retryLabel={t.common.retry} onRetry={reload} />
      )}

      {form && (
        <form className="admin-panel" style={{ padding: "var(--sp-6)" }} onSubmit={handleSubmit}>
          <div className="admin-form">
            <div className="admin-form__field">
              <label htmlFor="st-title">Website title</label>
              <input id="st-title" value={form.siteTitle} onChange={(e) => setForm({ ...form, siteTitle: e.target.value })} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="st-desc">Website description</label>
              <textarea id="st-desc" rows={3} value={form.siteDescription} onChange={(e) => setForm({ ...form, siteDescription: e.target.value })} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="st-email">Contact email</label>
              <input id="st-email" type="email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} />
            </div>
            <div className="admin-form__row">
              <div className="admin-form__field">
                <label htmlFor="st-github">GitHub link</label>
                <input id="st-github" value={form.socialLinks.github} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, github: e.target.value } })} />
              </div>
              <div className="admin-form__field">
                <label htmlFor="st-linkedin">LinkedIn link</label>
                <input id="st-linkedin" value={form.socialLinks.linkedin} onChange={(e) => setForm({ ...form, socialLinks: { ...form.socialLinks, linkedin: e.target.value } })} />
              </div>
            </div>
            <div className="admin-form__field">
              <label htmlFor="st-resume">Resume URL</label>
              <input id="st-resume" value={form.resumeUrl} onChange={(e) => setForm({ ...form, resumeUrl: e.target.value })} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="st-seo-title">SEO meta title</label>
              <input id="st-seo-title" value={form.seo.metaTitle} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaTitle: e.target.value } })} />
            </div>
            <div className="admin-form__field">
              <label htmlFor="st-seo-desc">SEO meta description</label>
              <textarea id="st-seo-desc" rows={2} value={form.seo.metaDescription} onChange={(e) => setForm({ ...form, seo: { ...form.seo, metaDescription: e.target.value } })} />
            </div>
            <div className="admin-form__actions">
              {saved && <span style={{ color: "var(--success-500)", fontSize: "var(--fs-sm)", alignSelf: "center", marginInlineEnd: "auto" }}>Saved.</span>}
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
