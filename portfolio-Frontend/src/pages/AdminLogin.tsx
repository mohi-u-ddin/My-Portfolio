import { useState, type FormEvent } from "react";
import { Navigate, useLocation, useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, LogIn, ArrowLeft } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { useLanguage } from "../contexts/LanguageContext";
import { usePageMeta } from "../hooks/usePageMeta";
import { Button } from "../components/common/Button";
import "./AdminLogin.css";

export function AdminLogin() {
  const { isAuthenticated, login, isLoading, error } = useAuth();
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);

  usePageMeta("Admin Login — Mohi Ud Din");

  if (isAuthenticated) {
    const redirectTo = (location.state as { from?: Location })?.from?.pathname || "/admin";
    return <Navigate to={redirectTo} replace />;
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setFormError(null);
    if (!email || !password) {
      setFormError(t.contact.validation.required);
      return;
    }
    try {
      await login({ email, password, rememberMe });
      navigate("/admin", { replace: true });
    } catch {
    }
  }

  return (
    <div className="admin-login">
      <div className="admin-login__card">
        <Link to="/" className="admin-login__back">
          <ArrowLeft size={14} /> {t.admin.backToSite}
        </Link>

        <div className="admin-login__brand">
          <span className="admin-login__brand-mark">MU</span>
        </div>

        <h1>{t.admin.loginTitle}</h1>
        <p className="admin-login__subtitle">{t.admin.loginSubtitle}</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="admin-login__field">
            <label htmlFor="al-email">{t.admin.email}</label>
            <input
              id="al-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
            />
          </div>

          <div className="admin-login__field">
            <label htmlFor="al-password">{t.admin.password}</label>
            <div className="admin-login__password-wrap">
              <input
                id="al-password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="admin-login__toggle-visibility"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <label className="admin-login__remember">
            <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
            {t.admin.rememberMe}
          </label>

          {(formError || error) && (
            <p className="admin-login__error" role="alert">
              {formError || error}
            </p>
          )}

          <Button type="submit" variant="primary" fullWidth disabled={isLoading} icon={<LogIn size={16} />}>
            {isLoading ? t.admin.loggingIn : t.admin.login}
          </Button>
        </form>
      </div>
    </div>
  );
}
