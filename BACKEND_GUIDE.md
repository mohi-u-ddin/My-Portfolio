# Complete Backend Architecture & Specifications Guide
### Portfolio & CMS Backend (Spring Boot + MySQL + REST API)

This document provides the complete, descriptive architectural blueprint for the backend of the portfolio project. It details every entity, repository, DTO, service, controller, database schema, and REST endpoint.

---

## 1. High-Level Architecture Overview

The backend is built using the standard **3-Tier Layered Architecture** with **Spring Boot 3 (Java 21)**:

```
 ┌────────────────────────────────────────────────────────┐
 │            Frontend: React + Vite (Port 5173)          │
 └───────────────────────────┬────────────────────────────┘
                             │ HTTP JSON / REST API
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │        Controller Layer (@RestController)              │
 │  - Receives HTTP Requests (GET, POST, PUT, DELETE)     │
 │  - Validates DTO inputs with Jakarta Validation        │
 └───────────────────────────┬────────────────────────────┘
                             │
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │        Service Layer (@Service Interface & Impl)       │
 │  - Business logic, entity mappings, security checks    │
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
 │        Database: MySQL / PostgreSQL / H2 In-Memory     │
 └────────────────────────────────────────────────────────┘
```

---

## 2. Project Folder Structure

Package: `com.mohiudding.portfolio_Backend`

```
portfolio-Backend/
├── src/main/java/com/mohiudding/portfolio_Backend/
│   ├── PortfolioBackendApplication.java
│   │
│   ├── config/                           # Security, CORS & Web configurations
│   │   ├── CorsConfig.java
│   │   ├── SecurityConfig.java
│   │   ├── DataInitializer.java
│   │   └── WebMvcConfig.java
│   │
│   ├── controller/                       # REST Controllers (@RestController)
│   │   ├── AuthController.java           # /api/auth
│   │   ├── UserController.java           # /api/users
│   │   ├── SkillController.java          # /api/skills
│   │   ├── ProjectController.java        # /api/projects
│   │   ├── ExperienceController.java     # /api/experience
│   │   ├── EducationController.java      # /api/education
│   │   ├── ProfileController.java        # /api/portfolio
│   │   ├── ContactController.java        # /api/contact
│   │   ├── SettingsController.java       # /api/settings
│   │   ├── ResumeController.java         # /api/resume
│   │   ├── FileUploadController.java     # /api/upload
│   │   └── TranslationController.java    # /api/translations
│   │
│   ├── model/                            # JPA Database Entities (@Entity)
│   │   ├── User.java
│   │   ├── Skill.java
│   │   ├── Project.java
│   │   ├── Experience.java
│   │   ├── Education.java
│   │   ├── Profile.java
│   │   ├── ProfileStat.java
│   │   ├── ContactMessage.java
│   │   ├── SiteSettings.java
│   │   ├── SocialLinks.java              # @Embeddable
│   │   ├── SeoMetadata.java              # @Embeddable
│   │   └── TranslationEntry.java
│   │
│   ├── repository/                       # Spring Data JPA Repositories
│   │   ├── UserRepository.java
│   │   ├── SkillRepository.java
│   │   ├── ProjectRepository.java
│   │   ├── ExperienceRepository.java
│   │   ├── EducationRepository.java
│   │   ├── ProfileRepository.java
│   │   ├── ProfileStatRepository.java
│   │   ├── ContactMessageRepository.java
│   │   ├── SiteSettingsRepository.java
│   │   └── TranslationEntryRepository.java
│   │
│   ├── service/                          # Service Interfaces & Implementations
│   │   ├── AuthService.java
│   │   ├── UserService.java
│   │   ├── SkillService.java
│   │   ├── ProjectService.java
│   │   ├── ExperienceService.java
│   │   ├── EducationService.java
│   │   ├── ProfileService.java
│   │   ├── ContactService.java
│   │   ├── SettingsService.java
│   │   ├── FileStorageService.java
│   │   ├── TranslationService.java
│   │   └── impl/
│   │       ├── AuthServiceImpl.java
│   │       ├── UserServiceImpl.java
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
│   │   ├── SkillDto.java
│   │   ├── ProjectDto.java
│   │   ├── ExperienceDto.java
│   │   ├── EducationDto.java
│   │   ├── ProfileDto.java
│   │   ├── ProfileStatDto.java
│   │   ├── ContactRequest.java
│   │   ├── SiteSettingsDto.java
│   │   ├── SocialLinksDto.java
│   │   ├── SeoMetadataDto.java
│   │   ├── TranslationEntryDto.java
│   │   ├── ApiResponse.java
│   │   └── ErrorResponse.java
│   │
│   ├── security/                         # JWT Utility & Security Filters
│   │   ├── JwtTokenProvider.java
│   │   ├── JwtAuthenticationFilter.java
│   │   └── UserDetailsServiceImpl.java
│   │
│   └── exception/                        # Custom Exception Handling
│       ├── ResourceNotFoundException.java
│       ├── BadRequestException.java
│       └── GlobalExceptionHandler.java
│
└── src/main/resources/
    ├── application.properties
    └── data.sql
```

---

## 3. Database Entities Specification

---

### 1. `User` Entity (Admin Authentication)
*Represents admin accounts for CMS authentication and access control.*
* **Table Name:** `users`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key (`@Id`, `@GeneratedValue`) |
| `name` | `String` | `VARCHAR(100)` | Not Null (e.g. "Mohi Ud Din") |
| `email` | `String` | `VARCHAR(120)` | Unique, Not Null |
| `password` | `String` | `VARCHAR(255)` | BCrypt encrypted hash (`@JsonProperty(access = WRITE_ONLY)`) |
| `role` | `String` | `VARCHAR(30)` | Default `"admin"` / `"ROLE_ADMIN"` |
| `createdAt` | `LocalDateTime` | `DATETIME` | `@CreationTimestamp`, Not updatable |
| `updatedAt` | `LocalDateTime` | `DATETIME` | `@UpdateTimestamp` |

---

### 2. `Skill` Entity
*Represents technical skills grouped by category with proficiency level and icon key.*
* **Table Name:** `skills`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `name` | `String` | `VARCHAR(100)` | Not Null (e.g. "Java", "Spring Boot", "MySQL") |
| `category` | `String` | `VARCHAR(50)` | Not Null ("Backend", "Database", "Frontend", "Tools") |
| `icon` | `String` | `VARCHAR(50)` | Not Null (Icon key: "java", "spring", "mysql", "react") |
| `level` | `String` | `VARCHAR(30)` | "Beginner", "Intermediate", "Advanced", "Expert" |
| `yearsOfExperience` | `Integer` | `INT` | Optional years of hands-on experience |

---

### 3. `Project` Entity
*Represents showcase portfolio projects with tags, repository links, and live URLs.*
* **Table Name:** `projects`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `title` | `String` | `VARCHAR(150)` | Not Null (e.g. "Student Management System") |
| `description` | `String` | `TEXT` | Not Null (Detailed project description) |
| `image` | `String` | `VARCHAR(255)` | Image path or URL |
| `technologies` | `List<String>` | `project_technologies` | `@ElementCollection` (e.g. `["Java", "Spring Boot", "MySQL"]`) |
| `githubUrl` | `String` | `VARCHAR(255)` | GitHub repository link |
| `liveUrl` | `String` | `VARCHAR(255)` | Live demo link |
| `featured` | `boolean` | `BOOLEAN` | Default `false` |
| `date` | `String` | `VARCHAR(20)` | ISO Date String (e.g. "2026-05-01") |
| `createdAt` | `LocalDateTime` | `DATETIME` | `@CreationTimestamp` |
| `updatedAt` | `LocalDateTime` | `DATETIME` | `@UpdateTimestamp` |

---

### 4. `Experience` Entity
*Represents work history, internships, and professional career roles.*
* **Table Name:** `experiences`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `company` | `String` | `VARCHAR(120)` | Not Null (e.g. "Tech Solutions Inc.") |
| `position` | `String` | `VARCHAR(120)` | Not Null (e.g. "Backend Developer Intern") |
| `location` | `String` | `VARCHAR(100)` | Location (e.g. "Remote", "Islamabad") |
| `startDate` | `String` | `VARCHAR(20)` | Not Null (e.g. "2026-01-01") |
| `endDate` | `String` | `VARCHAR(20)` | Nullable (`null` represents current / "Present") |
| `description` | `List<String>` | `experience_descriptions` | `@ElementCollection` (Bullet points of work done) |
| `technologies` | `List<String>` | `experience_technologies` | `@ElementCollection` (e.g. `["Java", "MySQL"]`) |

---

### 5. `Education` Entity
*Represents academic qualifications, universities, and degrees.*
* **Table Name:** `educations`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `degree` | `String` | `VARCHAR(150)` | Not Null (e.g. "BS Computer Science") |
| `institution` | `String` | `VARCHAR(150)` | Not Null (e.g. "NUTECH") |
| `startDate` | `String` | `VARCHAR(20)` | Start date (e.g. "2024-09-01") |
| `endDate` | `String` | `VARCHAR(20)` | End / graduation date (e.g. "2028-06-30") |
| `description` | `String` | `TEXT` | Optional academic overview |
| `achievements` | `List<String>` | `education_achievements` | `@ElementCollection` (Key coursework / honors) |

---

### 6. `Profile` & `ProfileStat` Entities
*Stores personal bio, contact handles, avatar, and highlight metrics.*
* **Table Name (Profile):** `profiles`
* **Table Name (ProfileStat):** `profile_stats`
* **Primary Key:** `id` (`Long`, Auto-Increment)

#### `Profile` Fields
| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key (`id=1`) |
| `name` | `String` | `VARCHAR(100)` | Full name (e.g. "Mohi Ud Din") |
| `title` | `String` | `VARCHAR(100)` | Professional headline (e.g. "Backend Developer") |
| `tagline` | `String` | `VARCHAR(200)` | Subtitle (e.g. "Java • Spring Boot • REST APIs") |
| `bio` | `String` | `TEXT` | Detailed biography |
| `avatarUrl` | `String` | `VARCHAR(255)` | Profile image URL |
| `email` | `String` | `VARCHAR(100)` | Public contact email |
| `location` | `String` | `VARCHAR(100)` | Geographic location |
| `availability` | `String` | `VARCHAR(120)` | Availability status |
| `githubUrl` | `String` | `VARCHAR(255)` | GitHub profile link |
| `linkedinUrl` | `String` | `VARCHAR(255)` | LinkedIn profile link |
| `resumeUrl` | `String` | `VARCHAR(255)` | Resume file link |
| `stats` | `List<ProfileStat>`| One-to-Many | `@OneToMany(cascade = CascadeType.ALL, orphanRemoval = true)` |

#### `ProfileStat` Fields
| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `value` | `String` | `VARCHAR(50)` | Column `stat_value` (e.g. "10+", "5+", "BS", "2+") |
| `label` | `String` | `VARCHAR(100)` | Column `label` (e.g. "Technologies", "Projects") |

---

### 7. `ContactMessage` Entity
*Stores visitor inquiries submitted through the contact form.*
* **Table Name:** `contact_messages`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `name` | `String` | `VARCHAR(100)` | Sender's name |
| `email` | `String` | `VARCHAR(120)` | Sender's email address |
| `subject` | `String` | `VARCHAR(150)` | Inbound message subject |
| `message` | `String` | `TEXT` | Inquiry message body |
| `read` | `boolean` | `BOOLEAN` | Column `is_read`, Default `false` |
| `createdAt` | `LocalDateTime` | `DATETIME` | `@CreationTimestamp` |

---

### 8. `SiteSettings` Entity
*Stores site-wide configuration, languages, and SEO metadata.*
* **Table Name:** `site_settings`
* **Primary Key:** `id` (`Long`, Auto-Increment, `id=1`)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key (`id=1`) |
| `siteTitle` | `String` | `VARCHAR(150)` | Global site title |
| `siteDescription` | `String` | `TEXT` | Site meta description |
| `contactEmail` | `String` | `VARCHAR(100)` | Destination contact email |
| `socialLinks` | `SocialLinks` | `@Embedded` | Embedded object: `github` (VARCHAR 255), `linkedin` (VARCHAR 255) |
| `availableLanguages`| `List<String>`| `@ElementCollection` | Supported locales (e.g. `["en", "ur"]`) |
| `resumeUrl` | `String` | `VARCHAR(255)` | Global resume file URL |
| `seo` | `SeoMetadata` | `@Embedded` | Embedded object: `metaTitle` (VARCHAR 150), `metaDescription` (TEXT) |

---

### 9. `TranslationEntry` Entity
*Stores dynamic localization key-value pairs (English & Urdu).*
* **Table Name:** `translations`
* **Primary Key:** `id` (`Long`, Auto-Increment)

| Field Name | Java Type | DB Column Type | Constraints / Description |
| :--- | :--- | :--- | :--- |
| `id` | `Long` | `BIGINT` | Primary Key |
| `key` | `String` | `VARCHAR(100)` | Unique, Not Null (e.g. "nav.home", "hero.title") |
| `en` | `String` | `TEXT` | English text string |
| `ur` | `String` | `TEXT` | Urdu translation text string |

---

## 4. Spring Data JPA Repositories Specification

All repositories reside in `com.mohiudding.portfolio_Backend.repository` and extend Spring Data JPA's `JpaRepository<Entity, Long>`.

---

### 1. `UserRepository`
* **Entity Type:** `User`
* **ID Type:** `Long`
* **Description:** Manages database operations for CMS admin credentials, account retrieval, and authentication checks.
* **Custom Query Methods:**
  * `Optional<User> findByEmail(String email)` — Finds admin user by unique email address during login and token verification.
  * `boolean existsByEmail(String email)` — Checks whether an email address is already registered.

---

### 2. `SkillRepository`
* **Entity Type:** `Skill`
* **ID Type:** `Long`
* **Description:** Manages CRUD operations for technical skills inventory.
* **Custom Query Methods:**
  * `List<Skill> findByCategory(String category)` — Retrieves all skills belonging to a specific category (e.g. Backend, Frontend, Database, Tools).
  * `List<Skill> findAllByOrderByIdAsc()` — Returns skills in ascending order by insertion ID.

---

### 3. `ProjectRepository`
* **Entity Type:** `Project`
* **ID Type:** `Long`
* **Description:** Manages portfolio projects, featured flags, and tech stack tags.
* **Custom Query Methods:**
  * `List<Project> findByFeaturedTrue()` — Fetches only featured highlight projects for homepage display.
  * `List<Project> findAllByOrderByCreatedAtDesc()` — Returns projects in reverse chronological order (newest first).

---

### 4. `ExperienceRepository`
* **Entity Type:** `Experience`
* **ID Type:** `Long`
* **Description:** Manages professional work history and internship experience entries.
* **Custom Query Methods:**
  * `List<Experience> findAllByOrderByStartDateDesc()` — Returns career timeline ordered newest to oldest.

---

### 5. `EducationRepository`
* **Entity Type:** `Education`
* **ID Type:** `Long`
* **Description:** Manages academic qualifications and educational achievements.
* **Custom Query Methods:**
  * `List<Education> findAllByOrderByStartDateDesc()` — Returns educational records sorted by start date in descending order.

---

### 6. `ProfileRepository`
* **Entity Type:** `Profile`
* **ID Type:** `Long`
* **Description:** Manages portfolio biographical information, contact links, and highlight stat counters.
* **Custom Query Methods:**
  * `Optional<Profile> findFirstByOrderByIdAsc()` — Fetches the primary portfolio profile row (`id=1`).

---

### 7. `ProfileStatRepository`
* **Entity Type:** `ProfileStat`
* **ID Type:** `Long`
* **Description:** Manages individual statistic counter items (e.g. "10+ Technologies", "5+ Projects").
* **Custom Query Methods:**
  * Standard CRUD methods inherited from `JpaRepository`.

---

### 8. `ContactMessageRepository`
* **Entity Type:** `ContactMessage`
* **ID Type:** `Long`
* **Description:** Stores and manages inbound visitor messages submitted through the portfolio contact form.
* **Custom Query Methods:**
  * `List<ContactMessage> findAllByOrderByCreatedAtDesc()` — Returns admin inbox messages ordered newest first.
  * `List<ContactMessage> findByReadFalse()` — Retrieves all unread messages.
  * `long countByReadFalse()` — Counts unread messages for notification badges.

---

### 9. `SiteSettingsRepository`
* **Entity Type:** `SiteSettings`
* **ID Type:** `Long`
* **Description:** Manages global site settings, active languages, and SEO meta tags.
* **Custom Query Methods:**
  * `Optional<SiteSettings> findFirstByOrderByIdAsc()` — Retrieves the singleton site settings configuration row (`id=1`).

---

### 10. `TranslationEntryRepository`
* **Entity Type:** `TranslationEntry`
* **ID Type:** `Long`
* **Description:** Manages dynamic multi-language localization key-value dictionary (English & Urdu).
* **Custom Query Methods:**
  * `Optional<TranslationEntry> findByKey(String key)` — Looks up translation entry by its unique localization key (e.g. "hero.tagline").
  * `boolean existsByKey(String key)` — Checks if a translation key is already defined.
  * `List<TranslationEntry> findAllByOrderByKeyAsc()` — Returns all translation entries sorted alphabetically by key.

---

## 5. Data Transfer Objects (DTOs) Specification

All DTOs reside in `com.mohiudding.portfolio_Backend.dto` and validate API request/response payloads:

| DTO Name | Fields & Types | Validation Constraints | Target Endpoint / Usage |
| :--- | :--- | :--- | :--- |
| **`LoginRequest`** | `email` (String), `password` (String) | `@NotBlank`, `@Email` | `POST /api/auth/login` |
| **`LoginResponse`** | `token` (String), `user` (UserDto) | Response payload | `POST /api/auth/login` |
| **`SkillDto`** | `name`, `category`, `icon`, `level`, `yearsOfExperience` | `@NotBlank` on name, category, icon, level; `@Min(0)` on years | `POST /api/skills`, `PUT /api/skills/{id}` |
| **`ProjectDto`** | `title`, `description`, `image`, `technologies`, `githubUrl`, `liveUrl`, `featured`, `date` | `@NotBlank` on title & description; `@Size` constraints | `POST /api/projects`, `PUT /api/projects/{id}` |
| **`ExperienceDto`**| `company`, `position`, `location`, `startDate`, `endDate`, `description`, `technologies` | `@NotBlank` on company, position, startDate; `@Size` constraints | `POST /api/experience`, `PUT /api/experience/{id}` |
| **`EducationDto`** | `degree`, `institution`, `startDate`, `endDate`, `description`, `achievements` | `@NotBlank` on degree & institution; `@Size` constraints | `POST /api/education`, `PUT /api/education/{id}` |
| **`ProfileDto`** | `name`, `title`, `tagline`, `bio`, `avatarUrl`, `email`, `location`, `availability`, `githubUrl`, `linkedinUrl`, `resumeUrl`, `stats` | `@NotBlank` on name & title; `@Email`; `@Valid` nested stats | `PUT /api/portfolio` |
| **`ProfileStatDto`**| `id` (Long), `value` (String), `label` (String) | `@NotBlank` on value & label | Nested within `ProfileDto` |
| **`ContactRequest`**| `name`, `email`, `subject`, `message` | `@NotBlank` on all fields; `@Email` | `POST /api/contact` |
| **`SiteSettingsDto`**| `siteTitle`, `siteDescription`, `contactEmail`, `socialLinks`, `availableLanguages`, `resumeUrl`, `seo` | `@Email` on contactEmail; `@Valid` on embedded DTOs | `PUT /api/settings` |
| **`SocialLinksDto`**| `github` (String), `linkedin` (String) | `@Size(max = 255)` | Nested within `SiteSettingsDto` |
| **`SeoMetadataDto`**| `metaTitle` (String), `metaDescription` (String) | `@Size(max = 150)` on metaTitle | Nested within `SiteSettingsDto` |
| **`TranslationEntryDto`**| `id` (Long), `key` (String), `en` (String), `ur` (String) | `@NotBlank` on key; `@Size(max = 100)` | `PUT /api/translations` |
| **`ApiResponse<T>`**| `success` (boolean), `message` (String), `data` (T), `timestamp` | Generic response wrapper | Standard response for actions |
| **`ErrorResponse`**| `status` (int), `message` (String), `timestamp`, `validationErrors` (Map) | Error response payload | Handled by GlobalExceptionHandler |

---

## 6. Service Layer Specifications

Services reside in `com.mohiudding.portfolio_Backend.service` and contain business logic, validation, security operations, and entity-DTO conversions.

---

### 1. `UserService`
* **Implementation:** `UserServiceImpl`
* **Description:** Manages admin account details, user lookups, credentials verification, profile updates, and password changes.
* **Methods:**
  * `User authenticate(LoginRequest loginRequest)` — Validates admin login credentials against stored BCrypt password.
  * `User getAdminUser()` — Fetches the primary admin user profile for CMS management.
  * `User getUserById(Long id)` — Retrieves a user entity by its primary key ID.
  * `Optional<User> getUserByEmail(String email)` — Retrieves a user by their registered unique email address.
  * `User updateAdmin(String name, String email)` — Updates admin account display name and email address.
  * `User changePassword(String oldPassword, String newPassword)` — Validates old password and sets encrypted new password.

---

### 2. `AuthService`
* **Implementation:** `AuthServiceImpl`
* **Description:** Handles security authentication, JWT token generation, session invalidation, and current user retrieval.
* **Methods:**
  * `LoginResponse login(LoginRequest loginRequest)` — Authenticates admin credentials and returns JWT bearer token and user summary.
  * `void logout()` — Handles logout and invalidates current security session.
  * `User getCurrentUser()` — Extracts and returns the currently authenticated admin user from `SecurityContextHolder`.

---

### 3. `SkillService`
* **Implementation:** `SkillServiceImpl`
* **Description:** Manages CRUD operations and category filtering for technical skills inventory.
* **Methods:**
  * `List<Skill> getAllSkills()` — Retrieves all skills from the database.
  * `Skill getSkillById(Long id)` — Fetches a single skill by its ID, throws `ResourceNotFoundException` if not found.
  * `List<Skill> getSkillsByCategory(String category)` — Returns skills filtered by category (Backend, Frontend, etc.).
  * `Skill createSkill(SkillDto skillDto)` — Maps `SkillDto` to `Skill` entity and persists it.
  * `Skill updateSkill(Long id, SkillDto skillDto)` — Updates existing skill fields and saves changes.
  * `void deleteSkill(Long id)` — Deletes skill by ID from the database.

---

### 4. `ProjectService`
* **Implementation:** `ProjectServiceImpl`
* **Description:** Manages showcase projects, featured status, technologies collection, and repository links.
* **Methods:**
  * `List<Project> getAllProjects()` — Retrieves all showcase projects ordered newest first.
  * `List<Project> getFeaturedProjects()` — Retrieves only featured portfolio projects.
  * `Project getProjectById(Long id)` — Fetches single project by ID or throws exception if not found.
  * `Project createProject(ProjectDto projectDto)` — Maps and persists a new project record.
  * `Project updateProject(Long id, ProjectDto projectDto)` — Updates project details, links, and technologies list.
  * `void deleteProject(Long id)` — Deletes a project record by ID.

---

### 5. `ExperienceService`
* **Implementation:** `ExperienceServiceImpl`
* **Description:** Manages professional work history entries, descriptions, and technology tags.
* **Methods:**
  * `List<Experience> getAllExperiences()` — Retrieves all work experiences ordered by start date (newest first).
  * `Experience getExperienceById(Long id)` — Fetches single experience record by ID.
  * `Experience createExperience(ExperienceDto experienceDto)` — Creates and persists new experience item.
  * `Experience updateExperience(Long id, ExperienceDto experienceDto)` — Updates company, role, dates, description, and technologies.
  * `void deleteExperience(Long id)` — Removes experience item by ID.

---

### 6. `EducationService`
* **Implementation:** `EducationServiceImpl`
* **Description:** Manages academic background records, degrees, institutions, and key achievements.
* **Methods:**
  * `List<Education> getAllEducations()` — Retrieves all education entries ordered by start date.
  * `Education getEducationById(Long id)` — Fetches single education entry by ID.
  * `Education createEducation(EducationDto educationDto)` — Creates and persists a new education record.
  * `Education updateEducation(Long id, EducationDto educationDto)` — Updates degree, institution, dates, and achievements.
  * `void deleteEducation(Long id)` — Deletes an education record by ID.

---

### 7. `ProfileService`
* **Implementation:** `ProfileServiceImpl`
* **Description:** Manages portfolio biographical profile and cascades updates to child `ProfileStat` metrics.
* **Methods:**
  * `Profile getProfile()` — Retrieves the primary portfolio profile (`id=1`) including child stats list.
  * `Profile updateProfile(ProfileDto profileDto)` — Updates personal bio, contact URLs, and synchronizes child `ProfileStat` list.

---

### 8. `ContactService`
* **Implementation:** `ContactServiceImpl`
* **Description:** Handles incoming visitor inquiries, inbox viewing, read status tracking, and deletion.
* **Methods:**
  * `void saveContactMessage(ContactRequest contactRequest)` — Validates and persists visitor message inquiry.
  * `List<ContactMessage> getAllMessages()` — Retrieves all messages in admin inbox ordered newest first.
  * `ContactMessage markAsRead(Long id, boolean read)` — Updates `is_read` flag for a specific message.
  * `void deleteMessage(Long id)` — Deletes a contact message by ID.
  * `long getUnreadCount()` — Returns count of unread messages for notification badge.

---

### 9. `SettingsService`
* **Implementation:** `SettingsServiceImpl`
* **Description:** Manages global site metadata, active locales, resume link, and SEO configuration.
* **Methods:**
  * `SiteSettings getSettings()` — Retrieves singleton site configuration (`id=1`).
  * `SiteSettings updateSettings(SiteSettingsDto settingsDto)` — Updates site title, description, contact email, social links, and SEO tags.

---

### 10. `FileStorageService`
* **Implementation:** `FileStorageServiceImpl`
* **Description:** Manages physical file upload storage (PDF resumes, avatars, project screenshots) on disk.
* **Methods:**
  * `String storeFile(MultipartFile file, String subDirectory)` — Validates file type/size, saves to disk, and returns relative access URL.
  * `void deleteFile(String filePath)` — Deletes physical file from storage directory.
  * `String getFileUrl(String fileName)` — Resolves accessible web URL path for a given stored file.

---

### 11. `TranslationService`
* **Implementation:** `TranslationServiceImpl`
* **Description:** Manages dynamic multilingual localization dictionary entries (English & Urdu).
* **Methods:**
  * `List<TranslationEntry> getAllTranslations()` — Returns all localization key-value pairs.
  * `List<TranslationEntry> updateTranslations(List<TranslationEntryDto> translationDtos)` — Performs bulk upsert on translation dictionary.
  * `String getTranslation(String key, String locale)` — Looks up translation string for a given key and locale code ("en" or "ur").

---

## 7. REST Controllers & Complete Endpoint Mappings

---

### 1. `AuthController` (`@RequestMapping("/api/auth")`)
* **Purpose:** Handles admin authentication, token issuance, and session verification.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/login` | Authenticate admin & generate token | **Public** | `LoginRequest` | `LoginResponse` (`token`, `user`) |
| `POST` | `/api/auth/logout` | Invalidate session | **Auth Required** | None | `204 No Content` |
| `GET` | `/api/auth/me` | Fetch current session admin profile | **Auth Required** | None | `AdminUser` (`id`, `name`, `email`, `role`) |

---

### 2. `UserController` (`@RequestMapping("/api/users")`)
* **Purpose:** Manages admin account details, email updates, and password changes.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/users/profile` | Get admin account details | **Auth Required** | None | `User` |
| `PUT` | `/api/users/profile` | Update admin name & email | **Auth Required** | `User` (`name`, `email`) | Updated `User` |
| `PUT` | `/api/users/password` | Change admin password | **Auth Required** | Password change payload | `ApiResponse` (`success: true`) |

--- 

### 3. `SkillController` (`@RequestMapping("/api/skills")`)
* **Purpose:** Publicly serves skills list and provides authenticated CRUD operations.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/skills` | Fetch all skills | **Public** | None | `List<Skill>` |
| `GET` | `/api/skills/{id}` | Fetch single skill by ID | **Public** | None | `Skill` |
| `POST` | `/api/skills` | Create a new skill | **Auth Required** | `SkillDto` | Created `Skill` (`201 Created`) |
| `PUT` | `/api/skills/{id}` | Update skill by ID | **Auth Required** | `SkillDto` | Updated `Skill` |
| `DELETE` | `/api/skills/{id}` | Delete skill by ID | **Auth Required** | None | `204 No Content` |

---

### 4. `ProjectController` (`@RequestMapping("/api/projects")`)
* **Purpose:** Serves showcase portfolio projects and provides authenticated CRUD operations.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/projects` | Fetch all projects | **Public** | None | `List<Project>` |
| `GET` | `/api/projects/{id}` | Fetch single project by ID | **Public** | None | `Project` |
| `POST` | `/api/projects` | Create new project | **Auth Required** | `ProjectDto` | Created `Project` (`201 Created`) |
| `PUT` | `/api/projects/{id}` | Update project by ID | **Auth Required** | `ProjectDto` | Updated `Project` |
| `DELETE` | `/api/projects/{id}` | Delete project by ID | **Auth Required** | None | `204 No Content` |

---

### 5. `ExperienceController` (`@RequestMapping("/api/experience")`)
* **Purpose:** Manages professional work history and internship timeline.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/experience` | Fetch all experience entries | **Public** | None | `List<Experience>` |
| `GET` | `/api/experience/{id}`| Fetch single experience entry | **Public** | None | `Experience` |
| `POST` | `/api/experience` | Create experience entry | **Auth Required** | `ExperienceDto` | Created `Experience` (`201 Created`)|
| `PUT` | `/api/experience/{id}`| Update experience entry | **Auth Required** | `ExperienceDto` | Updated `Experience` |
| `DELETE` | `/api/experience/{id}`| Delete experience entry | **Auth Required** | None | `204 No Content` |

---

### 6. `EducationController` (`@RequestMapping("/api/education")`)
* **Purpose:** Manages academic history, degrees, and institutions.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/education` | Fetch all education entries | **Public** | None | `List<Education>` |
| `GET` | `/api/education/{id}` | Fetch single education entry | **Public** | None | `Education` |
| `POST` | `/api/education` | Add education entry | **Auth Required** | `EducationDto` | Created `Education` (`201 Created`) |
| `PUT` | `/api/education/{id}` | Update education entry | **Auth Required** | `EducationDto` | Updated `Education` |
| `DELETE` | `/api/education/{id}` | Delete education entry | **Auth Required** | None | `204 No Content` |

---

### 7. `ProfileController` (`@RequestMapping("/api/portfolio")`)
* **Purpose:** Manages personal bio, contact info, and dynamic highlight stats.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/portfolio` | Fetch profile & stats | **Public** | None | `Profile` |
| `PUT` | `/api/portfolio` | Update profile information | **Auth Required** | `ProfileDto` | Updated `Profile` |

---

### 8. `ContactController` (`@RequestMapping("/api/contact")`)
* **Purpose:** Handles public visitor contact form submissions and CMS admin inbox management.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/contact` | Submit contact form | **Public** | `ContactRequest` | `ApiResponse` (`success: true`) |
| `GET` | `/api/contact/messages` | View all messages in admin | **Auth Required** | None | `List<ContactMessage>` |
| `PATCH`| `/api/contact/messages/{id}/read` | Mark message as read/unread | **Auth Required** | None | `ContactMessage` |
| `DELETE`| `/api/contact/messages/{id}` | Delete contact message | **Auth Required** | None | `204 No Content` |

---

### 9. `SettingsController` (`@RequestMapping("/api/settings")`)
* **Purpose:** Manages site-wide configuration, available languages, and SEO metadata.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/settings` | Get site settings & SEO | **Public** | None | `SiteSettings` |
| `PUT` | `/api/settings` | Update site settings | **Auth Required** | `SiteSettingsDto` | Updated `SiteSettings` |

---

### 10. `ResumeController` (`@RequestMapping("/api/resume")`)
* **Purpose:** Manages PDF resume retrieval, file upload replacement, and deletion.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/resume` | Get current resume URL | **Public** | None | `{ "url": "/uploads/resume.pdf" }` |
| `POST` | `/api/resume` | Upload new PDF resume | **Auth Required** | `MultipartFile file` | `{ "url": "/uploads/resume.pdf" }` |
| `DELETE` | `/api/resume` | Delete resume file | **Auth Required** | None | `204 No Content` |

---

### 11. `FileUploadController` (`@RequestMapping("/api/upload")`)
* **Purpose:** Handles image uploads for project thumbnails and profile avatars.

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `POST` | `/api/upload/image` | Upload project/avatar image | **Auth Required** | `MultipartFile file` | `{ "url": "/uploads/image.png" }` |

---

### 12. `TranslationController` (`@RequestMapping("/api/translations")`)
* **Purpose:** Serves and updates localization key-value dictionary (English & Urdu).

| HTTP Method | Mapping Endpoint | Description | Access Level | Request Body | Response Body |
| :--- | :--- | :--- | :--- | :--- | :--- |
| `GET` | `/api/translations` | Get all translation pairs | **Public** | None | `List<TranslationEntry>` |
| `PUT` | `/api/translations` | Bulk update translations | **Auth Required** | `List<TranslationEntryDto>` | Updated `List<TranslationEntry>` |

---

## 8. Connecting Frontend to Real Backend

1. Ensure your Spring Boot backend application is running on port `8080` (`http://localhost:8080`).
2. In the frontend root directory (`portfolio-Frontend`), update `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:8080/api
   VITE_USE_MOCKS=false
   ```
3. Run the Vite development server (`npm run dev`). The React frontend will now execute real HTTP requests against your Spring Boot REST APIs.
