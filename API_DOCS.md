# SkillSync API Documentation

Base URL for all REST endpoints is `http://localhost:8080` (or your deployed server host).

---

## 🔐 1. Authentication
Endpoints responsible for user identity and token generation.

### Register User
**POST** `/api/auth/register`
- **Body**: `{ "name": "John", "email": "john@test.com", "password": "pass" }`
- **Response**: `200 OK`
  ```json
  { "token": "eyJhbGciOiJIUzI...", "message": "User registered successfully" }
  ```

### Login User
**POST** `/api/auth/login`
- **Body**: `{ "email": "john@test.com", "password": "pass" }`
- **Response**: `200 OK` (Returns JWT `token`)

---

## 👤 2. User Profiles
Endpoints responsible for managing developer profiles and fetching dynamic trust scores.

### Get My Profile
**GET** `/api/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Response**: `200 OK`
  ```json
  {
    "id": 1,
    "name": "John",
    "email": "john@test.com",
    "bio": "Fullstack Java Dev",
    "goal": "STUDY_BUDDY",
    "trustScore": 75.5,
    "skills": [
      { "skillName": "Java", "level": "Advanced" }
    ]
  }
  ```
  *(Note: `trustScore` is automatically polled from the FastAPI AI engine upon request).*

### Update Profile
**PUT** `/api/users/me`
- **Headers**: `Authorization: Bearer <token>`
- **Body**: Updates `bio`, `goal`, `skills`, or `avatarUrl`.

---

## 🤖 3. AI Matches & Recommendations
Endpoints that pipe directly to the Python AI Engine.

### Find Compatible Matches
**GET** `/api/matches`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Triggers the AI `getMatchUsers` logic to score the active user against everyone else.
- **Response**: Returns an array of `MatchResponse` objects containing the `matchedUser` and `score` (0-100).

### Get General Recommendations
**GET** `/api/matches/recommendations`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Returns non-directed generic trending and recommended people via AI.

---

## 📁 4. Projects & Suggestions

### List/Create Projects
- **GET** `/api/projects`: List all raw projects open for collaboration.
- **POST** `/api/projects`: Create a new project `{ "title": "AI Hub", "requiredSkills": ["Python", "React"] }`

### AI Project Suggestions
**GET** `/api/projects/suggestions`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Pulls the AI Engine's `AiRecommendResponse.ProjectSuggestion` array, serving only projects that mathematically align with your user profile's listed `skills`.

---

## 👥 5. Team Building

### Generate Custom Team
**GET** `/api/teams/build?size={N}`
- **Headers**: `Authorization: Bearer <token>`
- **Description**: Instructs the AI to build a highly compatible, logically sound team of `N` unassociated users using graph/skill logic.
- **Response**:
  ```json
  {
    "team_size": 4,
    "members": [
      { "user_id": 1, "name": "You", "role_suggestion": "Backend" },
      { "user_id": 4, "name": "Jane", "role_suggestion": "Frontend" }
    ],
    "team_score": 92.5
  }
  ```

---

## 💬 6. WebSockets (Chat)
For real-time STOMP messaging.

- **Connection endpoint**: `ws://localhost:8080/ws`
- **Listen / Subscribe to**: `/user/{your-email}/queue/messages`
- **Send message to**: `/app/chat`
  - **Payload**: `{ "senderEmail": "john@test.com", "recipientEmail": "jane@test.com", "content": "Hello!" }`
