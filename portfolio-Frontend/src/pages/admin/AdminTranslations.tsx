import { useEffect, useState } from "react";
import { Save } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { translationService } from "../../services/translationService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import type { TranslationEntry } from "../../types";
import "../../components/common/AdminPage.css";

export function AdminTranslations() {
  const { t } = useLanguage();
  usePageMeta("Translations — Admin");
  const { data, state, reload } = useAsyncData(() => translationService.getTranslations());
  const [rows, setRows] = useState<TranslationEntry[]>([]);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (data) setRows(data);
  }, [data]);

  function updateCell(key: string, field: "en" | "ur", value: string) {
    setRows((prev) => prev.map((row) => (row.key === key ? { ...row, [field]: value } : row)));
  }

  async function handleSave() {
    setSaving(true);
    try {
      await translationService.updateTranslations(rows);
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
          <h1>{t.admin.translations}</h1>
          <p>Edit the English / Urdu strings that drive the multi-language site.</p>
        </div>
        <Button variant="primary" icon={<Save size={16} />} onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : t.common.save}
        </Button>
      </div>

      {state === "loading" && <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />}
      {state === "error" && (
        <StatusView variant="error" loadingLabel="" emptyLabel="" errorLabel="Unable to load translations." retryLabel={t.common.retry} onRetry={reload} />
      )}

      {state === "success" && (
        <div className="admin-panel">
          {saved && <p style={{ padding: "var(--sp-3) var(--sp-5)", color: "var(--success-500)", fontSize: "var(--fs-sm)" }}>Saved.</p>}
          <table className="admin-table">
            <thead>
              <tr>
                <th>Key</th>
                <th>English</th>
                <th>اردو</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.key}>
                  <td style={{ fontFamily: "var(--font-mono)", fontSize: "var(--fs-2xs)", color: "var(--text-3)" }}>{row.key}</td>
                  <td>
                    <input
                      value={row.en}
                      onChange={(e) => updateCell(row.key, "en", e.target.value)}
                      style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-1)" }}
                    />
                  </td>
                  <td>
                    <input
                      dir="rtl"
                      value={row.ur}
                      onChange={(e) => updateCell(row.key, "ur", e.target.value)}
                      style={{ width: "100%", background: "var(--bg-1)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", padding: "8px 10px", color: "var(--text-1)", fontFamily: "var(--font-urdu)" }}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
