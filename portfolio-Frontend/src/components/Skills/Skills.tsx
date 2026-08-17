import { useMemo, useState } from "react";
import { useLanguage } from "../../contexts/LanguageContext";
import { skillService } from "../../services/skillService";
import { useAsyncData } from "../../hooks/useAsyncData";
import { StatusView } from "../common/StatusView";
import { SkillIcon } from "./SkillIcon";
import "./Skills.css";

const CATEGORY_ORDER = ["Backend", "Database", "Frontend", "Tools"] as const;

export function Skills() {
  const { t } = useLanguage();
  const { data: skills, state, errorMessage, reload } = useAsyncData(() => skillService.getSkills());
  const [activeCategory, setActiveCategory] = useState<string>("All");

  const categories = useMemo(() => {
    const present = new Set((skills ?? []).map((s) => s.category));
    return ["All", ...CATEGORY_ORDER.filter((c) => present.has(c))];
  }, [skills]);

  const filtered = useMemo(() => {
    if (!skills) return [];
    return activeCategory === "All" ? skills : skills.filter((s) => s.category === activeCategory);
  }, [skills, activeCategory]);

  return (
    <section id="skills" className="section skills">
      <div className="container">
        <div className="section-head">
          <p className="eyebrow">{t.skills.eyebrow}</p>
          <h2 className="section-title">{t.skills.title}</h2>
          <p className="section-sub">{t.skills.subtitle}</p>
        </div>

        {state === "success" && (
          <div className="skills__filters" role="tablist" aria-label="Skill categories">
            {categories.map((cat) => (
              <button
                key={cat}
                role="tab"
                aria-selected={activeCategory === cat}
                className={`skills__filter ${activeCategory === cat ? "skills__filter--active" : ""}`}
                onClick={() => setActiveCategory(cat)}
              >
                {cat === "All" ? "All" : t.skills.categories[cat as keyof typeof t.skills.categories] ?? cat}
              </button>
            ))}
          </div>
        )}

        {state === "loading" && (
          <StatusView variant="loading" loadingLabel={t.common.loading} emptyLabel="" errorLabel="" retryLabel="" />
        )}

        {state === "error" && (
          <StatusView
            variant="error"
            loadingLabel=""
            emptyLabel=""
            errorLabel={errorMessage ?? t.projects.error}
            retryLabel={t.common.retry}
            onRetry={reload}
          />
        )}

        {state === "empty" && (
          <StatusView variant="empty" loadingLabel="" emptyLabel={t.projects.empty} errorLabel="" retryLabel="" />
        )}

        {state === "success" && (
          <div className="skills__grid">
            {filtered.map((skill) => (
              <div className="skill-card" key={skill.id}>
                <span className="skill-card__icon">
                  <SkillIcon icon={skill.icon} />
                </span>
                <div className="skill-card__body">
                  <span className="skill-card__name">{skill.name}</span>
                  <span className="skill-card__level">{skill.level}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
