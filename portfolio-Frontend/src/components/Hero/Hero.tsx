import { ArrowDown } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/BrandIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import { Button } from "../common/Button";
import { CodeCard } from "./CodeCard";
import { resolveMediaUrl } from "../../utils/media";
import type { Profile } from "../../types";
import "./Hero.css";

export function Hero({ profile }: { profile: Profile | null }) {
  const { t } = useLanguage();

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  const avatarSrc = resolveMediaUrl(profile?.avatarUrl, "/avatar-placeholder.svg");
  const rawResumeUrl = profile?.resumeUrl || "/api/resume/download";
  const resumeHref = resolveMediaUrl(rawResumeUrl, "/api/resume/download");

  return (
    <section id="home" className="hero">
      <div className="hero__glow" aria-hidden="true" />
      <div className="container hero__inner">
        <div className="hero__content">
          <p className="hero__greeting">{t.hero.greeting}</p>
          <h1 className="hero__name">{profile?.name || "Mohi Ud Din"}</h1>
          <p className="hero__role">{profile?.title || t.hero.role}</p>
          <p className="hero__stack">{profile?.tagline || t.hero.stack}</p>
          <p className="hero__description">{profile?.bio || t.hero.description}</p>

          <div className="hero__cta-row">
            <Button variant="primary" onClick={() => scrollTo("projects")}>
              {t.hero.ctaProjects}
            </Button>
            <Button
              variant="secondary"
              as="a"
              href={`${resumeHref}${resumeHref.includes("?") ? "&" : "?"}download=true`}
              download="Resume.pdf"
            >
              {t.hero.ctaResume}
            </Button>
            <Button variant="ghost" onClick={() => scrollTo("contact")}>
              {t.hero.ctaContact}
            </Button>
          </div>

          <div className="hero__social">
            {profile?.githubUrl && (
              <a href={profile.githubUrl} target="_blank" rel="noreferrer" aria-label="GitHub profile">
                <GithubIcon size={20} />
              </a>
            )}
            {profile?.linkedinUrl && (
              <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn profile">
                <LinkedinIcon size={20} />
              </a>
            )}
          </div>
        </div>

        <div className="hero__visual">
          <div className="hero__avatar-ring">
            <img
              src={avatarSrc}
              alt={profile?.name || "Profile avatar"}
              className="hero__avatar"
              onError={(e) => {
                // Fallback to placeholder if custom image fails
                (e.currentTarget as HTMLImageElement).src = "/avatar-placeholder.svg";
              }}
            />
          </div>
          <CodeCard />
        </div>
      </div>

      <button className="hero__scroll-cue" onClick={() => scrollTo("about")} aria-label="Scroll to About section">
        <ArrowDown size={18} />
      </button>
    </section>
  );
}
