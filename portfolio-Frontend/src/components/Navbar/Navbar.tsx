import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Moon, Sun, Globe, Menu, X } from "lucide-react";
import { useTheme } from "../../contexts/ThemeContext";
import { useLanguage } from "../../contexts/LanguageContext";
import { useScrolled } from "../../hooks/useScrolled";
import { useScrollSpy } from "../../hooks/useScrollSpy";
import { Button } from "../common/Button";
import "./Navbar.css";

const SECTION_IDS = ["home", "about", "skills", "projects", "experience", "education", "resume", "contact"];

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { locale, setLocale, t } = useLanguage();
  const scrolled = useScrolled();
  const activeSection = useScrollSpy(SECTION_IDS);
  const [menuOpen, setMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const navItems: { id: string; label: string }[] = [
    { id: "home", label: t.nav.home },
    { id: "about", label: t.nav.about },
    { id: "skills", label: t.nav.skills },
    { id: "projects", label: t.nav.projects },
    { id: "experience", label: t.nav.experience },
    { id: "education", label: t.nav.education },
    { id: "resume", label: t.nav.resume },
    { id: "contact", label: t.nav.contact },
  ];

  function goToSection(id: string) {
    setMenuOpen(false);
    if (location.pathname !== "/") {
      navigate("/");
      window.setTimeout(() => {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      }, 60);
      return;
    }
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <header className={`navbar ${scrolled ? "navbar--scrolled" : ""}`}>
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand" onClick={() => setMenuOpen(false)}>
          <span className="navbar__brand-mark">MU</span>
          <span className="navbar__brand-name">Mohi Ud Din</span>
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`navbar__link ${activeSection === item.id ? "navbar__link--active" : ""}`}
              onClick={() => goToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
        </nav>

        <div className="navbar__actions">
          <button
            className="navbar__icon-btn"
            onClick={() => setLocale(locale === "en" ? "ur" : "en")}
            aria-label="Toggle language"
            title={locale === "en" ? "اردو" : "English"}
          >
            <Globe size={18} />
            <span className="navbar__icon-btn-label">{locale === "en" ? "EN" : "UR"}</span>
          </button>
          <button
            className="navbar__icon-btn"
            onClick={toggleTheme}
            aria-label="Toggle theme"
            title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
          >
            {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="navbar__cta">
            <Button variant="primary" onClick={() => goToSection("contact")}>
              {t.nav.hireMe}
            </Button>
          </div>
          <button
            className="navbar__icon-btn navbar__menu-toggle"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {menuOpen && (
        <div className="navbar__mobile" role="dialog" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`navbar__mobile-link ${activeSection === item.id ? "navbar__mobile-link--active" : ""}`}
              onClick={() => goToSection(item.id)}
            >
              {item.label}
            </button>
          ))}
          <Button variant="primary" fullWidth onClick={() => goToSection("contact")}>
            {t.nav.hireMe}
          </Button>
        </div>
      )}
    </header>
  );
}
