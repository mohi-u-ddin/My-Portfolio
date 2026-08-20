import { useRef, useState } from "react";
import { FileText, Upload, Trash2, Eye, Download, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { resumeService } from "../../services/resumeService";
import { resolveMediaUrl } from "../../utils/media";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import "../../components/common/AdminPage.css";

export function AdminResume() {
  const { t } = useLanguage();
  usePageMeta("Resume — Admin");
  const { data: resumeUrl, state, reload } = useAsyncData(() => resumeService.getResumeUrl());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busy, setBusy] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const resolvedUrl = resolveMediaUrl(resumeUrl || "/api/resume/download", "/api/resume/download");

  async function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith(".pdf")) {
      setErrorMsg("Please select a valid PDF file (.pdf).");
      return;
    }

    setBusy(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await resumeService.uploadResume(file);
      setSuccessMsg(`"${file.name}" was successfully uploaded and stored in the database.`);
      reload();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to upload resume to database.");
    } finally {
      setBusy(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleDelete() {
    if (!confirm("Are you sure you want to remove the current resume from the database?")) return;
    setBusy(true);
    setErrorMsg(null);
    setSuccessMsg(null);
    try {
      await resumeService.deleteResume();
      setSuccessMsg("Resume removed from database.");
      reload();
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to delete resume.");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.resume}</h1>
          <p>Upload and manage your PDF resume. Stored securely in PostgreSQL binary format.</p>
        </div>
      </div>

      {state === "loading" && (
        <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />
      )}

      {state === "error" && (
        <StatusView
          variant="error"
          loadingLabel=""
          emptyLabel=""
          errorLabel="Unable to load resume status."
          retryLabel={t.common.retry}
          onRetry={reload}
        />
      )}

      {state === "success" && (
        <div className="admin-panel" style={{ padding: "var(--sp-6)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "var(--sp-4)" }}>
            <span
              style={{
                width: 52,
                height: 52,
                borderRadius: "var(--radius-md)",
                background: "var(--grad-accent)",
                color: "#0A0D14",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
              }}
            >
              <FileText size={24} />
            </span>
            <div>
              <p style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>Active Resume</p>
              <p style={{ fontWeight: 600, fontSize: "var(--fs-md)" }}>
                {resumeUrl ? resumeUrl.split("/").pop() : "No resume uploaded yet"}
              </p>
              <p style={{ fontSize: "var(--fs-xs)", color: "var(--accent-400)", marginTop: "2px" }}>
                Stored in PostgreSQL Database
              </p>
            </div>
          </div>

          {successMsg && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "var(--sp-4)",
                color: "var(--success-500)",
                fontSize: "var(--fs-sm)",
                backgroundColor: "rgba(34, 197, 94, 0.1)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <CheckCircle2 size={16} /> {successMsg}
            </p>
          )}

          {errorMsg && (
            <p
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                marginTop: "var(--sp-4)",
                color: "var(--error-500)",
                fontSize: "var(--fs-sm)",
                backgroundColor: "rgba(239, 68, 68, 0.1)",
                padding: "8px 12px",
                borderRadius: "var(--radius-sm)",
              }}
            >
              <AlertCircle size={16} /> {errorMsg}
            </p>
          )}

          <div style={{ display: "flex", gap: "var(--sp-3)", marginTop: "var(--sp-6)", flexWrap: "wrap" }}>
            <input
              ref={fileInputRef}
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              style={{ display: "none" }}
              id="resume-upload"
            />
            <Button
              variant="primary"
              icon={<Upload size={16} />}
              onClick={() => fileInputRef.current?.click()}
              disabled={busy}
            >
              {busy ? "Uploading to Database..." : resumeUrl ? "Replace Resume PDF" : "Upload Resume PDF"}
            </Button>

            {resumeUrl && (
              <>
                <a href={resolvedUrl} target="_blank" rel="noopener noreferrer" style={{ textDecoration: "none" }}>
                  <Button variant="secondary" icon={<Eye size={16} />}>
                    View Live PDF
                  </Button>
                </a>
                <a
                  href={`${resolvedUrl}${resolvedUrl.includes("?") ? "&" : "?"}download=true`}
                  download="Resume.pdf"
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="secondary" icon={<Download size={16} />}>
                    Download
                  </Button>
                </a>
                <Button variant="secondary" icon={<Trash2 size={16} />} onClick={handleDelete} disabled={busy}>
                  {t.common.delete}
                </Button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
