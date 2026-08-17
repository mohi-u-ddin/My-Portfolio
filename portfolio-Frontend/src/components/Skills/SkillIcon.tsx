import { GithubIcon } from "../common/BrandIcons";
import {
  Coffee,
  Leaf,
  Database,
  Network,
  Atom,
  FileCode,
  Palette,
  GitBranch,
  Package,
  Container,
  Braces,
} from "lucide-react";
import type { ComponentType } from "react";

type IconComponent = ComponentType<{ size?: number; strokeWidth?: number }>;

// Maps a skill's icon key (data-driven, comes from the API later) to a
// concrete icon component. Falls back gracefully for unknown keys.
const ICON_MAP: Record<string, IconComponent> = {
  java: Coffee,
  spring: Leaf,
  hibernate: Database,
  api: Network,
  mysql: Database,
  database: Database,
  react: Atom,
  javascript: Braces,
  html: FileCode,
  css: Palette,
  git: GitBranch,
  github: GithubIcon,
  maven: Package,
  docker: Container,
};

export function SkillIcon({ icon, size = 18 }: { icon: string; size?: number }) {
  const Icon = ICON_MAP[icon] ?? FileCode;
  return <Icon size={size} strokeWidth={1.8} />;
}
