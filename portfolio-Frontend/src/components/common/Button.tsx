import type { ButtonHTMLAttributes, AnchorHTMLAttributes, ReactNode } from "react";
import "./Button.css";

type Variant = "primary" | "secondary" | "ghost";

interface BaseProps {
  variant?: Variant;
  icon?: ReactNode;
  fullWidth?: boolean;
}

type ButtonProps = BaseProps &
  ButtonHTMLAttributes<HTMLButtonElement> & {
    as?: "button";
  };

type LinkProps = BaseProps &
  AnchorHTMLAttributes<HTMLAnchorElement> & {
    as: "a";
  };

export function Button(props: ButtonProps | LinkProps) {
  const { variant = "primary", icon, fullWidth, className, children, ...rest } = props as Record<string, unknown> &
    BaseProps & { className?: string; children?: ReactNode };
  const classes = ["btn", `btn--${variant}`, fullWidth ? "btn--full" : "", className].filter(Boolean).join(" ");

  if (props.as === "a") {
    const { as: _as, ...anchorRest } = rest as AnchorHTMLAttributes<HTMLAnchorElement> & { as?: string };
    return (
      <a className={classes} {...anchorRest}>
        {icon && <span className="btn__icon">{icon}</span>}
        <span>{children}</span>
      </a>
    );
  }

  const { as: _as2, ...buttonRest } = rest as ButtonHTMLAttributes<HTMLButtonElement> & { as?: string };
  return (
    <button className={classes} {...buttonRest}>
      {icon && <span className="btn__icon">{icon}</span>}
      <span>{children}</span>
    </button>
  );
}
