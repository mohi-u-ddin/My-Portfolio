import { useState } from "react";
import {
  Mail,
  MailOpen,
  Trash2,
  Eye,
  Send,
  Search,
  CheckCircle2,
  RefreshCw,
  Clock,
  User,
  Inbox,
} from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { useAsyncData } from "../../hooks/useAsyncData";
import { usePageMeta } from "../../hooks/usePageMeta";
import { contactService } from "../../services/contactService";
import { StatusView } from "../../components/common/StatusView";
import { Button } from "../../components/common/Button";
import { Modal } from "../../components/common/Modal";
import type { ContactMessage } from "../../types";
import "../../components/common/AdminPage.css";

export function AdminMessages() {
  const { t } = useLanguage();
  usePageMeta("Messages — Admin");
  const { data: messages, state, errorMessage, reload } = useAsyncData(() => contactService.getMessages());

  const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busyId, setBusyId] = useState<number | null>(null);

  const totalCount = messages?.length ?? 0;
  const unreadCount = messages?.filter((m) => !m.read).length ?? 0;
  const readCount = totalCount - unreadCount;

  const filteredMessages = (messages ?? []).filter((msg) => {
    if (activeTab === "unread" && msg.read) return false;
    if (activeTab === "read" && !msg.read) return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = msg.name?.toLowerCase().includes(q);
      const matchEmail = msg.email?.toLowerCase().includes(q);
      const matchSubject = msg.subject?.toLowerCase().includes(q);
      const matchMessage = msg.message?.toLowerCase().includes(q);
      return matchName || matchEmail || matchSubject || matchMessage;
    }

    return true;
  });

  async function handleToggleRead(msg: ContactMessage, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    setBusyId(msg.id);
    try {
      const updated = await contactService.markAsRead(msg.id, !msg.read);
      if (selectedMessage?.id === msg.id) {
        setSelectedMessage(updated);
      }
      reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleDelete(id: number, e?: React.MouseEvent) {
    if (e) e.stopPropagation();
    if (!confirm("Are you sure you want to delete this message?")) return;
    setBusyId(id);
    try {
      await contactService.deleteMessage(id);
      if (selectedMessage?.id === id) {
        setIsModalOpen(false);
        setSelectedMessage(null);
      }
      reload();
    } finally {
      setBusyId(null);
    }
  }

  async function handleOpenDetail(msg: ContactMessage) {
    setSelectedMessage(msg);
    setIsModalOpen(true);
    if (!msg.read) {
      try {
        const updated = await contactService.markAsRead(msg.id, true);
        setSelectedMessage(updated);
        reload();
      } catch {
      }
    }
  }

  function formatDate(dateStr: string) {
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString(undefined, {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return dateStr;
    }
  }

  return (
    <div>
      <div className="admin-page__head">
        <div>
          <h1>{t.admin.messages}</h1>
          <p>View, read, and manage contact inquiries sent by visitors.</p>
        </div>
        <div style={{ display: "flex", gap: "var(--sp-2)" }}>
          <Button variant="secondary" icon={<RefreshCw size={15} />} onClick={reload}>
            Refresh
          </Button>
        </div>
      </div>

      <div className="admin-stat-grid">
        <div className="admin-stat-card">
          <span className="admin-stat-card__icon">
            <Inbox size={20} />
          </span>
          <div>
            <p className="admin-stat-card__value">{totalCount}</p>
            <p className="admin-stat-card__label">{t.admin.totalMessages}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__icon" style={{ color: "var(--accent-400)", background: "rgba(56, 189, 248, 0.12)" }}>
            <Mail size={20} />
          </span>
          <div>
            <p className="admin-stat-card__value" style={{ color: unreadCount > 0 ? "var(--accent-400)" : undefined }}>
              {unreadCount}
            </p>
            <p className="admin-stat-card__label">{t.admin.unreadMessages}</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <span className="admin-stat-card__icon" style={{ color: "var(--success-500)", background: "rgba(34, 197, 94, 0.12)" }}>
            <MailOpen size={20} />
          </span>
          <div>
            <p className="admin-stat-card__value">{readCount}</p>
            <p className="admin-stat-card__label">Read Messages</p>
          </div>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "var(--sp-3)",
          marginBottom: "var(--sp-4)",
        }}
      >
        <div style={{ display: "flex", gap: "var(--sp-2)" }}>
          <button
            type="button"
            className={`admin-icon-btn ${activeTab === "all" ? "admin-sidebar__link--active" : ""}`}
            style={{ width: "auto", padding: "6px 14px", height: "auto", fontWeight: 500 }}
            onClick={() => setActiveTab("all")}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            className={`admin-icon-btn ${activeTab === "unread" ? "admin-sidebar__link--active" : ""}`}
            style={{ width: "auto", padding: "6px 14px", height: "auto", fontWeight: 500 }}
            onClick={() => setActiveTab("unread")}
          >
            Unread ({unreadCount})
          </button>
          <button
            type="button"
            className={`admin-icon-btn ${activeTab === "read" ? "admin-sidebar__link--active" : ""}`}
            style={{ width: "auto", padding: "6px 14px", height: "auto", fontWeight: 500 }}
            onClick={() => setActiveTab("read")}
          >
            Read ({readCount})
          </button>
        </div>

        <div style={{ position: "relative", minWidth: "260px" }}>
          <Search
            size={16}
            style={{
              position: "absolute",
              left: "10px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--text-3)",
            }}
          />
          <input
            type="text"
            placeholder="Search by name, email, topic..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "8px 12px 8px 34px",
              background: "var(--surface)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-sm)",
              color: "var(--text-1)",
              fontSize: "var(--fs-sm)",
            }}
          />
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
          errorLabel={errorMessage ?? "Unable to load contact messages."}
          retryLabel={t.common.retry}
          onRetry={reload}
        />
      )}

      {state === "success" && (
        <div className="admin-panel">
          <table className="admin-table">
            <thead>
              <tr>
                <th style={{ width: "100px" }}>Status</th>
                <th>Sender</th>
                <th>Subject</th>
                <th>Received</th>
                <th style={{ width: "140px" }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredMessages.map((msg) => (
                <tr
                  key={msg.id}
                  style={{
                    cursor: "pointer",
                    backgroundColor: msg.read ? "transparent" : "rgba(56, 189, 248, 0.04)",
                  }}
                  onClick={() => handleOpenDetail(msg)}
                >
                  <td>
                    {!msg.read ? (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "var(--fs-2xs)",
                          fontWeight: 600,
                          backgroundColor: "rgba(56, 189, 248, 0.15)",
                          color: "var(--accent-400)",
                        }}
                      >
                        <span
                          style={{
                            width: "6px",
                            height: "6px",
                            borderRadius: "50%",
                            backgroundColor: "var(--accent-400)",
                          }}
                        />
                        New
                      </span>
                    ) : (
                      <span
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: "5px",
                          padding: "3px 8px",
                          borderRadius: "12px",
                          fontSize: "var(--fs-2xs)",
                          color: "var(--text-3)",
                          backgroundColor: "var(--bg-2)",
                        }}
                      >
                        Read
                      </span>
                    )}
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <span style={{ fontWeight: msg.read ? 500 : 700, color: "var(--text-1)" }}>
                        {msg.name}
                      </span>
                      <span style={{ fontSize: "var(--fs-xs)", color: "var(--text-3)" }}>
                        {msg.email}
                      </span>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: "flex", flexDirection: "column", maxWidth: "420px" }}>
                      <span
                        style={{
                          fontWeight: msg.read ? 400 : 600,
                          color: "var(--text-1)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.subject}
                      </span>
                      <span
                        style={{
                          fontSize: "var(--fs-xs)",
                          color: "var(--text-3)",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {msg.message}
                      </span>
                    </div>
                  </td>
                  <td style={{ fontSize: "var(--fs-xs)", color: "var(--text-2)", whiteSpace: "nowrap" }}>
                    {formatDate(msg.createdAt)}
                  </td>
                  <td>
                    <div className="admin-table__actions" onClick={(e) => e.stopPropagation()}>
                      <button
                        className="admin-icon-btn"
                        onClick={() => handleOpenDetail(msg)}
                        title="View Message"
                        aria-label={`View message from ${msg.name}`}
                      >
                        <Eye size={14} />
                      </button>
                      <button
                        className="admin-icon-btn"
                        onClick={(e) => handleToggleRead(msg, e)}
                        disabled={busyId === msg.id}
                        title={msg.read ? "Mark as unread" : "Mark as read"}
                        aria-label={msg.read ? "Mark as unread" : "Mark as read"}
                      >
                        {msg.read ? <Mail size={14} /> : <CheckCircle2 size={14} />}
                      </button>
                      <a
                        href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
                        className="admin-icon-btn"
                        title="Reply via Email"
                        aria-label={`Reply to ${msg.email}`}
                      >
                        <Send size={14} />
                      </a>
                      <button
                        className="admin-icon-btn admin-icon-btn--danger"
                        onClick={(e) => handleDelete(msg.id, e)}
                        disabled={busyId === msg.id}
                        title="Delete Message"
                        aria-label={`Delete message from ${msg.name}`}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredMessages.length === 0 && (
                <tr className="admin-empty-row">
                  <td colSpan={5}>
                    {searchQuery ? "No messages match your search query." : "No messages found."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <Modal
        isOpen={isModalOpen && selectedMessage !== null}
        onClose={() => {
          setIsModalOpen(false);
          setSelectedMessage(null);
        }}
        title="Contact Inquiry Details"
        closeLabel={t.common.close}
      >
        {selectedMessage && (
          <div style={{ display: "flex", flexDirection: "column", gap: "var(--sp-4)" }}>
            <div
              style={{
                background: "var(--bg-1)",
                border: "1px solid var(--border)",
                borderRadius: "var(--radius-md)",
                padding: "var(--sp-4)",
                display: "flex",
                flexDirection: "column",
                gap: "var(--sp-2)",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "8px" }}>
                <div>
                  <h3 style={{ fontSize: "var(--fs-lg)", fontWeight: 600, color: "var(--text-1)", marginBottom: "4px" }}>
                    {selectedMessage.subject}
                  </h3>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", color: "var(--text-2)", fontSize: "var(--fs-sm)" }}>
                    <User size={15} style={{ color: "var(--accent-400)" }} />
                    <span style={{ fontWeight: 600 }}>{selectedMessage.name}</span>
                    <span>&lt;{selectedMessage.email}&gt;</span>
                  </div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "6px", color: "var(--text-3)", fontSize: "var(--fs-xs)" }}>
                  <Clock size={13} />
                  <span>{formatDate(selectedMessage.createdAt)}</span>
                </div>
              </div>
            </div>

            <div className="admin-form__field">
              <label style={{ color: "var(--text-3)", fontSize: "var(--fs-xs)", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Message Content
              </label>
              <div
                style={{
                  background: "var(--bg-1)",
                  border: "1px solid var(--border)",
                  borderRadius: "var(--radius-md)",
                  padding: "var(--sp-4)",
                  color: "var(--text-1)",
                  fontSize: "var(--fs-sm)",
                  lineHeight: "1.6",
                  whiteSpace: "pre-wrap",
                  minHeight: "140px",
                }}
              >
                {selectedMessage.message}
              </div>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "var(--sp-3)",
                paddingTop: "var(--sp-2)",
                borderTop: "1px solid var(--border-soft)",
              }}
            >
              <div style={{ display: "flex", gap: "var(--sp-2)" }}>
                <Button
                  variant="secondary"
                  icon={selectedMessage.read ? <Mail size={15} /> : <CheckCircle2 size={15} />}
                  onClick={() => handleToggleRead(selectedMessage)}
                  disabled={busyId === selectedMessage.id}
                >
                  {selectedMessage.read ? "Mark as Unread" : "Mark as Read"}
                </Button>
                <Button
                  variant="secondary"
                  icon={<Trash2 size={15} />}
                  onClick={() => handleDelete(selectedMessage.id)}
                  disabled={busyId === selectedMessage.id}
                  style={{ color: "var(--error-500)" }}
                >
                  Delete
                </Button>
              </div>

              <div style={{ display: "flex", gap: "var(--sp-2)" }}>
                <a
                  href={`mailto:${selectedMessage.email}?subject=Re: ${encodeURIComponent(selectedMessage.subject)}&body=${encodeURIComponent(
                    `\n\n--- On ${formatDate(selectedMessage.createdAt)}, ${selectedMessage.name} wrote: ---\n` +
                      selectedMessage.message
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ textDecoration: "none" }}
                >
                  <Button variant="primary" icon={<Send size={15} />}>
                    Reply via Email
                  </Button>
                </a>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}
