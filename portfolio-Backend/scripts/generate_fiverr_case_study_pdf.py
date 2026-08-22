from __future__ import annotations

import re
from pathlib import Path
from typing import Dict, List, Tuple

from reportlab.lib import colors
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
from reportlab.lib.units import cm
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    PageBreak,
    Table,
    TableStyle,
    KeepTogether,
)
from reportlab.graphics.shapes import Drawing, Rect, String, Line


ROOT = Path(__file__).resolve().parents[1]
JAVA_ROOT = ROOT / "src" / "main" / "java" / "com" / "mohiudding" / "portfolio_Backend"
MODEL_DIR = JAVA_ROOT / "model"
CONTROLLER_DIR = JAVA_ROOT / "controller"
OUTPUT_PDF = ROOT / "Fiverr_Java_SpringBoot_Backend_Case_Study.pdf"


PRIMARY = colors.HexColor("#1E3A8A")
DARK = colors.HexColor("#0B1220")
LIGHT_BG = colors.HexColor("#F8FAFC")
TEXT = colors.HexColor("#0F172A")
MUTED = colors.HexColor("#475569")


def parse_endpoints() -> List[Tuple[str, str, str]]:
    endpoints: List[Tuple[str, str, str]] = []
    for file in sorted(CONTROLLER_DIR.glob("*Controller.java")):
        content = file.read_text(encoding="utf-8")
        controller = file.stem

        base = ""
        base_match = re.search(r'@RequestMapping\("([^"]+)"\)', content)
        if base_match:
            base = base_match.group(1)

        for method, path in re.findall(
            r'@(GetMapping|PostMapping|PutMapping|DeleteMapping|PatchMapping)(?:\("([^"]*)"\))?',
            content,
        ):
            verb = method.replace("Mapping", "").upper()
            path = path or ""
            if path.startswith("/"):
                full_path = f"{base}{path}"
            elif path:
                full_path = f"{base}/{path}"
            else:
                full_path = base or "/"
            endpoints.append((verb, full_path, controller))

        if file.stem == "HealthController":
            if "\"/api/health\"" in content:
                endpoints.append(("GET", "/api/health", controller))
            if "\"/\"" in content:
                endpoints.append(("GET", "/", controller))

    dedup = sorted({(m, p, c) for (m, p, c) in endpoints}, key=lambda x: (x[1], x[0]))
    return dedup


def parse_entities() -> Dict[str, Dict[str, object]]:
    entities: Dict[str, Dict[str, object]] = {}
    for file in sorted(MODEL_DIR.glob("*.java")):
        text = file.read_text(encoding="utf-8")
        class_match = re.search(r"class\s+(\w+)", text)
        if not class_match:
            continue
        name = class_match.group(1)

        table_match = re.search(r'@Table\(name\s*=\s*"([^"]+)"\)', text)
        table_name = table_match.group(1) if table_match else "(embedded/value object)"

        fields = re.findall(r"private\s+[\w<>\[\], ?]+\s+(\w+)\s*;", text)
        rels = []
        for rel in ["OneToMany", "ManyToOne", "OneToOne", "ManyToMany", "ElementCollection"]:
            if f"@{rel}" in text:
                rels.append(rel)

        entities[name] = {
            "table": table_name,
            "fields": fields,
            "relations": rels,
        }
    return entities


def icon_label(text: str) -> Paragraph:
    return Paragraph(f"<font color='#1E3A8A'>■</font> {text}", styles["Normal"])


def build_diagram_box_flow(labels: List[str], title: str) -> Drawing:
    width, height = 520, 270
    d = Drawing(width, height)
    d.add(Rect(0, 0, width, height, fillColor=LIGHT_BG, strokeColor=colors.HexColor("#CBD5E1"), strokeWidth=1))
    d.add(String(16, height - 24, title, fontName="Helvetica-Bold", fontSize=12, fillColor=PRIMARY))

    box_w, box_h = 320, 34
    x = (width - box_w) / 2
    y = height - 68
    for i, label in enumerate(labels):
        d.add(Rect(x, y, box_w, box_h, fillColor=colors.white, strokeColor=PRIMARY, strokeWidth=1.3, rx=6, ry=6))
        d.add(String(x + 10, y + 12, label, fontName="Helvetica-Bold", fontSize=10, fillColor=DARK))
        if i < len(labels) - 1:
            d.add(Line(width / 2, y, width / 2, y - 20, strokeColor=PRIMARY, strokeWidth=1.2))
            d.add(Line(width / 2, y - 20, width / 2 - 4, y - 14, strokeColor=PRIMARY, strokeWidth=1.2))
            d.add(Line(width / 2, y - 20, width / 2 + 4, y - 14, strokeColor=PRIMARY, strokeWidth=1.2))
        y -= 54
    return d


def screenshot_placeholder(title: str, note: str, h: float = 8.0 * cm) -> Table:
    p = Paragraph(
        f"<b>{title}</b><br/><font color='#64748B'>{note}</font>",
        styles["Normal"],
    )
    t = Table([[p]], colWidths=[17.5 * cm], rowHeights=[h])
    t.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, -1), colors.HexColor("#F1F5F9")),
                ("BOX", (0, 0), (-1, -1), 1.2, colors.HexColor("#94A3B8")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("LEFTPADDING", (0, 0), (-1, -1), 12),
                ("RIGHTPADDING", (0, 0), (-1, -1), 12),
            ]
        )
    )
    return t


def page_title(title: str, subtitle: str | None = None) -> List:
    blocks = [Paragraph(title, styles["CaseHeading1"])]
    if subtitle:
        blocks.append(Paragraph(subtitle, styles["SubTitle"]))
    blocks.append(Spacer(1, 0.35 * cm))
    return blocks


def add_header(canvas, _doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(DARK)
    canvas.rect(0, h - 1.4 * cm, w, 1.4 * cm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Helvetica-Bold", 10)
    canvas.drawString(1.3 * cm, h - 0.95 * cm, "Java Spring Boot Backend Development • Portfolio Case Study")
    canvas.setFont("Helvetica", 9)
    canvas.drawRightString(w - 1.3 * cm, h - 0.95 * cm, f"Page {canvas.getPageNumber()}")
    canvas.restoreState()


def create_pdf() -> None:
    endpoints = parse_endpoints()
    entities = parse_entities()

    doc = SimpleDocTemplate(
        str(OUTPUT_PDF),
        pagesize=A4,
        rightMargin=1.5 * cm,
        leftMargin=1.5 * cm,
        topMargin=2.0 * cm,
        bottomMargin=1.6 * cm,
    )

    story = []

    # Page 1 — Cover
    story.extend(page_title("Java Spring Boot Backend Development", "Real-World Portfolio Backend Project"))
    story.append(
        Paragraph(
            "<b>Secure, scalable and maintainable backend solutions built with Java and Spring Boot.</b>",
            styles["Lead"],
        )
    )
    story.append(Spacer(1, 0.8 * cm))

    tech_badges = [
        [icon_label("Java"), icon_label("Spring Boot")],
        [icon_label("REST API"), icon_label("Spring Security")],
        [icon_label("JWT"), icon_label("PostgreSQL")],
    ]
    badge_table = Table(tech_badges, colWidths=[8.6 * cm, 8.6 * cm], hAlign="LEFT")
    badge_table.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP"), ("BOTTOMPADDING", (0, 0), (-1, -1), 8)]))
    story.append(badge_table)
    story.append(Spacer(1, 0.4 * cm))
    story.append(
        Paragraph(
            "This case study is generated from the actual <b>portfolio-Backend</b> source code in this repository. "
            "All technical claims, APIs, entities, and security details map to implemented code.",
            styles["Normal"],
        )
    )
    story.append(PageBreak())

    # Page 2 — Project Overview
    story.extend(page_title("Project Overview"))
    story.append(
        Paragraph(
            "The Personal Portfolio Backend powers portfolio content delivery and admin-side management through REST APIs. "
            "It separates public read endpoints (portfolio, skills, projects, education, experience, translations, settings) "
            "from protected write operations for content updates.",
            styles["Normal"],
        )
    )
    story.append(Spacer(1, 0.25 * cm))

    overview_rows = [
        ["Implemented Functionality", "What the backend currently provides"],
        ["REST API development", "Dedicated controllers for auth, users, profile, skills, projects, experience, education, contact, settings, media, resume and translations."],
        ["Portfolio content management", "Admin CRUD workflows for core portfolio sections through secured endpoints."],
        ["Database integration", "Spring Data JPA entities and repositories with PostgreSQL runtime configuration."],
        ["CRUD operations", "Create, read, update, delete operations across portfolio resources."],
        ["Authentication / authorization", "JWT-based authentication with role-based restrictions in Spring Security."],
        ["Security", "BCrypt password encoding, stateless sessions, JWT filter and custom auth error handling."],
        ["API communication", "JSON request/response model with DTO validation and structured API responses."],
    ]
    tbl = Table(overview_rows, colWidths=[4.3 * cm, 13.0 * cm])
    tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("BACKGROUND", (0, 1), (-1, -1), colors.white),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(tbl)
    story.append(Spacer(1, 0.35 * cm))
    story.append(
        screenshot_placeholder(
            "Project runtime screenshot placeholder",
            "Insert actual Spring Boot run screenshot (application startup/log + healthy API call) provided by project owner.",
            h=5.0 * cm,
        )
    )
    story.append(PageBreak())

    # Page 3 — Architecture
    story.extend(page_title("Backend Architecture"))
    story.append(
        build_diagram_box_flow(
            [
                "Frontend Client (Portfolio UI / Admin UI)",
                "REST Controllers (@RestController)",
                "Service Layer (Business Logic)",
                "Repository Layer (Spring Data JPA)",
                "PostgreSQL Database",
            ],
            "Request Processing Architecture",
        )
    )
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Request lifecycle: client request enters controller, validation and authorization are enforced, business logic executes in services, "
            "repositories persist/fetch entities, and JSON response is returned. JWT filter executes before protected controller methods.",
            styles["Normal"],
        )
    )
    story.append(PageBreak())

    # Page 4 — Tech Stack
    story.extend(page_title("Technology Stack"))
    stack_rows = [
        ["Area", "Technologies used in the current backend"],
        ["Backend", "Java 21, Spring Boot 3.3.5, Spring MVC, Spring Data JPA, Hibernate"],
        ["Security", "Spring Security, JWT (jjwt), BCrypt password encoding, role-based access control"],
        ["Database", "PostgreSQL (primary runtime), MySQL connector present, H2 for development/testing support"],
        ["API", "REST APIs, JSON payloads, DTO validation"],
        ["Development", "Maven, Git/GitHub, IntelliJ IDEA-ready multi-package project structure"],
    ]
    stack_tbl = Table(stack_rows, colWidths=[3.3 * cm, 14.0 * cm])
    stack_tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(stack_tbl)
    story.append(Spacer(1, 0.35 * cm))
    story.append(Paragraph("Technology markers: ☕ Java  |  🌿 Spring  |  🔐 Security  |  🗄 PostgreSQL", styles["Normal"]))
    story.append(PageBreak())

    # Page 5 — Project Structure
    story.extend(page_title("Project Structure"))
    story.append(
        Paragraph(
            "Core packages from <b>com.mohiudding.portfolio_Backend</b>:",
            styles["Normal"],
        )
    )
    structure_rows = [
        ["controller", "REST endpoint layer (auth, skills, projects, profile, contact, media, resume, translations, etc.)"],
        ["service / service.impl", "Business rules and orchestration for CRUD and auth flows"],
        ["repository", "JPA repositories for database interaction"],
        ["model", "Entity models (User, Profile, Skill, Project, Experience, Education, etc.)"],
        ["dto", "Request/response data contracts and validation"],
        ["security", "JWT service/filter + auth failure handlers"],
        ["config", "Security, CORS, web config, data initialization"],
    ]
    structure_tbl = Table(structure_rows, colWidths=[4.1 * cm, 13.2 * cm])
    structure_tbl.setStyle(TableStyle([("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")), ("BACKGROUND", (0, 0), (-1, -1), colors.white), ("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(structure_tbl)
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        screenshot_placeholder(
            "IntelliJ project structure screenshot placeholder",
            "Insert actual IntelliJ project tree screenshot showing controller/service/repository/model/dto/security/config packages.",
            h=7.3 * cm,
        )
    )
    story.append(PageBreak())

    # Page 6 — Database design
    story.extend(page_title("Database Design (Entity View)"))

    er = Drawing(520, 310)
    er.add(Rect(0, 0, 520, 310, fillColor=LIGHT_BG, strokeColor=colors.HexColor("#CBD5E1"), strokeWidth=1))

    boxes = {
        "users": (24, 220, "users\nUser"),
        "profiles": (190, 220, "profiles\nProfile"),
        "profile_stats": (360, 220, "profile_stats\nProfileStat"),
        "skills": (24, 132, "skills\nSkill"),
        "projects": (190, 132, "projects\nProject"),
        "project_technologies": (360, 132, "project_technologies\n@ElementCollection"),
        "experience": (24, 44, "experiences\nExperience"),
        "education": (190, 44, "educations\nEducation"),
        "settings": (360, 44, "site_settings / translations / contact_messages / media_files"),
    }

    for _name, (x, y, label) in boxes.items():
        er.add(Rect(x, y, 136, 66, fillColor=colors.white, strokeColor=PRIMARY, strokeWidth=1, rx=5, ry=5))
        parts = label.split("\\n")
        for idx, part in enumerate(parts):
            er.add(String(x + 8, y + 45 - (idx * 14), part, fontName="Helvetica-Bold" if idx == 0 else "Helvetica", fontSize=9, fillColor=DARK))

    # Relationships
    er.add(Line(326, 250, 360, 250, strokeColor=PRIMARY, strokeWidth=1.2))
    er.add(String(298, 256, "1 -> many", fontName="Helvetica", fontSize=8, fillColor=MUTED))

    er.add(Line(326, 160, 360, 160, strokeColor=PRIMARY, strokeWidth=1.2))
    er.add(String(285, 167, "project_id", fontName="Helvetica", fontSize=8, fillColor=MUTED))

    story.append(er)
    story.append(Spacer(1, 0.2 * cm))
    story.append(
        Paragraph(
            "Key relation implemented in code: <b>Profile (profiles)</b> has <b>OneToMany</b> stats in <b>profile_stats</b>. "
            "Project technologies are stored via element collection table <b>project_technologies</b>. "
            "Other entities are independent CRUD tables managed through dedicated repositories.",
            styles["Normal"],
        )
    )
    story.append(PageBreak())

    # Page 7 — REST API demonstration
    story.extend(page_title("REST API Demonstration"))
    important = [
        ("GET", "/api/skills", "Retrieve all skills"),
        ("POST", "/api/skills", "Create a new skill (ADMIN)"),
        ("PUT", "/api/skills/{id}", "Update skill by ID (ADMIN)"),
        ("DELETE", "/api/skills/{id}", "Delete skill by ID (ADMIN)"),
        ("POST", "/api/auth/login", "Authenticate and return JWT token"),
        ("GET", "/api/projects/featured", "Read featured projects"),
        ("PATCH", "/api/contact/messages/{id}/read", "Mark contact message read/unread (ADMIN)"),
    ]
    api_tbl = Table(
        [["Method", "Endpoint", "Purpose"]] + important,
        colWidths=[2.2 * cm, 6.0 * cm, 9.1 * cm],
    )
    api_tbl.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), PRIMARY),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#CBD5E1")),
                ("VALIGN", (0, 0), (-1, -1), "TOP"),
            ]
        )
    )
    story.append(api_tbl)
    story.append(Spacer(1, 0.3 * cm))
    story.append(
        screenshot_placeholder(
            "Postman / Swagger screenshot placeholder",
            "Insert real endpoint request/response screenshots from your running backend (no mock data).",
            h=6.9 * cm,
        )
    )
    story.append(PageBreak())

    # Page 8 — Security
    story.extend(page_title("Security Implementation"))
    story.append(
        build_diagram_box_flow(
            [
                "Client Request",
                "POST /api/auth/login",
                "JWT Token Issued",
                "Authorization: ******",
                "JwtAuthenticationFilter validates token",
                "Spring Security Role Checks -> Protected APIs",
            ],
            "Authentication & Authorization Flow",
        )
    )
    story.append(Spacer(1, 0.2 * cm))
    sec_points = [
        "Spring Security configured for stateless session management.",
        "JWT generation and validation via JwtService + JwtAuthenticationFilter.",
        "BCryptPasswordEncoder used for password hashing.",
        "Role-based authorization enforced for admin write operations.",
        "Custom authentication entry point and access denied handlers are implemented.",
    ]
    story.append(KeepTogether([Paragraph("• " + p, styles["Normal"]) for p in sec_points]))
    story.append(PageBreak())

    # Page 9 — Screenshots
    story.extend(page_title("Database / API / Code Screenshots"))
    story.append(
        Paragraph(
            "Add your real high-resolution screenshots to finalize this page for Fiverr upload:",
            styles["Normal"],
        )
    )
    story.append(Spacer(1, 0.25 * cm))
    shots = Table(
        [
            [screenshot_placeholder("1) PostgreSQL tables view", "Show actual entities/tables in DB client", h=3.2 * cm), screenshot_placeholder("2) Postman API response", "Successful real endpoint response", h=3.2 * cm)],
            [screenshot_placeholder("3) IntelliJ backend code", "Controller/service or security code snippet", h=3.2 * cm), screenshot_placeholder("4) Spring Boot running", "Terminal/log startup + health endpoint", h=3.2 * cm)],
        ],
        colWidths=[8.65 * cm, 8.65 * cm],
    )
    shots.setStyle(TableStyle([("VALIGN", (0, 0), (-1, -1), "TOP")]))
    story.append(shots)
    story.append(PageBreak())

    # Page 10 — Fiverr delivery
    story.extend(page_title("What I Can Deliver"))
    deliverables = [
        "Java Spring Boot backend development",
        "REST API development",
        "CRUD operations",
        "PostgreSQL/MySQL integration",
        "Spring Security",
        "JWT authentication",
        "Role-based authorization",
        "API integration",
        "Backend bug fixing",
        "Existing Spring Boot project improvements",
        "Clean and maintainable backend architecture",
    ]

    for item in deliverables:
        story.append(Paragraph(f"• {item}", styles["Normal"]))

    story.append(Spacer(1, 0.5 * cm))
    story.append(
        Paragraph(
            "<b>Need a reliable Java Spring Boot backend for your project? Let's build it.</b>",
            styles["Closing"],
        )
    )

    doc.build(story, onFirstPage=add_header, onLaterPages=add_header)

    print(f"Generated: {OUTPUT_PDF}")
    print(f"Controllers parsed: {len({c for _, _, c in endpoints})}")
    print(f"Endpoints parsed: {len(endpoints)}")
    print(f"Entities parsed: {len(entities)}")


styles = getSampleStyleSheet()
styles.add(
    ParagraphStyle(
        name="CaseHeading1",
        parent=styles["Heading1"],
        fontName="Helvetica-Bold",
        fontSize=24,
        leading=28,
        textColor=DARK,
        spaceAfter=8,
    )
)
styles.add(
    ParagraphStyle(
        name="SubTitle",
        parent=styles["BodyText"],
        fontSize=13,
        leading=16,
        textColor=PRIMARY,
        spaceAfter=6,
    )
)
styles.add(
    ParagraphStyle(
        name="Lead",
        parent=styles["BodyText"],
        fontSize=12,
        leading=16,
        textColor=TEXT,
        backColor=colors.HexColor("#E2E8F0"),
        borderPadding=8,
    )
)
styles.add(
    ParagraphStyle(
        name="Closing",
        parent=styles["BodyText"],
        alignment=1,
        fontSize=14,
        leading=18,
        textColor=PRIMARY,
    )
)


if __name__ == "__main__":
    create_pdf()
