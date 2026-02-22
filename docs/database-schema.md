# Database Schema — Avantika Interview Preparation

## Database Strategy

| Store | Engine | Purpose |
|-------|--------|---------|
| **PostgreSQL 16** | Relational | Users, auth, payments, subscriptions, certifications, structured metadata |
| **MongoDB 7** | Document | Content (MCQs, problems, courses), forum posts, AI conversations |
| **Redis 7** | Key-Value | Sessions, cache, rate limiting, leaderboards, presence |
| **Elasticsearch 8** | Search | Full-text search across problems, forum, profiles |
| **Pinecone / pgvector** | Vector | AI embeddings for semantic search, recommendation |

---

## PostgreSQL Schema

### Users & Auth

```sql
-- Core user table
CREATE TABLE users (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email           VARCHAR(255) UNIQUE NOT NULL,
    username        VARCHAR(100) UNIQUE NOT NULL,
    full_name       VARCHAR(255) NOT NULL,
    avatar_url      TEXT,
    bio             TEXT,
    years_experience INTEGER DEFAULT 0,
    current_role    VARCHAR(100),
    target_role     VARCHAR(100),
    target_company  VARCHAR(100),
    linkedin_url    TEXT,
    github_url      TEXT,
    country         VARCHAR(100),
    timezone        VARCHAR(50) DEFAULT 'UTC',
    tier            VARCHAR(20) DEFAULT 'free' CHECK (tier IN ('free', 'pro', 'enterprise')),
    tenant_id       UUID REFERENCES tenants(id),
    is_active       BOOLEAN DEFAULT true,
    is_email_verified BOOLEAN DEFAULT false,
    onboarding_completed BOOLEAN DEFAULT false,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW(),
    last_login_at   TIMESTAMPTZ
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_tenant_id ON users(tenant_id);
CREATE INDEX idx_users_tier ON users(tier);

-- Auth credentials
CREATE TABLE user_credentials (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    provider        VARCHAR(50) NOT NULL,  -- 'email', 'google', 'github', 'linkedin'
    provider_id     VARCHAR(255),          -- OAuth provider's user ID
    password_hash   TEXT,                  -- For email auth only
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(provider, provider_id)
);

-- Refresh tokens
CREATE TABLE refresh_tokens (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash      TEXT NOT NULL,
    expires_at      TIMESTAMPTZ NOT NULL,
    revoked         BOOLEAN DEFAULT false,
    device_info     JSONB,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_refresh_tokens_user_id ON refresh_tokens(user_id);

-- Multi-tenancy
CREATE TABLE tenants (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(255) NOT NULL,
    slug            VARCHAR(100) UNIQUE NOT NULL,
    domain          VARCHAR(255) UNIQUE,
    logo_url        TEXT,
    plan            VARCHAR(50) DEFAULT 'enterprise',
    max_seats       INTEGER DEFAULT 100,
    settings        JSONB DEFAULT '{}',
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Subscriptions & Payments

```sql
-- Subscription plans
CREATE TABLE subscription_plans (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            VARCHAR(100) NOT NULL,   -- 'free', 'pro_monthly', 'pro_annual', 'enterprise'
    display_name    VARCHAR(100) NOT NULL,
    price_usd       DECIMAL(10,2) NOT NULL,
    price_inr       DECIMAL(10,2),
    billing_period  VARCHAR(20),             -- 'monthly', 'annual', 'one_time'
    ai_tokens_monthly INTEGER DEFAULT 0,
    features        JSONB NOT NULL,
    is_active       BOOLEAN DEFAULT true,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- User subscriptions
CREATE TABLE subscriptions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    tenant_id       UUID REFERENCES tenants(id),
    plan_id         UUID NOT NULL REFERENCES subscription_plans(id),
    status          VARCHAR(50) NOT NULL DEFAULT 'active',
                    -- 'active', 'cancelled', 'past_due', 'paused', 'trialing'
    stripe_subscription_id TEXT UNIQUE,
    razorpay_subscription_id TEXT UNIQUE,
    current_period_start    TIMESTAMPTZ,
    current_period_end      TIMESTAMPTZ,
    trial_end       TIMESTAMPTZ,
    cancelled_at    TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user_id ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- Payment transactions
CREATE TABLE payments (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    subscription_id UUID REFERENCES subscriptions(id),
    amount_usd      DECIMAL(10,2),
    amount_inr      DECIMAL(10,2),
    currency        VARCHAR(10) DEFAULT 'USD',
    status          VARCHAR(50) NOT NULL,  -- 'pending', 'succeeded', 'failed', 'refunded'
    payment_method  VARCHAR(50),           -- 'card', 'upi', 'netbanking'
    stripe_payment_intent_id TEXT,
    razorpay_order_id TEXT,
    invoice_url     TEXT,
    metadata        JSONB DEFAULT '{}',
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- AI token usage tracking
CREATE TABLE ai_token_usage (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    feature         VARCHAR(100) NOT NULL,  -- 'ai_interview', 'code_review', 'resume_analyze'
    tokens_used     INTEGER NOT NULL,
    model           VARCHAR(100),           -- 'claude-sonnet-4-6', 'gpt-4o'
    cost_usd        DECIMAL(10,6),
    session_id      UUID,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_ai_token_usage_user_id ON ai_token_usage(user_id);
CREATE INDEX idx_ai_token_usage_created_at ON ai_token_usage(created_at);
```

### Learning & Progress

```sql
-- Learning paths
CREATE TABLE learning_paths (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(100) UNIQUE NOT NULL,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    path_type       VARCHAR(50),  -- 'role', 'level', 'company', 'topic'
    target_roles    TEXT[],
    experience_level VARCHAR(50), -- 'fresher', 'mid', 'senior', 'staff'
    estimated_hours INTEGER,
    difficulty      VARCHAR(20),
    cover_image_url TEXT,
    is_premium      BOOLEAN DEFAULT false,
    is_published    BOOLEAN DEFAULT true,
    order_index     INTEGER DEFAULT 0,
    created_by      UUID REFERENCES users(id),
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Modules within a learning path
CREATE TABLE path_modules (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    path_id         UUID NOT NULL REFERENCES learning_paths(id) ON DELETE CASCADE,
    title           VARCHAR(255) NOT NULL,
    description     TEXT,
    module_type     VARCHAR(50),  -- 'video', 'article', 'quiz', 'coding', 'design'
    content_ref     TEXT,         -- Reference to MongoDB content
    duration_minutes INTEGER,
    is_premium      BOOLEAN DEFAULT false,
    order_index     INTEGER NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_path_modules_path_id ON path_modules(path_id);
CREATE INDEX idx_path_modules_order ON path_modules(path_id, order_index);

-- User progress tracking
CREATE TABLE user_progress (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    path_id         UUID REFERENCES learning_paths(id),
    module_id       UUID REFERENCES path_modules(id),
    status          VARCHAR(50) DEFAULT 'not_started',
                    -- 'not_started', 'in_progress', 'completed', 'skipped'
    completion_percentage INTEGER DEFAULT 0,
    time_spent_seconds    INTEGER DEFAULT 0,
    completed_at    TIMESTAMPTZ,
    last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, module_id)
);

CREATE INDEX idx_user_progress_user_id ON user_progress(user_id);
CREATE INDEX idx_user_progress_path_id ON user_progress(path_id);
```

### Practice & Submissions

```sql
-- Problem tags (topics)
CREATE TABLE topics (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        VARCHAR(100) UNIQUE NOT NULL,
    parent_id   UUID REFERENCES topics(id),
    category    VARCHAR(50),  -- 'dsa', 'system_design', 'language', 'cloud'
    icon_url    TEXT
);

-- Problem metadata (content in MongoDB)
CREATE TABLE problems (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug            VARCHAR(200) UNIQUE NOT NULL,
    title           VARCHAR(500) NOT NULL,
    difficulty      VARCHAR(20) NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard', 'expert')),
    problem_type    VARCHAR(50) NOT NULL,  -- 'dsa', 'mcq', 'system_design', 'behavioral'
    content_ref     TEXT,                  -- MongoDB document ID
    acceptance_rate DECIMAL(5,2) DEFAULT 0,
    total_submissions INTEGER DEFAULT 0,
    is_premium      BOOLEAN DEFAULT false,
    is_published    BOOLEAN DEFAULT true,
    companies       TEXT[],                -- ['google', 'amazon', 'microsoft']
    topic_ids       UUID[],
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_problems_difficulty ON problems(difficulty);
CREATE INDEX idx_problems_type ON problems(problem_type);
CREATE INDEX idx_problems_companies ON problems USING GIN(companies);

-- Code submissions
CREATE TABLE code_submissions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    problem_id      UUID NOT NULL REFERENCES problems(id),
    language        VARCHAR(50) NOT NULL,   -- 'java', 'python', 'cpp', 'javascript'
    code            TEXT NOT NULL,
    status          VARCHAR(50) NOT NULL,
                    -- 'pending', 'running', 'accepted', 'wrong_answer', 'tle', 'mle', 'error'
    runtime_ms      INTEGER,
    memory_mb       DECIMAL(8,2),
    test_cases_passed INTEGER DEFAULT 0,
    test_cases_total  INTEGER DEFAULT 0,
    error_message   TEXT,
    ai_feedback     TEXT,                   -- AI code review (Pro feature)
    submitted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_submissions_user_problem ON code_submissions(user_id, problem_id);
CREATE INDEX idx_submissions_user_id ON code_submissions(user_id);

-- MCQ attempts
CREATE TABLE mcq_attempts (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    problem_id      UUID NOT NULL REFERENCES problems(id),
    selected_option INTEGER NOT NULL,
    is_correct      BOOLEAN NOT NULL,
    time_taken_sec  INTEGER,
    attempted_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_mcq_attempts_user_id ON mcq_attempts(user_id);
```

### Interviews

```sql
-- Mock interview sessions
CREATE TABLE interview_sessions (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    session_type    VARCHAR(50) NOT NULL,  -- 'ai', 'peer', 'expert'
    domain          VARCHAR(100) NOT NULL, -- 'dsa', 'system_design', 'behavioral', 'full_stack'
    status          VARCHAR(50) DEFAULT 'scheduled',
                    -- 'scheduled', 'in_progress', 'completed', 'cancelled'
    scheduled_at    TIMESTAMPTZ,
    started_at      TIMESTAMPTZ,
    ended_at        TIMESTAMPTZ,
    duration_minutes INTEGER,
    overall_score   DECIMAL(5,2),          -- 0.00 to 10.00
    scores          JSONB,                  -- {communication: 8, technical: 7, problem_solving: 9}
    feedback_report JSONB,                  -- Detailed AI-generated feedback
    recording_url   TEXT,
    transcript_ref  TEXT,                   -- MongoDB document ID
    interviewer_id  UUID REFERENCES users(id),  -- For peer/expert sessions
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_interview_sessions_user_id ON interview_sessions(user_id);
CREATE INDEX idx_interview_sessions_status ON interview_sessions(status);
```

### Certifications

```sql
CREATE TABLE certifications (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    cert_type       VARCHAR(100) NOT NULL,  -- 'dsa_proficiency', 'system_design', 'cloud_aws'
    title           VARCHAR(255) NOT NULL,
    score           DECIMAL(5,2) NOT NULL,
    grade           VARCHAR(10),            -- 'A+', 'A', 'B+', etc.
    issued_at       TIMESTAMPTZ DEFAULT NOW(),
    expires_at      TIMESTAMPTZ,
    certificate_url TEXT NOT NULL,
    verification_code VARCHAR(20) UNIQUE NOT NULL,
    blockchain_tx   TEXT,                   -- Blockchain transaction hash
    linkedin_synced BOOLEAN DEFAULT false,
    is_valid        BOOLEAN DEFAULT true
);

CREATE INDEX idx_certifications_user_id ON certifications(user_id);
CREATE INDEX idx_certifications_verification ON certifications(verification_code);
```

### Gamification

```sql
-- User XP and levels
CREATE TABLE user_gamification (
    user_id         UUID PRIMARY KEY REFERENCES users(id),
    xp_total        INTEGER DEFAULT 0,
    xp_this_week    INTEGER DEFAULT 0,
    level           INTEGER DEFAULT 1,
    streak_current  INTEGER DEFAULT 0,
    streak_longest  INTEGER DEFAULT 0,
    streak_last_date DATE,
    badges          JSONB DEFAULT '[]',
    rank_global     INTEGER,
    rank_country    INTEGER,
    updated_at      TIMESTAMPTZ DEFAULT NOW()
);

-- Badges catalog
CREATE TABLE badges (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    slug        VARCHAR(100) UNIQUE NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url    TEXT,
    criteria    JSONB,     -- Unlock criteria definition
    xp_reward   INTEGER DEFAULT 0
);

-- Leaderboard (also maintained in Redis sorted sets for real-time)
CREATE TABLE leaderboard_snapshots (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    period      VARCHAR(20),  -- 'daily', 'weekly', 'monthly', 'all_time'
    period_date DATE NOT NULL,
    user_id     UUID NOT NULL REFERENCES users(id),
    score       INTEGER NOT NULL,
    rank        INTEGER,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);
```

### Resume & Job Matching

```sql
CREATE TABLE resumes (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    title           VARCHAR(255),
    file_url        TEXT NOT NULL,
    parsed_data     JSONB,              -- Structured resume content
    ats_score       INTEGER,            -- 0-100
    keyword_score   INTEGER,
    impact_score    INTEGER,
    suggestions     JSONB DEFAULT '[]',
    target_role     VARCHAR(100),
    is_active       BOOLEAN DEFAULT true,
    version         INTEGER DEFAULT 1,
    analyzed_at     TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE job_recommendations (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id         UUID NOT NULL REFERENCES users(id),
    job_title       VARCHAR(255),
    company         VARCHAR(255),
    location        VARCHAR(255),
    remote_option   VARCHAR(50),
    salary_min      INTEGER,
    salary_max      INTEGER,
    salary_currency VARCHAR(10),
    match_score     DECIMAL(5,2),
    job_url         TEXT,
    skills_matched  TEXT[],
    skills_missing  TEXT[],
    source          VARCHAR(50),        -- 'linkedin', 'naukri', 'indeed', 'greenhouse'
    expires_at      TIMESTAMPTZ,
    created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

---

## MongoDB Collections

### Problems Collection (mcq + dsa + system design content)

```javascript
// problems collection
{
  _id: ObjectId,
  postgresId: "UUID",          // Link to PostgreSQL problems table
  type: "dsa",                 // "dsa" | "mcq" | "system_design" | "behavioral"

  // DSA Problem
  problemStatement: "Given an array of integers...",
  constraints: ["1 <= n <= 10^5", "0 <= nums[i] <= 10^9"],
  examples: [
    {
      input: "[2,7,11,15], target=9",
      output: "[0,1]",
      explanation: "nums[0] + nums[1] = 2 + 7 = 9"
    }
  ],
  testCases: [
    { input: "[2,7,11,15]\n9", output: "[0,1]", isHidden: false },
    { input: "[3,2,4]\n6",     output: "[1,2]", isHidden: true }
  ],
  hints: ["Consider using a hash map", "..."],
  solutions: [
    {
      language: "java",
      approach: "Two Pointer",
      timeComplexity: "O(n)",
      spaceComplexity: "O(n)",
      code: "public int[] twoSum(...) {...}",
      explanation: "We iterate through..."
    }
  ],
  companies: ["google", "amazon"],
  topics: ["arrays", "hash-table"],
  updatedAt: ISODate
}

// MCQ Problem
{
  _id: ObjectId,
  postgresId: "UUID",
  type: "mcq",
  question: "What is the time complexity of QuickSort in the worst case?",
  options: [
    { id: 1, text: "O(n log n)", isCorrect: false },
    { id: 2, text: "O(n²)",     isCorrect: true  },
    { id: 3, text: "O(n)",      isCorrect: false },
    { id: 4, text: "O(log n)",  isCorrect: false }
  ],
  explanation: "In the worst case (already sorted array with poor pivot)...",
  explanationDiagram: "https://cdn.avantika.io/diagrams/quicksort-worst.svg",
  relatedConcepts: ["sorting", "divide-and-conquer"],
  domain: "dsa",
  subtopic: "sorting-algorithms",
  updatedAt: ISODate
}
```

### Courses & Learning Content

```javascript
// courses collection
{
  _id: ObjectId,
  postgresPathId: "UUID",
  title: "System Design Mastery",
  chapters: [
    {
      id: "ch1",
      title: "Introduction to Distributed Systems",
      lessons: [
        {
          id: "l1",
          title: "CAP Theorem Explained",
          type: "video",             // "video" | "article" | "interactive"
          videoUrl: "https://cdn...",
          duration: 1200,            // seconds
          content: "<markdown content>",
          keyTakeaways: ["..."],
          relatedProblems: ["UUID1", "UUID2"]
        }
      ]
    }
  ],
  lastUpdated: ISODate
}
```

### AI Conversations

```javascript
// ai_conversations collection
{
  _id: ObjectId,
  sessionId: "UUID",
  userId: "UUID",
  type: "interview",         // "interview" | "code_review" | "resume" | "mentor"
  domain: "system_design",
  messages: [
    {
      role: "system",
      content: "You are a Google L5 interviewer..."
    },
    {
      role: "assistant",
      content: "Let's start with a system design question..."
    },
    {
      role: "user",
      content: "I would start by clarifying requirements..."
    }
  ],
  metadata: {
    model: "claude-sonnet-4-6",
    totalTokens: 4521,
    startedAt: ISODate,
    endedAt: ISODate
  },
  feedback: {
    overallScore: 8.5,
    dimensions: {
      technicalDepth: 9.0,
      communication: 8.0,
      problemSolving: 8.5,
      systemsThinking: 9.0
    },
    strengths: ["Good capacity estimation", "Considered failure cases"],
    improvements: ["Could elaborate on consistency model"],
    suggestedResources: ["UUID1", "UUID2"]
  }
}
```

### Forum Posts

```javascript
// forum_posts collection
{
  _id: ObjectId,
  userId: "UUID",
  category: "interview-experience",  // "dsa", "system-design", "career", "interview-experience"
  company: "google",
  role: "Senior Software Engineer",
  title: "Google L5 Interview Experience - System Design Round",
  content: "<markdown>",
  tags: ["google", "system-design", "l5"],
  upvotes: 142,
  upvotedBy: ["UUID1", "UUID2"],
  views: 3421,
  comments: [
    {
      id: "c1",
      userId: "UUID",
      content: "Great write-up! ...",
      upvotes: 12,
      isExpertVerified: false,
      createdAt: ISODate
    }
  ],
  isExpertVerified: true,
  isAnonymous: false,
  createdAt: ISODate,
  updatedAt: ISODate
}
```

---

## Redis Data Structures

```
# Session management
session:{userId} → HASH { token, ip, device, lastActive }  TTL: 7 days

# Rate limiting
rate_limit:api:{userId} → INCR counter  TTL: 1 minute
rate_limit:ai:{userId}  → INCR counter  TTL: 1 hour

# AI token quota
ai_quota:{userId}:{yearMonth} → INCR integer  TTL: 45 days

# Leaderboards (sorted sets)
leaderboard:weekly  → ZADD userId score
leaderboard:monthly → ZADD userId score
leaderboard:alltime → ZADD userId score

# Streak tracking
streak:{userId} → HASH { current, longest, lastDate }

# Problem status cache (per user)
problems:solved:{userId} → SET of problemIds  (for quick lookup)

# Active interview sessions
interview:active:{sessionId} → HASH { userId, startTime, domain, state }  TTL: 2 hours

# Notification queue
notifications:{userId} → LIST of notification JSON

# Online presence
online:users → ZADD userId timestamp  TTL: 5 min refresh
```

---

## Database Migration Strategy

| Phase | Tool | Approach |
|-------|------|----------|
| PostgreSQL schema | Flyway | Versioned SQL scripts, auto-applied at startup |
| MongoDB indexes | Mongock | Code-based migrations |
| Seed data | Custom scripts | Idempotent, per-environment |
| Zero-downtime | Expand/contract | Backward-compatible changes in multiple deploys |

---

*Schema Version: 1.0 | Database Team — Avantika Platform*
