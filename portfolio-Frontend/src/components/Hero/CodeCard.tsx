import { useRef, useState, type MouseEvent } from "react";
import "./CodeCard.css";

// The hero's signature element: a floating "code window" styled like an
// IDE tab, showing the Spring Boot controller that would back this very
// portfolio. Reacts subtly to pointer movement for a sense of depth.
export function CodeCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  function handleMouseMove(e: MouseEvent<HTMLDivElement>) {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 8 });
  }

  function handleMouseLeave() {
    setTilt({ x: 0, y: 0 });
  }

  return (
    <div
      ref={cardRef}
      className="code-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }}
    >
      <div className="code-card__titlebar">
        <span className="code-card__dot code-card__dot--red" />
        <span className="code-card__dot code-card__dot--yellow" />
        <span className="code-card__dot code-card__dot--green" />
        <span className="code-card__filename">PortfolioController.java</span>
      </div>
      <pre className="code-card__body">
        <code>
          <span className="tok-anno">@RestController</span>
          {"\n"}
          <span className="tok-anno">@RequestMapping</span>(<span className="tok-str">"/api"</span>)
          {"\n\n"}
          <span className="tok-kw">public class</span> <span className="tok-class">PortfolioController</span> {"{"}
          {"\n\n"}
          {"    "}
          <span className="tok-anno">@GetMapping</span>(<span className="tok-str">"/projects"</span>)
          {"\n"}
          {"    "}
          <span className="tok-kw">public</span> <span className="tok-class">List</span>&lt;<span className="tok-class">Project</span>&gt; <span className="tok-fn">projects</span>() {"{"}
          {"\n"}
          {"        "}
          <span className="tok-kw">return</span> projectService.<span className="tok-fn">findAll</span>();
          {"\n"}
          {"    "}
          {"}"}
          {"\n"}
          {"}"}
        </code>
      </pre>
    </div>
  );
}
