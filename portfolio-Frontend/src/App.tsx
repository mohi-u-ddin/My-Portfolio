import type { ReactNode } from "react";
import { Routes, Route } from "react-router-dom";
import { PublicLayout } from "./layouts/PublicLayout";
import { AdminLayout } from "./layouts/AdminLayout";
import { ProtectedRoute } from "./components/common/ProtectedRoute";
import { Home } from "./pages/Home";
import { AdminLogin } from "./pages/AdminLogin";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { AdminProfile } from "./pages/admin/AdminProfile";
import { AdminSkills } from "./pages/admin/AdminSkills";
import { AdminProjects } from "./pages/admin/AdminProjects";
import { AdminExperience } from "./pages/admin/AdminExperience";
import { AdminEducation } from "./pages/admin/AdminEducation";
import { AdminResume } from "./pages/admin/AdminResume";
import { AdminTranslations } from "./pages/admin/AdminTranslations";
import { AdminSettings } from "./pages/admin/AdminSettings";
import { AdminMessages } from "./pages/admin/AdminMessages";

function withAdminLayout(children: ReactNode) {
  return (
    <ProtectedRoute>
      <AdminLayout>{children}</AdminLayout>
    </ProtectedRoute>
  );
}

export default function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <PublicLayout>
            <Home />
          </PublicLayout>
        }
      />

      <Route path="/admin/login" element={<AdminLogin />} />

      <Route path="/admin" element={withAdminLayout(<AdminDashboard />)} />
      <Route path="/admin/messages" element={withAdminLayout(<AdminMessages />)} />
      <Route path="/admin/profile" element={withAdminLayout(<AdminProfile />)} />
      <Route path="/admin/skills" element={withAdminLayout(<AdminSkills />)} />
      <Route path="/admin/projects" element={withAdminLayout(<AdminProjects />)} />
      <Route path="/admin/experience" element={withAdminLayout(<AdminExperience />)} />
      <Route path="/admin/education" element={withAdminLayout(<AdminEducation />)} />
      <Route path="/admin/resume" element={withAdminLayout(<AdminResume />)} />
      <Route path="/admin/translations" element={withAdminLayout(<AdminTranslations />)} />
      <Route path="/admin/settings" element={withAdminLayout(<AdminSettings />)} />

      <Route
        path="*"
        element={
          <PublicLayout>
            <div style={{ padding: "8rem 1.5rem", textAlign: "center" }}>
              <h1 style={{ fontSize: "2rem", marginBottom: "1rem" }}>404</h1>
              <p style={{ color: "var(--text-2)" }}>Page not found.</p>
            </div>
          </PublicLayout>
        }
      />
    </Routes>
  );
}
