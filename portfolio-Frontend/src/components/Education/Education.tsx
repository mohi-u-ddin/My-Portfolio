import { GraduationCap } from "lucide-react";
import { useLanguage } from "../../contexts/LanguageContext";
import { educationService } from "../../services/educationService";
import { useAsyncData } from "../../hooks/useAsyncData";
import { StatusView } from "../common/StatusView";
import { formatDateRange } from "../../utils/formatDate";
import "./Education.css";

export function Education() {
  const { t, locale } = useLanguage();
  const { data: education, state, errorMessage, reload } = useAsyncData(() => educationService.getEducation());

  return (
    <section id="education" className="section education">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{t.education.eyebrow}</p>
          <h2 className="section-title">{t.education.title}</h2>
        </div>

        {state === "loading" && (
          <StatusView variant="loading" loadingLabel={t.education.loading} emptyLabel="" errorLabel="" retryLabel="" />
        )}

        {state === "error" && (
          <StatusView
            variant="error"
            loadingLabel=""
            emptyLabel=""
            errorLabel={errorMessage ?? t.education.error}
            retryLabel={t.education.retry}
            onRetry={reload}
          />
        )}

        {state === "empty" && (
          <StatusView variant="empty" loadingLabel="" emptyLabel={t.education.empty} errorLabel="" retryLabel="" />
        )}

        {state === "success" && (
          <div className="education__grid">
            {education!.map((item) => (
              <div className="education-card" key={item.id}>
                <div className="education-card__icon">
                  <GraduationCap size={22} />
                </div>
                <div className="education-card__body">
                  <h3>{item.degree}</h3>
                  <p className="education-card__institution">{item.institution}</p>
                  <p className="education-card__dates">
                    {formatDateRange(item.startDate, item.endDate, t.experience.present, locale === "ur" ? "ur-PK" : "en-US")}
                  </p>
                  {item.description && <p className="education-card__desc">{item.description}</p>}
                  {item.achievements && item.achievements.length > 0 && (
                    <ul className="education-card__achievements">
                      {item.achievements.map((achievement, idx) => (
                        <li key={idx}>{achievement}</li>
                      ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
