import { useRef, useState } from "react";
import { FileText, Upload, Trash2 } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { resumeService } from "../../services/resumeService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import "../../components/common/AdminPage.css";

export function AdminResume() {
  const { t } = useLanguage();
  usePageMeta("Resume — Admin");
  const { data: resumeUrl, state, reload } = useAsyncData(() => resumeService.getResumeUrl());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      await resumeService.uploadResume(file);
      setMessage(`Replaced with "${file.name}". This will call POST /api/resume once the backend is live.`);
      reload();
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirm("Delete the current resume?")) return;
    setBusy(true);
    try {
      await resumeService.deleteResume();
      setMessage("Resume deleted.");
      reload();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.resume}</h1>
          <p>Manage the downloadable resume file used across the site.</p>
        </div>
      </div>

      {state === "loading" && <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />}

      {state === "success" && (
        <div className="admin-panel" style={{ padding: "var(--sp-6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)" }}>
            <span
              style={{
                width: 48,
                height: 48,
                borderRadius: "var(--radius-md)",
                background: "var(--grad-accent)",
                color: "#0A0D14",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={22} />
            </span>
            <div>
              <p style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>Current Resume</p>
              <p style={{ fontWeight: 600 }}>{resumeUrl?.split("/").pop()}</p>
            </div>
          </div>

          {message && <p style={{ marginTop: "var(--sp-4)", color: "var(--success-500)", fontSize: "var(--fs-sm)" }}>{message}</p>}

          <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-6)" }}>
            <input ref={fileInputRef} type="file" accept="application/pdf" onChange={handleFileChange} style={{ display: "none" }} id="resume-upload" />
            <Button variant="primary" icon={<Upload size={16} />} onClick={() => fileInputRef.current?.click()} disabled={busy}>
              Replace Resume
            </Button>
            <Button variant="secondary" icon={<Trash2 size={16} />} onClick={handleDelete} disabled={busy}>
              {t.common.delete}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
