import { useLanguage } from "../../contexts/LanguageContext";
import type { Profile } from "../../types";
import "./About.css";

export function About({ profile }: { profile: Profile | null }) {
  const { t } = useLanguage();

  return (
    <section id="about" className="section about">
      <div className="container about__inner">
        <div className="about__media">
          <div className="about__frame">
            <img src={profile?.avatarUrl ?? "/avatar-placeholder.svg"} alt={profile?.name ?? "Profile"} />
          </div>
          <div className="about__stats">
            {(profile?.stats ?? []).map((stat) => (
              <div className="about__stat" key={stat.id}>
                <span className="about__stat-value">{stat.value}</span>
                <span className="about__stat-label">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="about__content">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2 className="section-title">{t.about.title}</h2>
          <p className="about__bio">{profile?.bio}</p>

          <div className="about__goals">
            <h3>{t.about.goalsTitle}</h3>
            <p>{t.about.goals}</p>
          </div>

          <dl className="about__meta">
            <div>
              <dt>{t.contact.formEmail}</dt>
              <dd>{profile?.email}</dd>
            </div>
            <div>
              <dt>Location</dt>
              <dd>{profile?.location}</dd>
            </div>
            <div>
              <dt>Status</dt>
              <dd>{profile?.availability}</dd>
            </div>
          </dl>
        </div>
      </div>
    </section>
  );
}
