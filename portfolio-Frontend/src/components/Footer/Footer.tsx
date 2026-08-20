import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/BrandIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import type { Profile } from "../../types";
import "./Footer.css";

export function Footer({ profile }: { profile: Profile | null }) {
  const { t } = useLanguage();
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="container footer__inner">
        <div>
          <p className="footer__brand">{profile?.name ?? "Mohi Ud Din"}</p>
          <p className="footer__tagline">{t.hero.role}</p>
        </div>

        <div className="footer__social">
          <a href={`mailto:${profile?.email ?? ""}`} aria-label="Email">
            <Mail size={18} />
          </a>
          <a href={profile?.githubUrl ?? "#"} target="_blank" rel="noreferrer" aria-label="GitHub">
            <GithubIcon size={18} />
          </a>
          <a href={profile?.linkedinUrl ?? "#"} target="_blank" rel="noreferrer" aria-label="LinkedIn">
            <LinkedinIcon size={18} />
          </a>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>
          © {year} {profile?.name ?? "Mohi Ud Din"}. {t.footer.rights}
        </p>
        <div style={{ display: "flex", gap: "var(--sp-4)", alignItems: "center" }}>
          <span>{t.footer.builtWith}</span>
          <Link to="/admin/login" style={{ color: "var(--text-3)", textDecoration: "none", fontSize: "var(--fs-2xs)", opacity: 0.7 }}>
            Admin Portal
          </Link>
        </div>
      </div>
    </footer>
  );
}
