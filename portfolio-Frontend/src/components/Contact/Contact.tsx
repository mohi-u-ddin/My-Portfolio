import { Mail } from "lucide-react";
import { GithubIcon, LinkedinIcon } from "../common/BrandIcons";
import { useLanguage } from "../../contexts/LanguageContext";
import { ContactForm } from "./ContactForm";
import type { Profile } from "../../types";
import "./Contact.css";

export function Contact({ profile }: { profile: Profile | null }) {
  const { t } = useLanguage();

  return (
    <section id="contact" className="section contact">
      <div className="container contact__inner">
        <div className="contact__intro">
          <p className="eyebrow">{t.contact.eyebrow}</p>
          <h2 className="section-title">{t.contact.title}</h2>
          <p className="section-sub">{t.contact.subtitle}</p>

          <ul className="contact__links">
            <li>
              <a href={`mailto:${profile?.email ?? ""}`}>
                <span className="contact__link-icon"><Mail size={18} /></span>
                {profile?.email}
              </a>
            </li>
            <li>
              <a href={profile?.githubUrl ?? "#"} target="_blank" rel="noreferrer">
                <span className="contact__link-icon"><GithubIcon size={18} /></span>
                GitHub
              </a>
            </li>
            <li>
              <a href={profile?.linkedinUrl ?? "#"} target="_blank" rel="noreferrer">
                <span className="contact__link-icon"><LinkedinIcon size={18} /></span>
                LinkedIn
              </a>
            </li>
          </ul>
        </div>

        <div className="contact__form-card">
          <ContactForm />
        </div>
      </div>
    </section>
  );
}
