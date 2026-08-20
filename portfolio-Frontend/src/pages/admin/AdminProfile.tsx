import { useEffect, useRef, useState, type FormEvent } from "react";
import { Upload, CheckCircle2, AlertCircle } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { portfolioService } from "../../services/portfolioService";
import { mediaService } from "../../services/mediaService";
import { authService } from "../../services/authService";
import { resolveMediaUrl } from "../../utils/media";
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
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarMsg, setAvatarMsg] = useState<{ text: string; type: "success" | "error" } | null>(null);
  const avatarInputRef = useRef<HTMLInputElement>(null);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdSaving, setPwdSaving] = useState(false);
  const [pwdError, setPwdError] = useState<string | null>(null);
  const [pwdSuccess, setPwdSuccess] = useState(false);

  useEffect(() => {
    if (profile) setForm(profile);
  }, [profile]);

  function update<K extends keyof Profile>(key: K, value: Profile[K]) {
    setForm((prev) => (prev ? { ...prev, [key]: value } : prev));
  }

  async function handleAvatarUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setAvatarUploading(true);
    setAvatarMsg(null);
    try {
      const res = await mediaService.uploadAvatar(file);
      update("avatarUrl", res.url);
      setAvatarMsg({ text: `Photo "${file.name}" uploaded and saved in PostgreSQL database!`, type: "success" });
    } catch (err: any) {
      setAvatarMsg({ text: err.message || "Failed to upload photo to database.", type: "error" });
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = "";
    }
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

  async function handlePasswordChange(e: FormEvent) {
    e.preventDefault();
    setPwdError(null);
    setPwdSuccess(false);

    if (!oldPassword || !newPassword) {
      setPwdError("Please enter both current and new passwords.");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("New password must be at least 6 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("New password and confirm password do not match.");
      return;
    }

    setPwdSaving(true);
    try {
      await authService.changePassword(oldPassword, newPassword);
      setPwdSuccess(true);
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setTimeout(() => setPwdSuccess(false), 4000);
    } catch (err: any) {
      setPwdError(err.message || "Failed to update password.");
    } finally {
      setPwdSaving(false);
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.profile}</h1>
          <p>Manage your profile, bio, contact details, and database-stored avatar photo.</p>
        </div>
      </div>

      {state === "loading" && (
        <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />
      )}
      {state === "error" && (
        <StatusView variant="error" loadingLabel="" emptyLabel="" errorLabel="Unable to load profile." retryLabel={t.common.retry} onRetry={reload} />
      )}

      {form && (
        <>
          <form className="admin-panel" style={{ padding: "var(--sp-6)", marginBottom: "var(--sp-6)" }} onSubmit={handleSubmit}>
            <div className="admin-form">
              {/* Avatar Section with Instant Photo Upload */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "var(--sp-5)",
                  padding: "var(--sp-4)",
                  backgroundColor: "var(--bg-2)",
                  borderRadius: "var(--radius-md)",
                  marginBottom: "var(--sp-4)",
                  flexWrap: "wrap",
                }}
              >
                <img
                  src={resolveMediaUrl(form.avatarUrl, "/avatar-placeholder.svg")}
                  alt="Profile Avatar"
                  style={{
                    width: 72,
                    height: 72,
                    borderRadius: "50%",
                    objectFit: "cover",
                    border: "2px solid var(--accent-500)",
                    backgroundColor: "var(--bg-3)",
                  }}
                  onError={(e) => {
                    (e.currentTarget as HTMLImageElement).src = "/avatar-placeholder.svg";
                  }}
                />
                <div style={{ flex: 1, minWidth: 220 }}>
                  <p style={{ fontWeight: 600, fontSize: "var(--fs-sm)", marginBottom: "4px" }}>Profile Photo</p>
                  <p style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)", marginBottom: "8px" }}>
                    Stored in PostgreSQL database. No need to copy files into project folders!
                  </p>
                  <input
                    ref={avatarInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp,image/svg+xml,image/gif"
                    onChange={handleAvatarUpload}
                    style={{ display: "none" }}
                    id="avatar-file-input"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    icon={<Upload size={14} />}
                    onClick={() => avatarInputRef.current?.click()}
                    disabled={avatarUploading}
                  >
                    {avatarUploading ? "Saving to Database..." : "Upload Photo to Database"}
                  </Button>
                </div>
              </div>

              {avatarMsg && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    padding: "8px 12px",
                    borderRadius: "var(--radius-sm)",
                    marginBottom: "var(--sp-4)",
                    fontSize: "var(--fs-sm)",
                    color: avatarMsg.type === "success" ? "var(--success-500)" : "var(--error-500)",
                    backgroundColor: avatarMsg.type === "success" ? "rgba(34, 197, 94, 0.1)" : "rgba(239, 68, 68, 0.1)",
                  }}
                >
                  {avatarMsg.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                  {avatarMsg.text}
                </div>
              )}

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
                <label htmlFor="p-avatar">Avatar URL / API Endpoint</label>
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
                {savedMessage && <span style={{ color: "var(--success-500)", fontSize: "var(--fs-sm)", alignSelf: "center", marginInlineEnd: "auto" }}>Saved successfully to database.</span>}
                <Button type="button" variant="secondary" onClick={() => setForm(profile)}>
                  {t.common.cancel}
                </Button>
                <Button type="submit" variant="primary" disabled={saving}>
                  {saving ? "Saving..." : t.common.save}
                </Button>
              </div>
            </div>
          </form>

          <form className="admin-panel" style={{ padding: "var(--sp-6)" }} onSubmit={handlePasswordChange}>
            <div className="admin-form">
              <div style={{ marginBottom: "var(--sp-4)" }}>
                <h2 style={{ fontSize: "var(--fs-lg)", fontWeight: "var(--fw-semibold)", margin: 0 }}>Security & Password</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "var(--fs-sm)", marginTop: "var(--sp-1)" }}>
                  Change your admin dashboard login password.
                </p>
              </div>

              <div className="admin-form__field">
                <label htmlFor="p-old-pwd">Current Password</label>
                <input
                  id="p-old-pwd"
                  type="password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  placeholder="Enter current password"
                />
              </div>

              <div className="admin-form__row">
                <div className="admin-form__field">
                  <label htmlFor="p-new-pwd">New Password</label>
                  <input
                    id="p-new-pwd"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Minimum 6 characters"
                  />
                </div>
                <div className="admin-form__field">
                  <label htmlFor="p-confirm-pwd">Confirm New Password</label>
                  <input
                    id="p-confirm-pwd"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Repeat new password"
                  />
                </div>
              </div>

              {pwdError && (
                <div style={{ color: "var(--danger-500)", fontSize: "var(--fs-sm)", marginTop: "var(--sp-2)" }}>
                  {pwdError}
                </div>
              )}

              {pwdSuccess && (
                <div style={{ color: "var(--success-500)", fontSize: "var(--fs-sm)", marginTop: "var(--sp-2)" }}>
                  Password updated successfully!
                </div>
              )}

              <div className="admin-form__actions" style={{ marginTop: "var(--sp-4)" }}>
                <Button type="submit" variant="primary" disabled={pwdSaving}>
                  {pwdSaving ? "Updating Password..." : "Update Password"}
                </Button>
              </div>
            </div>
          </form>
        </>
      )}
    </div>
  );
}
