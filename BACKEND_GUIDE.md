# Complete Backend Architecture & Implementation Guide
### Portfolio & CMS Backend (Spring Boot + MySQL + REST API)

This document provides the complete, step-by-step blueprint to build the backend for this portfolio project. It outlines every entity, controller, service, repository, database schema, data types, and REST endpoint required by the frontend.

---

## 1. High-Level Architecture Overview

The backend is designed following the industry-standard **3-Tier Layered Architecture** using **Spring Boot**:

```
 ┌────────────────────────────────────────────────────────┐
 │            Frontend: React + Vite (Port 5173)          │
 └───────────────────────────┬────────────────────────────┘
                             │ HTTP JSON / REST API
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │        Controller Layer (@RestController)              │
 │  - Receives HTTP Requests (GET, POST, PUT, DELETE)     │
 │  - Validates DTO inputs & handles routing              │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │        Service Layer (@Service Interface & Impl)       │
 │  - Business logic, security checks, file uploads       │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │        Repository Layer (Spring Data JPA)              │
 │  - Extends JpaRepository<Entity, Long>                 │
 └───────────────────────────┬────────────────────────────┘
                             │ SQL Queries / Hibernate ORM
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │            Database: MySQL / PostgreSQL / H2           │
 └────────────────────────────────────────────────────────┘
```

---

## 2. Recommended Spring Boot Project Folder Structure

Create a standard Spring Boot application (using Maven or Gradle) with `group: com.mohiuddin`, `artifact: portfolio-backend`, `Java: 17 or 21`.

```
portfolio-backend/
├── src/main/java/com/mohiuddin/portfolio/
│   ├── PortfolioApplication.java
│   │
│   ├── config/                           # Security & Web configurations
│   │   ├── CorsConfig.java               # Allows frontend http://localhost:5173
│   │   ├── SecurityConfig.java           # Spring Security & JWT Filter
│   │   └── WebMvcConfig.java             # Static resource handler for uploads
│   │
│   ├── controller/                       # REST Controllers (@RestController)
│   │   ├── AuthController.java           # /api/auth
│   │   ├── SkillController.java          # /api/skills
│   │   ├── ProjectController.java        # /api/projects
│   │   ├── ExperienceController.java     # /api/experience
│   │   ├── EducationController.java      # /api/education
│   │   ├── ProfileController.java        # /api/portfolio
│   │   ├── ContactController.java        # /api/contact
│   │   ├── SettingsController.java       # /api/settings
│   │   ├── ResumeController.java         # /api/resume
│   │   └── TranslationController.java    # /api/translations
│   │
│   ├── model/ (or entity/)               # JPA Database Entities (@Entity)
│   │   ├── User.java                     # Admin user credentials
│   │   ├── Skill.java                    # Skills list
│   │   ├── Project.java                  # Projects list
│   │   ├── Experience.java               # Work experience
│   │   ├── Education.java                # Academic records
│   │   ├── Profile.java                  # Personal bio, stats & social links
│   │   ├── ProfileStat.java              # Key highlights (e.g. "10+ Technologies")
│   │   ├── ContactMessage.java           # Inbound contact inquiries
│   │   ├── SiteSettings.java             # Global SEO & config
│   │   └── TranslationEntry.java         # Multi-language dictionary entries
│   │
│   ├── repository/                       # Spring Data JPA Repositories
│   │   ├── UserRepository.java
│   │   ├── SkillRepository.java
│   │   ├── ProjectRepository.java
│   │   ├── ExperienceRepository.java
│   │   ├── EducationRepository.java
│   │   ├── ProfileRepository.java
│   │   ├── ContactMessageRepository.java
│   │   ├── SiteSettingsRepository.java
│   │   └── TranslationEntryRepository.java
│   │
│   ├── service/                          # Service Interfaces & Implementations
│   │   ├── AuthService.java
│   │   ├── SkillService.java
│   │   ├── ProjectService.java
│   │   ├── ExperienceService.java
│   │   ├── EducationService.java
│   │   ├── ProfileService.java
│   │   ├── ContactService.java
│   │   ├── SettingsService.java
│   │   ├── FileStorageService.java       # Handles resume / image file uploads
│   │   ├── TranslationService.java
│   │   └── impl/                         # Service Implementation classes
│   │       ├── AuthServiceImpl.java
│   │       ├── SkillServiceImpl.java
│   │       ├── ProjectServiceImpl.java
│   │       ├── ExperienceServiceImpl.java
│   │       ├── EducationServiceImpl.java
│   │       ├── ProfileServiceImpl.java
│   │       ├── ContactServiceImpl.java
│   │       ├── SettingsServiceImpl.java
│   │       ├── FileStorageServiceImpl.java
│   │       └── TranslationServiceImpl.java
│   │
│   ├── dto/                              # Data Transfer Objects & Requests
│   │   ├── LoginRequest.java
│   │   ├── LoginResponse.java
│   │   ├── ContactRequest.java
│   │   ├── ApiResponse.java
│   │   ├── SkillDto.java
│   │   ├── ProjectDto.java
│   │   └── ProfileDto.java
│   │
│   ├── security/                         # JWT Utility & Security Filters
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   │
│   └── exception/                        # Custom Exception Handling
│       ├── ResourceNotFoundException.java
│       ├── BadRequestException.java
│       └── GlobalExceptionHandler.java   # @RestControllerAdvice
│
└── src/main/resources/
    ├── application.properties (or application.yml)
    ├── schema.sql (optional)
    └── data.sql (initial seed data)
```

---

## 3. Required Entities, Fields & Data Types

Below is the complete specification of all **9 Entities** matching the frontend's TypeScript domain definitions (`src/types/index.ts`).

---

### 1. `Skill` Entity
*Represents skills grouped by category with proficiency level and icon key.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key, Auto-Increment (`@Id`, `@GeneratedValue`) |
| `name` | `String` | `VARCHAR(100)` | Not Null (e.g., "Java", "Spring Boot") |
| `category` | `String` | `VARCHAR(50)` | Not Null (e.g., "Backend", "Database", "Frontend", "Tools") |
| `icon` | `String` | `VARCHAR(50)` | Not Null (Icon key: "java", "spring", "mysql", "react") |
| `level` | `String` | `VARCHAR(30)` | Enum or String: "Beginner", "Intermediate", "Advanced", "Expert" |
| `yearsOfExperience` | `Integer` | `INT` | Optional (e.g., 2) |
| `createdAt` | `LocalDateTime` | `DATETIME` | Auto-generated timestamp |
| `updatedAt` | `LocalDateTime` | `DATETIME` | Auto-updated timestamp |

---

### 2. `Project` Entity
*Represents showcase portfolio projects with tags and links.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key, Auto-Increment |
| `title` | `String` | `VARCHAR(150)` | Not Null (e.g., "Student Management System") |
| `description` | `String` | `TEXT` | Not Null (Detailed project description) |
| `image` | `String` | `VARCHAR(255)` | Image path or URL (e.g., "/projects/student-mgmt.svg") |
| `technologies` | `List<String>` | `project_technologies` table | `@ElementCollection` (e.g., ["Java", "Spring Boot", "MySQL"]) |
| `githubUrl` | `String` | `VARCHAR(255)` | Nullable |
| `liveUrl` | `String` | `VARCHAR(255)` | Nullable |
| `featured` | `Boolean` | `BOOLEAN` | Default `false` |
| `date` | `LocalDate` or `String` | `VARCHAR(20)` / `DATE` | ISO Date String e.g. "2026-05-01" |

---

### 3. `Experience` Entity
*Represents professional work history and internship experience.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key, Auto-Increment |
| `company` | `String` | `VARCHAR(120)` | Not Null |
| `position` | `String` | `VARCHAR(120)` | Not Null (e.g., "Backend Developer Intern") |
| `location` | `String` | `VARCHAR(100)` | e.g. "Remote", "Islamabad" |
| `startDate` | `String` or `LocalDate`| `VARCHAR(20)` / `DATE` | Not Null (e.g., "2026-01-01") |
| `endDate` | `String` or `LocalDate`| `VARCHAR(20)` / `DATE` | Nullable (`null` represents "Present") |
| `description` | `List<String>` | `experience_descriptions` | `@ElementCollection` (Bullet points) |
| `technologies` | `List<String>` | `experience_technologies` | `@ElementCollection` (e.g., ["Java", "MySQL"]) |

---

### 4. `Education` Entity
*Represents academic qualifications and degrees.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key, Auto-Increment |
| `degree` | `String` | `VARCHAR(150)` | Not Null (e.g., "BS Computer Science") |
| `institution` | `String` | `VARCHAR(150)` | Not Null (e.g., "NUTECH") |
| `startDate` | `String` or `LocalDate`| `VARCHAR(20)` / `DATE` | (e.g., "2024-09-01") |
| `endDate` | `String` or `LocalDate`| `VARCHAR(20)` / `DATE` | Nullable (e.g., "2028-06-30") |
| `description` | `String` | `TEXT` | Optional summary |
| `achievements` | `List<String>` | `education_achievements` | `@ElementCollection` (Key coursework / honors) |

---

### 5. `Profile` & `ProfileStat` Entities
*Stores personal biographical information, avatar, contacts, and stat counters.*

#### `Profile` Entity
| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key (Typically single row `id=1`) |
| `name` | `String` | `VARCHAR(100)` | "Mohi Ud Din" |
| `title` | `String` | `VARCHAR(100)` | "Backend Developer" |
| `tagline` | `String` | `VARCHAR(200)` | "Java • Spring Boot • REST APIs" |
| `bio` | `String` | `TEXT` | Full introductory biography |
| `avatarUrl` | `String` | `VARCHAR(255)` | Path to profile avatar |
| `email` | `String` | `VARCHAR(100)` | "hello@mohiuddin.dev" |
| `location` | `String` | `VARCHAR(100)` | "Islamabad, Pakistan" |
| `availability` | `String` | `VARCHAR(120)` | "Open to internships & backend roles" |
| `githubUrl` | `String` | `VARCHAR(255)` | GitHub profile link |
| `linkedinUrl` | `String` | `VARCHAR(255)` | LinkedIn profile link |
| `resumeUrl` | `String` | `VARCHAR(255)` | Path to PDF resume |
| `stats` | `List<ProfileStat>` | One-to-Many | `@OneToMany(cascade = CascadeType.ALL)` |

#### `ProfileStat` Entity
| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `value` | `String` | `VARCHAR(20)` | e.g. "10+", "5+", "BS", "2+" |
| `label` | `String` | `VARCHAR(50)` | e.g. "Technologies", "Projects" |

---

### 6. `ContactMessage` Entity
*Captures inbound inquiries submitted through the contact form.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key, Auto-Increment |
| `name` | `String` | `VARCHAR(100)` | Not Null |
| `email` | `String` | `VARCHAR(120)` | Not Null |
| `subject` | `String` | `VARCHAR(150)` | Not Null |
| `message` | `String` | `TEXT` | Not Null (Minimum 10 chars) |
| `read` | `Boolean` | `BOOLEAN` | Default `false` |
| `createdAt` | `LocalDateTime` | `DATETIME` | Auto timestamp |

---

### 7. `SiteSettings` Entity
*Stores site-wide configuration and SEO metadata.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key (`id=1`) |
| `siteTitle` | `String` | `VARCHAR(150)` | "Mohi Ud Din — Backend Developer" |
| `siteDescription` | `String` | `TEXT` | Meta site description |
| `contactEmail` | `String` | `VARCHAR(100)` | Contact destination |
| `githubLink` | `String` | `VARCHAR(255)` | In `socialLinks` object |
| `linkedinLink` | `String` | `VARCHAR(255)` | In `socialLinks` object |
| `availableLanguages`| `List<String>`| `@ElementCollection` | `["en", "ur"]` |
| `resumeUrl` | `String` | `VARCHAR(255)` | Default resume link |
| `metaTitle` | `String` | `VARCHAR(150)` | In `seo` object |
| `metaDescription` | `String` | `TEXT` | In `seo` object |

---

### 8. `User` Entity (Admin Authentication)
*Stores credentials for the CMS admin dashboard.*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `name` | `String` | `VARCHAR(100)` | "Mohi Ud Din" |
| `email` | `String` | `VARCHAR(120)` | Unique, Not Null |
| `password` | `String` | `VARCHAR(255)` | BCrypt hashed password |
| `role` | `String` | `VARCHAR(30)` | "admin" / "ROLE_ADMIN" |

---

### 9. `TranslationEntry` Entity
*Stores dynamic localization key-value pairs (English & Urdu).*

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `key` | `String` | `VARCHAR(100)` | Unique (e.g., "nav.home", "nav.about") |
| `en` | `String` | `TEXT` | English text |
| `ur` | `String` | `TEXT` | Urdu translation text |

---

## 4. REST Controllers & Endpoint Mappings

Here is the exact mapping of every REST Controller and its endpoints to match what the frontend calls (`src/services/*`):

### 1. `AuthController` (`@RequestMapping("/api/auth")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin | Public | `LoginRequest` (`email`, `password`) | `{ "token": "jwt...", "user": { ... } }` |
| `POST` | `/api/auth/logout` | Invalidate session | Auth Required | None | `204 No Content` |

---

### 2. `SkillController` (`@RequestMapping("/api/skills")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Fetch all skills | Public | None | `List<Skill>` |
| `POST` | `/api/skills` | Add new skill | **Auth Required** | `SkillDto` | Created `Skill` (`201 Created`) |
| `PUT` | `/api/skills/{id}` | Update skill by ID | **Auth Required** | `SkillDto` | Updated `Skill` |
| `DELETE` | `/api/skills/{id}` | Delete skill by ID | **Auth Required** | None | `204 No Content` |

---

### 3. `ProjectController` (`@RequestMapping("/api/projects")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all projects | Public | None | `List<Project>` |
| `GET` | `/api/projects/{id}` | Fetch single project | Public | None | Single `Project` |
| `POST` | `/api/projects` | Create new project | **Auth Required** | `ProjectDto` | Created `Project` |
| `PUT` | `/api/projects/{id}` | Update project | **Auth Required** | `ProjectDto` | Updated `Project` |
| `DELETE` | `/api/projects/{id}` | Delete project | **Auth Required** | None | `204 No Content` |

---

### 4. `ExperienceController` (`@RequestMapping("/api/experience")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/experience` | Fetch all experience | Public | None | `List<Experience>` |
| `POST` | `/api/experience` | Add experience | **Auth Required** | `ExperienceDto` | Created `Experience` |
| `PUT` | `/api/experience/{id}` | Update experience | **Auth Required** | `ExperienceDto` | Updated `Experience` |
| `DELETE` | `/api/experience/{id}`| Delete experience | **Auth Required** | None | `204 No Content` |

---

### 5. `EducationController` (`@RequestMapping("/api/education")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/education` | Fetch all education | Public | None | `List<Education>` |
| `POST` | `/api/education` | Add education entry | **Auth Required** | `EducationDto` | Created `Education` |
| `PUT` | `/api/education/{id}` | Update education | **Auth Required** | `EducationDto` | Updated `Education` |
| `DELETE` | `/api/education/{id}`| Delete education | **Auth Required** | None | `204 No Content` |

---

### 6. `ProfileController` (`@RequestMapping("/api/portfolio")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/portfolio` | Fetch profile & stats | Public | None | `Profile` object |
| `PUT` | `/api/portfolio` | Update profile info | **Auth Required** | `ProfileDto` | Updated `Profile` |

---

### 7. `ContactController` (`@RequestMapping("/api/contact")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Submit contact form | Public | `ContactRequest` (`name`, `email`, `subject`, `message`) | `{ "success": true }` |
| `GET` | `/api/contact/messages` | View messages in admin | **Auth Required** | None | `List<ContactMessage>` |

---

### 8. `SettingsController` (`@RequestMapping("/api/settings")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | Get site settings & SEO | Public | None | `SiteSettings` object |
| `PUT` | `/api/settings` | Update site settings | **Auth Required** | `SiteSettingsDto` | Updated `SiteSettings` |

---

### 9. `ResumeController` (`@RequestMapping("/api/resume")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/resume` | Get current resume URL | Public | None | `{ "url": "/resume/Mohi-Ud-Din-Resume.pdf" }` |
| `POST` | `/api/resume` | Upload new PDF resume | **Auth Required** | `MultipartFile file` | `{ "url": "/resume/new-resume.pdf" }` |
| `DELETE` | `/api/resume` | Delete resume | **Auth Required** | None | `204 No Content` |

---

### 10. `TranslationController` (`@RequestMapping("/api/translations")`)
| HTTP Method | Mapping Endpoint | Description | Public / Auth Required | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/translations` | Get all translation pairs | Public | None | `List<TranslationEntry>` |
| `PUT` | `/api/translations` | Bulk update translations | **Auth Required** | `List<TranslationEntry>`| Updated `List<TranslationEntry>` |

---

## 5. Sample Java Implementation Snippets

### A. Sample Entity: `Skill.java`
```java
package com.mohiuddin.portfolio.model;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "skills")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Skill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(nullable = false, length = 50)
    private String category; // Backend, Database, Frontend, Tools

    @Column(nullable = false, length = 50)
    private String icon;     // java, spring, mysql, react

    @Column(nullable = false, length = 30)
    private String level;    // Beginner, Intermediate, Advanced, Expert

    private Integer yearsOfExperience;
}
```

---

### B. Sample Repository: `SkillRepository.java`
```java
package com.mohiuddin.portfolio.repository;

import com.mohiuddin.portfolio.model.Skill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface SkillRepository extends JpaRepository<Skill, Long> {
    List<Skill> findByCategory(String category);
}
```

---

### C. Sample Service: `SkillService.java` & Implementation
```java
package com.mohiuddin.portfolio.service;

import com.mohiuddin.portfolio.model.Skill;
import java.util.List;

public interface SkillService {
    List<Skill> getAllSkills();
    Skill getSkillById(Long id);
    Skill createSkill(Skill skill);
    Skill updateSkill(Long id, Skill skill);
    void deleteSkill(Long id);
}
```

```java
package com.mohiuddin.portfolio.service.impl;

import com.mohiuddin.portfolio.exception.ResourceNotFoundException;
import com.mohiuddin.portfolio.model.Skill;
import com.mohiuddin.portfolio.repository.SkillRepository;
import com.mohiuddin.portfolio.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class SkillServiceImpl implements SkillService {

    private final SkillRepository skillRepository;

    @Override
    public List<Skill> getAllSkills() {
        return skillRepository.findAll();
    }

    @Override
    public Skill getSkillById(Long id) {
        return skillRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Skill not found with id: " + id));
    }

    @Override
    public Skill createSkill(Skill skill) {
        return skillRepository.save(skill);
    }

    @Override
    public Skill updateSkill(Long id, Skill skillDetails) {
        Skill skill = getSkillById(id);
        skill.setName(skillDetails.getName());
        skill.setCategory(skillDetails.getCategory());
        skill.setIcon(skillDetails.getIcon());
        skill.setLevel(skillDetails.getLevel());
        skill.setYearsOfExperience(skillDetails.getYearsOfExperience());
        return skillRepository.save(skill);
    }

    @Override
    public void deleteSkill(Long id) {
        Skill skill = getSkillById(id);
        skillRepository.delete(skill);
    }
}
```

---

### D. Sample Controller: `SkillController.java`
```java
package com.mohiuddin.portfolio.controller;

import com.mohiuddin.portfolio.model.Skill;
import com.mohiuddin.portfolio.service.SkillService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@CrossOrigin(origins = "http://localhost:5173") // or configure globally via CorsConfig
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    // GET /api/skills - Fetch all skills
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        return ResponseEntity.ok(skillService.getAllSkills());
    }

    // GET /api/skills/{id} - Fetch single skill
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
        return ResponseEntity.ok(skillService.getSkillById(id));
    }

    // POST /api/skills - Create new skill
    @PostMapping
    public ResponseEntity<Skill> createSkill(@RequestBody Skill skill) {
        Skill created = skillService.createSkill(skill);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    // PUT /api/skills/{id} - Update existing skill
    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(@PathVariable Long id, @RequestBody Skill skill) {
        return ResponseEntity.ok(skillService.updateSkill(id, skill));
    }

    // DELETE /api/skills/{id} - Delete skill
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
```

---

### E. Global CORS Configuration: `CorsConfig.java`
To allow your React Vite frontend (`http://localhost:5173`) to call the Spring Boot API without CORS errors:

```java
package com.mohiuddin.portfolio.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class CorsConfig {

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/api/**")
                        .allowedOrigins("http://localhost:5173", "http://localhost:3000")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                        .allowedHeaders("*")
                        .allowCredentials(true);
            }
        };
    }
}
```

---

## 6. How to Connect Frontend to Real Backend

1. When your Spring Boot application is running on `http://localhost:8080`:
2. In the frontend root directory, edit `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_USE_MOCKS=false
   ```
3. Restart the Vite development server (`npm run dev`). The React application will now execute real HTTP requests against your Spring Boot REST APIs!
