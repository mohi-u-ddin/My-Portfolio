import type { ReactNode } from "react";
import { Navbar } from "../components/Navbar/Navbar";
import { Footer } from "../components/Footer/Footer";
import { useAsyncData } from "../hooks/useAsyncData";
import { portfolioService } from "../services/portfolioService";

export function PublicLayout({ children }: { children: ReactNode }) {
  const { data: profile } = useAsyncData(() => portfolioService.getProfile());

  return (
    <>
      <a href="#main-content" className="skip-link">
        Skip to content
      </a>
      <Navbar />
      <main id="main-content">{children}</main>
      <Footer profile={profile} />
    </>
  );
}
