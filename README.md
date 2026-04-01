# 🚀 SkillSync Backend

SkillSync is an intelligent platform designed for developers and students to find study buddies, form project teams, and discover trending skills. It leverages an AI-powered matching engine to pair users intuitively based on overlapping tech stacks, project goals, and automated real-time trust scoring.

## 🏗️ Architecture
SkillSync operates on a microservice-style split architecture:

1. **Core Backend (Spring Boot)**: Acts as the primary orchestrator. It handles authentication, profile management, project postings, direct messaging (WebSockets), and general business logic.
2. **AI Engine (Python / FastAPI)**: A dedicated Machine Learning service that processes high-level NLP and Ranking tasks (user match scoring, project suggestions, team building, and trust metrics).

```text
 ┌─────────────────┐           ┌──────────────────────┐
 │                 │           │                      │
 │ Client/Frontend │◄─────────►│ Spring Boot Backend  │
 │                 │           │ (Java / Port 8080)   │
 └─────────────────┘           └───────┬──────┬───────┘
                                       │      │
                                       │      │
                               ┌───────▼──────▼───────┐
                               │                      │
                               │  FastAPI AI Engine   │
                               │  (Python/Port 8000)  │
                               └──────────────────────┘
```

## 🛠️ Tech Stack
- **Framework**: Java 17+, Spring Boot 3.x
- **Security**: Spring Security + JWT Authentication
- **Real-time**: Spring WebSockets (STOMP) for direct messaging
- **Database**: Spring Data JPA / Hibernate
- **AI Integration**: Spring `RestTemplate` communicating synchronously with the local FastAPI server

---

## 🏃 How to Run Locally

### 1. Prerequisites
*   **Java 17** SDK
*   **Maven** 
*   **MySQL or PostgreSQL** (Update `application.yml` or `application.properties` with your local database credentials)
*   **Python 3.9+** (For the AI Engine)

### 2. Start the AI Engine (Python)
Before booting the Java server, you must start the Python AI service, otherwise, AI-driven features (Matches, Recommendations, Team Building) will fail!
```bash
# Clone your python AI repository
git clone <AI-REPO-URL>
cd <AI-REPO-DIR>

# Install dependencies
pip install -r requirements.txt

# Boot the FastAPI server
uvicorn main:app --reload --port 8000
```
*This ensures the AI service is listening on `http://127.0.0.1:8000`.*

### 3. Start the Core Backend (Spring Boot)
Open this codebase in your preferred IDE (NetBeans, IntelliJ, Eclipse, VSCode) and run the `SkillSyncApplication.java` main class.

Alternatively, run it via your terminal:
```bash
mvn clean install
mvn spring-boot:run
```
*The server will boot on `http://localhost:8080`.*

---

## 📌 Main API Endpoints 

All endpoints (except `/api/auth/**`) require a valid `Bearer <JWT_TOKEN>` in the `Authorization` header.

### 🔐 Authentication (`/api/auth`)
*   `POST /register` - Register a new user account.
*   `POST /login` - Authenticate and receive a JWT token.

### 👤 User Profiles (`/api/users`)
*   `GET /profile` - Get the current authenticated user's profile (automatically fetches live `Trust Score` from the AI engine).
*   `PUT /profile` - Update profile info, bio, goals, and skills.
*   `GET /{id}` - View another user's public profile.

### 🤖 AI-Driven Matches & Networking (`/api/matches`)
*   `GET /` - Find and save highly compatible matches using AI similarity scoring.
*   `GET /recommendations` - Get AI suggestions for "Trending" profiles and people to connect with.
*   `GET /my-matches` - Retrieve your previously matched history.
*   `POST /{matchId}/status?status=ACCEPTED|REJECTED` - Accept or reject a pending match.

### 📁 Projects (`/api/projects`)
*   `GET /` - List all generic projects.
*   `POST /` - Post a new project looking for collaborators.
*   `GET /my-projects` - Get projects posted by the authenticated user.
*   `GET /search?skill=Java` - Search for projects by skill.
*   `GET /suggestions` - Ask the AI engine for uniquely tailored projects to work on based on your profile's tech stack.

### 👥 Team Building (`/api/teams`)
*   `GET /build?size={N}` - Automatically generates a highly compatible team of `N` unassociated users using AI skill complementarity processing.

### 💬 Chat & WebSockets (`/ws`)
*   **Connection URL**: `ws://localhost:8080/ws` (Connect via STOMP protocol).
*   **Subscribe**: `/user/{email}/queue/messages` to receive private messages.
*   **Send**: Post payloads to `/app/chat` containing `{senderEmail, recipientEmail, content}`.
