import { useLanguage } from "../../contexts/LanguageContext";
import { experienceService } from "../../services/experienceService";
import { useAsyncData } from "../../hooks/useAsyncData";
import { StatusView } from "../common/StatusView";
import { Badge } from "../common/Badge";
import { formatDateRange } from "../../utils/formatDate";
import "./Experience.css";

export function Experience() {
  const { t, locale } = useLanguage();
  const { data: experience, state, errorMessage, reload } = useAsyncData(() => experienceService.getExperience());

  return (
    <section id="experience" className="section experience">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{t.experience.eyebrow}</p>
          <h2 className="section-title">{t.experience.title}</h2>
        </div>

        {state === "loading" && (
          <StatusView variant="loading" loadingLabel={t.experience.loading} emptyLabel="" errorLabel="" retryLabel="" />
        )}

        {state === "error" && (
          <StatusView
            variant="error"
            loadingLabel=""
            emptyLabel=""
            errorLabel={errorMessage ?? t.experience.error}
            retryLabel={t.experience.retry}
            onRetry={reload}
          />
        )}

        {state === "empty" && (
          <StatusView variant="empty" loadingLabel="" emptyLabel={t.experience.empty} errorLabel="" retryLabel="" />
        )}

        {state === "success" && (
          <ol className="timeline">
            {experience!.map((item) => (
              <li className="timeline__item" key={item.id}>
                <div className="timeline__marker" aria-hidden="true" />
                <div className="timeline__card">
                  <div className="timeline__head">
                    <div>
                      <h3 className="timeline__position">{item.position}</h3>
                      <p className="timeline__company">
                        {item.company} · {item.location}
                      </p>
                    </div>
                    <span className="timeline__dates">
                      {formatDateRange(item.startDate, item.endDate, t.experience.present, locale === "ur" ? "ur-PK" : "en-US")}
                    </span>
                  </div>
                  <ul className="timeline__bullets">
                    {item.description.map((line, idx) => (
                      <li key={idx}>{line}</li>
                    ))}
                  </ul>
                  <div className="timeline__tags">
                    {item.technologies.map((tech) => (
                      <Badge key={tech}>{tech}</Badge>
                    ))}
                  </div>
                </div>
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  );
}
