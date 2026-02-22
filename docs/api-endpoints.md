# API Endpoints Reference — Avantika Interview Preparation

## API Design Standards

- **Base URL:** `https://api.avantika.io/v1`
- **Protocol:** HTTPS only
- **Format:** JSON (application/json)
- **Auth:** Bearer JWT token in Authorization header
- **Versioning:** URI versioning (`/v1/`, `/v2/`)
- **Pagination:** Cursor-based + offset-based depending on resource
- **Rate Limiting:** 100 req/min (Free), 500 req/min (Pro), 2000 req/min (Enterprise)

### Standard Response Envelope

```json
{
  "success": true,
  "data": { ... },
  "meta": {
    "page": 1,
    "pageSize": 20,
    "total": 150,
    "cursor": "eyJpZCI6IjEyMyJ9"
  },
  "error": null,
  "requestId": "req_01HZXYZ"
}
```

### Error Response

```json
{
  "success": false,
  "data": null,
  "error": {
    "code": "RESOURCE_NOT_FOUND",
    "message": "The requested problem was not found",
    "details": {},
    "requestId": "req_01HZXYZ"
  }
}
```

---

## Authentication Service (`/v1/auth`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `POST` | `/v1/auth/register` | None | Register with email/password |
| `POST` | `/v1/auth/login` | None | Login with email/password |
| `POST` | `/v1/auth/oauth/google` | None | Google OAuth token exchange |
| `POST` | `/v1/auth/oauth/github` | None | GitHub OAuth token exchange |
| `POST` | `/v1/auth/logout` | Bearer | Invalidate refresh token |
| `POST` | `/v1/auth/token/refresh` | None | Exchange refresh token for new access token |
| `POST` | `/v1/auth/password/forgot` | None | Send password reset email |
| `POST` | `/v1/auth/password/reset` | None | Reset password with token |
| `POST` | `/v1/auth/email/verify` | None | Verify email with token |
| `POST` | `/v1/auth/email/resend` | Bearer | Resend verification email |
| `GET`  | `/v1/auth/me` | Bearer | Get current user identity |

### Register Request

```json
POST /v1/auth/register
{
  "email": "john@example.com",
  "password": "SecurePass123!",
  "fullName": "John Doe",
  "username": "johndoe"
}

Response 201:
{
  "success": true,
  "data": {
    "user": { "id": "uuid", "email": "...", "username": "..." },
    "accessToken": "eyJhbGci...",
    "refreshToken": "eyJhbGci...",
    "expiresIn": 3600
  }
}
```

---

## User Service (`/v1/users`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/users/me` | Bearer | Get own profile |
| `PUT`  | `/v1/users/me` | Bearer | Update profile |
| `GET`  | `/v1/users/me/dashboard` | Bearer | Dashboard data |
| `GET`  | `/v1/users/me/stats` | Bearer | User statistics summary |
| `GET`  | `/v1/users/me/bookmarks` | Bearer | Bookmarked problems/content |
| `POST` | `/v1/users/me/bookmarks` | Bearer | Add bookmark |
| `DELETE` | `/v1/users/me/bookmarks/:id` | Bearer | Remove bookmark |
| `POST` | `/v1/users/me/onboarding` | Bearer | Complete onboarding |
| `GET`  | `/v1/users/:username` | Bearer | Get public profile |
| `GET`  | `/v1/users/me/streak` | Bearer | Streak and gamification data |

### Dashboard Response

```json
GET /v1/users/me/dashboard

{
  "success": true,
  "data": {
    "user": { "id": "...", "fullName": "...", "avatar": "..." },
    "streak": { "current": 7, "longest": 14 },
    "xp": { "total": 2850, "level": 8, "toNextLevel": 150 },
    "interviewReadiness": 72,
    "todayTasks": [
      { "type": "dsa", "title": "Two Sum", "difficulty": "easy" },
      { "type": "mcq", "topic": "Java Concurrency", "count": 5 },
      { "type": "concept", "title": "CAP Theorem" }
    ],
    "upcomingInterviews": [ { "id": "...", "scheduledAt": "..." } ],
    "recentActivity": [ ... ],
    "weeklyProgress": { "problems": 12, "mcqs": 45, "studyHours": 8.5 }
  }
}
```

---

## Learning Service (`/v1/learning`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/learning/paths` | Bearer | List all learning paths |
| `GET`  | `/v1/learning/paths/:slug` | Bearer | Get path details |
| `POST` | `/v1/learning/paths/:slug/enroll` | Bearer | Enroll in a path |
| `GET`  | `/v1/learning/paths/:slug/progress` | Bearer | Get path progress |
| `GET`  | `/v1/learning/paths/:pathId/modules` | Bearer | List modules in path |
| `GET`  | `/v1/learning/modules/:moduleId` | Bearer | Get module content |
| `POST` | `/v1/learning/modules/:moduleId/complete` | Bearer | Mark module complete |
| `GET`  | `/v1/learning/recommendations` | Bearer | AI-personalized recommendations |
| `GET`  | `/v1/learning/flashcards` | Bearer | Get flashcards by topic |
| `POST` | `/v1/learning/flashcards/:id/review` | Bearer | Submit flashcard review (spaced repetition) |

### Learning Paths List

```json
GET /v1/learning/paths?type=role&level=mid

{
  "success": true,
  "data": {
    "paths": [
      {
        "id": "...",
        "slug": "fullstack-developer",
        "title": "Full Stack Developer Path",
        "description": "...",
        "estimatedHours": 80,
        "difficulty": "intermediate",
        "modulesCount": 24,
        "enrolledCount": 12450,
        "isPremium": true,
        "userEnrolled": false,
        "userProgress": 0,
        "coverImage": "https://cdn.avantika.io/paths/fullstack.jpg"
      }
    ]
  }
}
```

---

## Practice Service (`/v1/practice`)

### DSA Problems

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/practice/problems` | Bearer | List problems with filters |
| `GET`  | `/v1/practice/problems/:slug` | Bearer | Get problem details |
| `GET`  | `/v1/practice/problems/daily` | Bearer | Today's challenge problem |
| `GET`  | `/v1/practice/problems/random` | Bearer | Random problem |
| `POST` | `/v1/practice/problems/:id/submit` | Bearer | Submit code solution |
| `GET`  | `/v1/practice/problems/:id/submissions` | Bearer | User's submissions for problem |
| `GET`  | `/v1/practice/problems/:id/solutions` | Pro | View editorial solutions |
| `POST` | `/v1/practice/code/run` | Bearer | Run code (test run, no submission) |
| `POST` | `/v1/practice/code/review` | Pro | AI code review |

### MCQ Practice

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/practice/mcq/topics` | Bearer | List MCQ topics |
| `GET`  | `/v1/practice/mcq/questions` | Bearer | Get MCQ questions by topic |
| `POST` | `/v1/practice/mcq/quiz/start` | Bearer | Start a quiz session |
| `POST` | `/v1/practice/mcq/quiz/:sessionId/answer` | Bearer | Submit answer |
| `GET`  | `/v1/practice/mcq/quiz/:sessionId/result` | Bearer | Get quiz result |
| `GET`  | `/v1/practice/mcq/wrong-answers` | Bearer | User's wrong answer history |

### Problem Submission

```json
POST /v1/practice/problems/two-sum/submit
{
  "language": "java",
  "code": "class Solution { public int[] twoSum(int[] nums, int target) { ... } }",
  "testMode": false
}

Response 200:
{
  "success": true,
  "data": {
    "submissionId": "sub_01HZ...",
    "status": "accepted",
    "runtime": 1,           // ms
    "memory": 41.8,         // MB
    "runtimePercentile": 95.2,
    "memoryPercentile": 72.1,
    "testCasesPassed": 57,
    "testCasesTotal": 57,
    "xpEarned": 50
  }
}
```

### System Design Lab

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/practice/design/problems` | Bearer | List system design problems |
| `GET`  | `/v1/practice/design/problems/:id` | Bearer | Get design problem |
| `POST` | `/v1/practice/design/sessions` | Pro | Start a design session |
| `PUT`  | `/v1/practice/design/sessions/:id` | Pro | Save design diagram |
| `POST` | `/v1/practice/design/sessions/:id/review` | Pro | AI architecture review |
| `GET`  | `/v1/practice/design/reference/:id` | Pro | Get reference architecture |

---

## AI Service (`/v1/ai`)

| Method | Endpoint | Auth | Tier | Description |
|--------|----------|------|------|-------------|
| `POST` | `/v1/ai/interview/start` | Bearer | Free (2/mo) | Start AI interview session |
| `POST` | `/v1/ai/interview/:sessionId/message` | Bearer | Free | Send message in interview |
| `GET`  | `/v1/ai/interview/:sessionId/report` | Bearer | Free | Get post-interview report |
| `POST` | `/v1/ai/code/review` | Bearer | Pro | Request code review |
| `POST` | `/v1/ai/resume/analyze` | Bearer | Free (basic) | Analyze resume |
| `POST` | `/v1/ai/career/advice` | Bearer | Pro | AI career mentor chat |
| `POST` | `/v1/ai/explain` | Bearer | Free | Explain a concept/solution |
| `POST` | `/v1/ai/hint` | Bearer | Free | Get hint for current problem |
| `GET`  | `/v1/ai/tokens/balance` | Bearer | All | Check remaining AI token balance |

### Start AI Interview

```json
POST /v1/ai/interview/start
{
  "domain": "system_design",
  "difficulty": "senior",
  "targetCompany": "google",
  "duration": 45
}

Response 201:
{
  "success": true,
  "data": {
    "sessionId": "int_01HZ...",
    "firstMessage": "Welcome! I'm your interviewer today. Let's start with a system design question...\n\nDesign a URL shortener like bit.ly.",
    "estimatedQuestions": 3,
    "tokensAllocated": 8000,
    "tokensRemaining": 48000
  }
}
```

### AI Interview Message (Streaming)

```
POST /v1/ai/interview/{sessionId}/message
Content-Type: application/json
Accept: text/event-stream

{
  "message": "I would start by clarifying the scale requirements..."
}

Response (SSE stream):
data: {"type": "token", "content": "Great"}
data: {"type": "token", "content": " approach"}
data: {"type": "token", "content": "! Let"}
...
data: {"type": "done", "messageId": "msg_01HZ..."}
```

---

## Interview Service (`/v1/interviews`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/interviews` | Bearer | List user's interviews |
| `POST` | `/v1/interviews` | Bearer | Schedule a mock interview |
| `GET`  | `/v1/interviews/:id` | Bearer | Get interview details |
| `PUT`  | `/v1/interviews/:id` | Bearer | Update interview (reschedule) |
| `DELETE` | `/v1/interviews/:id` | Bearer | Cancel interview |
| `GET`  | `/v1/interviews/:id/scorecard` | Bearer | Get interview scorecard |
| `GET`  | `/v1/interviews/:id/recording` | Pro | Get interview recording URL |
| `GET`  | `/v1/interviews/slots/available` | Bearer | Get available peer interview slots |
| `POST` | `/v1/interviews/peer/match` | Bearer | Request peer interview matching |
| `POST` | `/v1/interviews/:id/feedback` | Bearer | Submit feedback for peer/expert |

---

## Resume Service (`/v1/resumes`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/resumes` | Bearer | List user's resumes |
| `POST` | `/v1/resumes/upload` | Bearer | Upload resume (multipart) |
| `GET`  | `/v1/resumes/:id` | Bearer | Get resume details & analysis |
| `GET`  | `/v1/resumes/:id/suggestions` | Bearer | Get improvement suggestions |
| `POST` | `/v1/resumes/:id/improve-bullet` | Pro | AI-improve specific bullet point |
| `GET`  | `/v1/resumes/templates` | Bearer | List resume templates |
| `POST` | `/v1/resumes/:id/export` | Bearer | Export resume to template |

### Resume Analysis Response

```json
GET /v1/resumes/res_01HZ.../

{
  "success": true,
  "data": {
    "id": "res_01HZ...",
    "atsScore": 78,
    "scores": {
      "ats": 78,
      "keywords": 65,
      "impact": 82,
      "format": 90,
      "overall": 79
    },
    "sections": {
      "experience": { "status": "good", "issues": [] },
      "skills": { "status": "warning", "issues": ["Missing: Kubernetes, Terraform"] },
      "education": { "status": "good", "issues": [] },
      "projects": { "status": "error", "issues": ["No quantified impact"] }
    },
    "suggestions": [
      {
        "priority": "high",
        "section": "experience",
        "original": "Worked on backend services",
        "suggested": "Engineered 5 microservices handling 2M+ daily requests, reducing latency by 40%",
        "reason": "Quantify impact with metrics"
      }
    ],
    "missingKeywords": ["distributed systems", "kafka", "kubernetes"],
    "targetRole": "Senior Backend Engineer"
  }
}
```

---

## Analytics Service (`/v1/analytics`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/analytics/overview` | Bearer | Overall progress summary |
| `GET`  | `/v1/analytics/problems` | Bearer | Problem solving analytics |
| `GET`  | `/v1/analytics/topics` | Bearer | Topic-wise performance |
| `GET`  | `/v1/analytics/interviews` | Bearer | Interview performance trends |
| `GET`  | `/v1/analytics/skill-gap` | Bearer | Skill gap analysis report |
| `GET`  | `/v1/analytics/heatmap` | Bearer | Activity heatmap data |
| `GET`  | `/v1/analytics/leaderboard` | Bearer | Leaderboard standings |
| `GET`  | `/v1/analytics/report/weekly` | Bearer | Weekly performance report |
| `GET`  | `/v1/analytics/readiness` | Bearer | Interview readiness score |

### Skill Gap Analysis

```json
GET /v1/analytics/skill-gap

{
  "success": true,
  "data": {
    "targetRole": "Senior Backend Engineer",
    "readinessScore": 68,
    "skills": [
      { "name": "Data Structures", "level": 85, "required": 80, "status": "strong" },
      { "name": "System Design",   "level": 60, "required": 85, "status": "gap" },
      { "name": "Distributed Systems", "level": 45, "required": 80, "status": "critical" },
      { "name": "Java/Spring",     "level": 90, "required": 85, "status": "strong" }
    ],
    "priorityLearning": [
      { "topic": "Distributed Systems", "estimatedHours": 20, "resources": ["..."] },
      { "topic": "System Design HLD",   "estimatedHours": 15, "resources": ["..."] }
    ]
  }
}
```

---

## Community Service (`/v1/community`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/community/posts` | Bearer | List forum posts |
| `POST` | `/v1/community/posts` | Bearer | Create post |
| `GET`  | `/v1/community/posts/:id` | Bearer | Get post with comments |
| `PUT`  | `/v1/community/posts/:id` | Bearer | Edit own post |
| `DELETE` | `/v1/community/posts/:id` | Bearer | Delete own post |
| `POST` | `/v1/community/posts/:id/upvote` | Bearer | Upvote post |
| `POST` | `/v1/community/posts/:id/comments` | Bearer | Add comment |
| `POST` | `/v1/community/posts/:id/comments/:cId/upvote` | Bearer | Upvote comment |
| `GET`  | `/v1/community/search` | Bearer | Search posts |
| `GET`  | `/v1/community/companies/:slug` | Bearer | Company interview experiences |

---

## Certification Service (`/v1/certifications`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/certifications` | Bearer | User's certifications |
| `GET`  | `/v1/certifications/available` | Bearer | Available certification exams |
| `POST` | `/v1/certifications/:type/start` | Pro | Start certification exam |
| `POST` | `/v1/certifications/:examId/submit` | Pro | Submit exam answers |
| `GET`  | `/v1/certifications/:id` | None | Verify certificate (public) |
| `POST` | `/v1/certifications/:id/linkedin` | Bearer | Sync to LinkedIn |

---

## Payment Service (`/v1/payments`)

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/payments/plans` | None | List subscription plans |
| `POST` | `/v1/payments/subscribe` | Bearer | Create subscription |
| `POST` | `/v1/payments/subscribe/cancel` | Bearer | Cancel subscription |
| `GET`  | `/v1/payments/subscription` | Bearer | Get current subscription |
| `GET`  | `/v1/payments/invoices` | Bearer | List invoices |
| `GET`  | `/v1/payments/invoices/:id` | Bearer | Get invoice PDF |
| `POST` | `/v1/payments/tokens/purchase` | Bearer | Purchase additional AI tokens |
| `POST` | `/v1/payments/webhook/stripe` | None (HMAC) | Stripe webhook handler |
| `POST` | `/v1/payments/webhook/razorpay` | None (HMAC) | Razorpay webhook handler |

---

## Admin Service (`/v1/admin`)

> Requires `ROLE_ADMIN` or `ROLE_INSTRUCTOR`

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| `GET`  | `/v1/admin/users` | Admin | List all users |
| `GET`  | `/v1/admin/users/:id` | Admin | User detail |
| `PUT`  | `/v1/admin/users/:id/tier` | Admin | Update user tier |
| `GET`  | `/v1/admin/analytics` | Admin | Platform-wide analytics |
| `GET`  | `/v1/admin/revenue` | Admin | Revenue dashboard |
| `POST` | `/v1/admin/problems` | Instructor | Create problem |
| `PUT`  | `/v1/admin/problems/:id` | Instructor | Update problem |
| `DELETE` | `/v1/admin/problems/:id` | Instructor | Delete problem |
| `POST` | `/v1/admin/courses` | Instructor | Create course |
| `GET`  | `/v1/admin/moderation/queue` | Admin | Content moderation queue |
| `POST` | `/v1/admin/announcements` | Admin | Send platform announcement |

---

## WebSocket Events (Real-time Service)

### Connection

```
wss://ws.avantika.io/v1?token=<JWT>
```

### Events (Client → Server)

```json
{ "event": "interview.join", "sessionId": "int_01HZ..." }
{ "event": "interview.message", "sessionId": "...", "message": "..." }
{ "event": "coding.execute", "code": "...", "language": "python", "testCaseId": "..." }
{ "event": "design.update", "sessionId": "...", "diagram": {...} }
{ "event": "presence.ping" }
```

### Events (Server → Client)

```json
{ "event": "ai.token", "token": "Great" }
{ "event": "ai.done", "messageId": "..." }
{ "event": "execution.result", "status": "accepted", "runtime": 12, "output": "..." }
{ "event": "notification", "type": "interview_reminder", "data": {...} }
{ "event": "leaderboard.update", "rank": 45, "score": 2850 }
```

---

## API Security Policies

| Policy | Rule |
|--------|------|
| **Rate Limiting** | 100/min (Free), 500/min (Pro), 2000/min (Enterprise) |
| **AI Token Limits** | 50k/mo (Free), 500k/mo (Pro), Unlimited (Enterprise) |
| **Payload Size** | Max 10MB for uploads, 1MB for JSON |
| **CORS** | Whitelist: avantika.io, app.avantika.io |
| **Auth** | JWT required for all non-public endpoints |
| **Input Validation** | All inputs sanitized and validated server-side |
| **SQL Injection** | Parameterized queries only, no dynamic SQL |
| **XSS** | Content-Security-Policy headers enforced |
| **HTTPS** | TLS 1.3 minimum |

---

*API Version: v1.0 | Platform API Team — Avantika*
