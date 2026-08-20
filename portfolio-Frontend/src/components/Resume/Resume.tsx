import { Download, Eye, FileText } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../common/Button";
import { resolveMediaUrl } from "../../utils/media";
import type { Profile } from "../../types";
import "./Resume.css";

export function Resume({ profile }: { profile: Profile | null }) {
  const { t } = useLanguage();
  const rawUrl = profile?.resumeUrl || "/api/resume/download";
  const resumeUrl = resolveMediaUrl(rawUrl, "/api/resume/download");

  return (
    <section id="resume" className="section resume">
      <div className="container resume__inner">
        <div className="resume__icon">
          <FileText size={28} />
        </div>
        <p className="eyebrow">{t.resume.eyebrow}</p>
        <h2 className="section-title">{t.resume.title}</h2>
        <p className="section-sub" style={{ margin: "var(--sp-3) auto 0" }}>
          {t.resume.subtitle}
        </p>
        <div className="resume__actions">
          <Button
            as="a"
            href={`${resumeUrl}${resumeUrl.includes("?") ? "&" : "?"}download=true`}
            download="Resume.pdf"
            variant="primary"
            icon={<Download size={16} />}
          >
            {t.resume.download}
          </Button>
          <Button
            as="a"
            href={resumeUrl}
            target="_blank"
            rel="noopener noreferrer"
            variant="secondary"
            icon={<Eye size={16} />}
          >
            {t.resume.view}
          </Button>
        </div>
      </div>
    </section>
  );
}
