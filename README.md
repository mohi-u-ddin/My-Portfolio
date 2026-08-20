#  Developer Portfolio

A modern, full-stack developer portfolio built with **React, TypeScript, Spring Boot, Spring Security, JWT, and PostgreSQL**.

The website provides a professional public portfolio while also including a secure admin dashboard that allows the portfolio owner to manage content dynamically without modifying the frontend source code.

---

##  Features

###  Public Portfolio

- Home
- About
- Skills
- Projects
- Experience
- Education
- Resume
- Contact
- English / Urdu language support
- RTL support for Urdu
- Light / Dark theme
- Responsive design
- Loading, empty, and error states

###  Admin Dashboard

The portfolio includes a protected administration system where the owner can manage:

- Profile
- Skills
- Projects
- Experience
- Education
- Resume
- Site settings
- Translations
- Contact messages

Admin access is protected using:

- Spring Security
- JWT authentication
- BCrypt password hashing
- Role-based authorization
- Protected admin routes
- Server-side authorization

There is **no public registration system**.

---

## Architecture

```text
                    ┌──────────────────────┐
                    │    Public Visitor    │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │   React Frontend     │
                    │  TypeScript + Vite   │
                    └──────────┬───────────┘
                               │
                         REST API
                               │
                               ▼
                    ┌──────────────────────┐
                    │  Spring Boot Backend │
                    │                      │
                    │ Controller            │
                    │      ↓               │
                    │ Service              │
                    │      ↓               │
                    │ Repository           │
                    │      ↓               │
                    │ JPA / Hibernate      │
                    └──────────┬───────────┘
                               │
                               ▼
                    ┌──────────────────────┐
                    │     PostgreSQL       │
                    └──────────────────────┘


                     ADMIN
                       │
                       ▼
                Admin Login
                       │
                       ▼
                 JWT Token
                       │
                       ▼
               Admin Dashboard
                       │
                       ▼
                Protected APIs
                       │
                       ▼
                  PostgreSQL
