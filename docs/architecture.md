# Technical Architecture — Avantika Interview Preparation

## System Architecture Overview

```
                        ┌──────────────────────────────────┐
                        │         GLOBAL CDN (CloudFront)   │
                        │  Static Assets | Edge Caching     │
                        └──────────────┬───────────────────┘
                                       │
                        ┌──────────────▼───────────────────┐
                        │     API GATEWAY (AWS API GW)      │
                        │  Rate Limiting | Auth | Routing   │
                        └──────────────┬───────────────────┘
                                       │
          ┌────────────────────────────▼─────────────────────────────┐
          │                   BFF LAYER (Node.js)                     │
          │        Browser | Mobile | Third-party clients             │
          └──┬──────────┬──────────┬──────────┬──────────┬──────────┘
             │          │          │          │          │
     ┌───────▼──┐ ┌─────▼────┐ ┌──▼──────┐ ┌▼────────┐ ┌▼──────────┐
     │  Auth    │ │ Learning │ │Practice │ │  AI     │ │Analytics  │
     │ Service  │ │ Service  │ │ Service │ │ Service │ │ Service   │
     │(Keycloak)│ │(Spring)  │ │(Spring) │ │(Python) │ │(Spring)   │
     └───────┬──┘ └─────┬────┘ └──┬──────┘ └┬────────┘ └┬──────────┘
             │          │          │          │           │
     ┌───────▼──────────▼──────────▼──────────▼───────────▼──────────┐
     │                     MESSAGE BUS (Apache Kafka)                  │
     │           Event Streaming | Async Communication                 │
     └──────────┬──────────┬──────────────────┬────────────┬──────────┘
                │          │                  │            │
        ┌───────▼──┐ ┌─────▼────┐    ┌────────▼──┐ ┌─────▼──────┐
        │PostgreSQL│ │ MongoDB  │    │   Redis   │ │Elasticsearch│
        │(Primary) │ │(Content) │    │  (Cache)  │ │  (Search)  │
        └──────────┘ └──────────┘    └───────────┘ └────────────┘
```

---

## Microservices Architecture

### Service Inventory

| Service | Language | Responsibility | Port |
|---------|----------|---------------|------|
| **API Gateway** | Node.js | Routing, rate limiting, auth validation | 8080 |
| **Auth Service** | Java/Spring | User auth, JWT, OAuth, sessions | 8081 |
| **User Service** | Java/Spring | Profile, preferences, dashboard data | 8082 |
| **Learning Service** | Java/Spring | Courses, modules, progress tracking | 8083 |
| **Practice Service** | Java/Spring | DSA problems, MCQs, submissions | 8084 |
| **AI Service** | Python/FastAPI | LLM interactions, code review, AI features | 8085 |
| **Interview Service** | Node.js | Mock interviews, scheduling, recording | 8086 |
| **Resume Service** | Python/FastAPI | Resume parsing, analysis, scoring | 8087 |
| **Analytics Service** | Java/Spring | Progress, reporting, ML insights | 8088 |
| **Notification Service** | Node.js | Email, SMS, push notifications | 8089 |
| **Payment Service** | Node.js | Stripe/Razorpay integration | 8090 |
| **Community Service** | Java/Spring | Forum, posts, comments | 8091 |
| **Certification Service** | Java/Spring | Certificate generation, blockchain | 8092 |
| **Matching Service** | Python/FastAPI | Job/recruiter recommendation | 8093 |
| **Realtime Service** | Node.js | WebSocket, collaborative features | 8094 |

---

## Frontend Architecture

### React Application Structure

```
src/
├── app/                          # App shell, routing
│   ├── App.tsx
│   ├── Router.tsx
│   └── providers/                # Context providers
├── pages/                        # Route-level components
│   ├── Landing/
│   ├── Auth/
│   ├── Dashboard/
│   ├── LearningPaths/
│   ├── Practice/
│   │   ├── MCQ/
│   │   ├── Coding/
│   │   └── SystemDesign/
│   ├── Interview/
│   │   ├── AIBot/
│   │   └── MockInterview/
│   ├── Resume/
│   ├── Analytics/
│   ├── Community/
│   └── Admin/
├── components/                   # Shared components
│   ├── ui/                       # Design system primitives
│   │   ├── Button/
│   │   ├── Card/
│   │   ├── Modal/
│   │   ├── Input/
│   │   └── ...
│   ├── layout/
│   │   ├── Navbar/
│   │   ├── Sidebar/
│   │   └── Footer/
│   ├── editor/                   # Monaco Editor wrapper
│   ├── charts/                   # Recharts components
│   └── interview/                # Interview-specific components
├── features/                     # Feature slices (Zustand)
│   ├── auth/
│   ├── user/
│   ├── practice/
│   ├── learning/
│   └── interview/
├── hooks/                        # Custom React hooks
├── services/                     # API service layer (React Query)
├── utils/                        # Helpers and utilities
└── styles/                       # Global styles, Tailwind config
```

### State Management (Zustand)

```typescript
// Global store structure
interface AppStore {
  // Auth slice
  auth: {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    tier: 'free' | 'pro' | 'enterprise';
  };

  // Practice slice
  practice: {
    currentProblem: Problem | null;
    submissions: Submission[];
    filters: PracticeFilters;
  };

  // Interview slice
  interview: {
    activeSession: InterviewSession | null;
    history: InterviewSession[];
    aiConversation: Message[];
  };

  // Learning slice
  learning: {
    activePath: LearningPath | null;
    progress: Record<string, number>;
    bookmarks: string[];
  };
}
```

### API Layer (React Query + Axios)

```typescript
// Centralized API client
const apiClient = axios.create({
  baseURL: process.env.VITE_API_BASE_URL,
  timeout: 30000,
});

// Interceptors for auth, retry, error handling
// React Query for caching, background refetch, optimistic updates

// Example query hook
export const useUserProgress = (userId: string) => {
  return useQuery({
    queryKey: ['progress', userId],
    queryFn: () => analyticsService.getProgress(userId),
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000,   // 10 minutes
  });
};
```

---

## Backend Architecture (Spring Boot)

### Service Template Structure

```
service-name/
├── src/main/java/com/avantika/
│   ├── config/
│   │   ├── SecurityConfig.java
│   │   ├── KafkaConfig.java
│   │   └── RedisConfig.java
│   ├── controller/
│   │   └── {Domain}Controller.java
│   ├── service/
│   │   ├── {Domain}Service.java
│   │   └── {Domain}ServiceImpl.java
│   ├── repository/
│   │   └── {Domain}Repository.java
│   ├── entity/
│   │   └── {Domain}.java
│   ├── dto/
│   │   ├── request/
│   │   └── response/
│   ├── mapper/
│   ├── exception/
│   │   ├── GlobalExceptionHandler.java
│   │   └── Custom exceptions...
│   ├── event/
│   │   ├── producers/
│   │   └── consumers/
│   └── util/
├── src/main/resources/
│   ├── application.yml
│   ├── application-dev.yml
│   ├── application-prod.yml
│   └── db/migration/            # Flyway migrations
└── src/test/
    ├── unit/
    └── integration/
```

### Security Architecture

```
Request → API Gateway → JWT Validation → Role/Permission Check → Service

JWT Payload:
{
  "sub": "user-uuid",
  "email": "user@example.com",
  "roles": ["ROLE_USER", "ROLE_PRO"],
  "tier": "pro",
  "tenantId": "tenant-uuid",
  "iat": 1700000000,
  "exp": 1700086400
}

RBAC Roles:
- ROLE_ANONYMOUS     → Landing page, free content
- ROLE_USER          → Free tier access
- ROLE_PRO           → Pro tier features
- ROLE_ENTERPRISE    → Enterprise features
- ROLE_INSTRUCTOR    → Content creation
- ROLE_ADMIN         → Platform administration
```

---

## Database Architecture

### PostgreSQL (Primary Relational Store)

**Used for:** Users, subscriptions, payments, certifications, structured learning data

### MongoDB (Document Store)

**Used for:** MCQ content, problem bank, course content, forum posts, AI conversation history

### Redis (Cache + Session)

**Used for:** Session management, rate limiting counters, leaderboard scores, real-time presence, queue management

### Elasticsearch (Search + Analytics)

**Used for:** Problem search, user search, forum full-text search, log aggregation

### Pinecone / pgvector (Vector Store)

**Used for:** AI semantic search, resume matching, job recommendation, similar problem suggestions

---

## Cloud Infrastructure (AWS)

### Architecture Diagram

```
┌──────────────────────────────────────────────────────────────────┐
│                         AWS Cloud                                 │
│                                                                   │
│  ┌─────────────────────────────────────────────────────────────┐ │
│  │                   Route 53 (DNS)                            │ │
│  └─────────────────────────┬───────────────────────────────────┘ │
│                            │                                      │
│  ┌─────────────────────────▼───────────────────────────────────┐ │
│  │              CloudFront (CDN + WAF)                         │ │
│  │         Static files | API caching | DDoS protection        │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────────────────┐ │
│  │              Application Load Balancer                      │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│  ┌──────▼──────────────────────────────────────────────────────┐ │
│  │          EKS Cluster (Kubernetes)                           │ │
│  │                                                             │ │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐       │ │
│  │  │  Node Group  │ │  Node Group  │ │  Node Group  │       │ │
│  │  │  (General)   │ │  (Compute)   │ │  (AI/ML)     │       │ │
│  │  │  t3.xlarge   │ │  c5.2xlarge  │ │  g4dn.xlarge │       │ │
│  │  └──────────────┘ └──────────────┘ └──────────────┘       │ │
│  └──────┬──────────────────────────────────────────────────────┘ │
│         │                                                         │
│  ┌──────▼────────────────────────────────────────────────────┐   │
│  │                   Data Layer                              │   │
│  │                                                           │   │
│  │  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌────────────┐  │   │
│  │  │ RDS      │ │DocumentDB│ │ElastiCache│ │OpenSearch  │  │   │
│  │  │(Postgres)│ │(MongoDB) │ │  (Redis) │ │(ES)        │  │   │
│  │  └──────────┘ └──────────┘ └──────────┘ └────────────┘  │   │
│  └───────────────────────────────────────────────────────────┘   │
│                                                                   │
│  ┌───────────────────────────────────────────────────────────┐   │
│  │                Supporting Services                        │   │
│  │  S3 (Files) | SQS (Queues) | SNS (Notifications)         │   │
│  │  Lambda (Serverless) | Secrets Manager | KMS              │   │
│  │  CloudWatch | X-Ray | Config | GuardDuty                  │   │
│  └───────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────┘
```

### AWS Services Mapping

| AWS Service | Usage | Config |
|-------------|-------|--------|
| **EKS** | Kubernetes cluster | Multi-AZ, 3 node groups |
| **RDS PostgreSQL** | Primary database | Multi-AZ, db.r6g.xlarge |
| **DocumentDB** | MongoDB compatible | 3-node cluster |
| **ElastiCache Redis** | Caching, sessions | Cluster mode, r6g.large |
| **OpenSearch** | Search, logs | 3-node, m6g.large |
| **S3** | Assets, recordings | Versioning, lifecycle rules |
| **CloudFront** | CDN | 400+ edge locations |
| **ALB** | Load balancing | Path-based routing |
| **SQS** | Async queues | FIFO + Standard |
| **SNS** | Fan-out notifications | Email, SMS, push |
| **Lambda** | Serverless functions | PDF gen, image processing |
| **API Gateway** | WebSocket API | Real-time features |
| **Cognito / Auth0** | Identity management | Optional external IdP |
| **Secrets Manager** | Credentials | Rotation enabled |
| **KMS** | Encryption | CMK for sensitive data |
| **WAF** | Web application firewall | OWASP rules |
| **GuardDuty** | Threat detection | Enabled across accounts |
| **CloudWatch** | Monitoring | Custom dashboards |
| **X-Ray** | Distributed tracing | All services instrumented |

---

## Kubernetes Architecture

### Cluster Configuration

```yaml
# Namespace structure
namespaces:
  - avantika-prod
  - avantika-staging
  - avantika-monitoring
  - avantika-infra

# Node Groups
nodeGroups:
  general:
    instanceType: t3.xlarge     # 4 vCPU, 16 GB RAM
    minSize: 3
    maxSize: 15
    services: [auth, user, learning, practice, community]

  compute:
    instanceType: c5.2xlarge    # 8 vCPU, 16 GB RAM
    minSize: 2
    maxSize: 10
    services: [interview, analytics, certification]

  ai-ml:
    instanceType: g4dn.xlarge   # 4 vCPU, 16 GB, 1 GPU
    minSize: 1
    maxSize: 5
    services: [ai-service, resume-service, matching-service]
```

### Service Deployment Pattern (Example)

```yaml
# learning-service deployment
apiVersion: apps/v1
kind: Deployment
metadata:
  name: learning-service
  namespace: avantika-prod
spec:
  replicas: 3
  selector:
    matchLabels:
      app: learning-service
  template:
    spec:
      containers:
        - name: learning-service
          image: avantika/learning-service:1.2.3
          resources:
            requests:
              memory: "512Mi"
              cpu: "250m"
            limits:
              memory: "1Gi"
              cpu: "500m"
          livenessProbe:
            httpGet:
              path: /actuator/health/liveness
              port: 8083
          readinessProbe:
            httpGet:
              path: /actuator/health/readiness
              port: 8083
          env:
            - name: SPRING_PROFILES_ACTIVE
              value: "prod"
            - name: DB_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: db-secrets
                  key: password
---
apiVersion: v1
kind: Service
metadata:
  name: learning-service
spec:
  selector:
    app: learning-service
  ports:
    - port: 8083
      targetPort: 8083
---
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: learning-service-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: learning-service
  minReplicas: 3
  maxReplicas: 20
  metrics:
    - type: Resource
      resource:
        name: cpu
        target:
          type: Utilization
          averageUtilization: 70
```

---

## Event-Driven Architecture (Kafka)

### Topic Design

| Topic | Producer | Consumer | Purpose |
|-------|----------|----------|---------|
| `user.registered` | Auth Service | User, Notification, Analytics | New user onboarding |
| `user.subscription.upgraded` | Payment Service | User, AI, Analytics | Unlock features |
| `practice.submission.completed` | Practice Service | Analytics, Notification | Score, badges |
| `interview.session.completed` | Interview Service | Analytics, AI, Notification | Post-interview report |
| `ai.credits.consumed` | AI Service | User, Payment | Token tracking |
| `resume.analyzed` | Resume Service | User, Notification | Resume score delivered |
| `certification.earned` | Certification Service | User, Notification, LinkedIn | Certificate issued |
| `daily.challenge.reset` | Scheduler | Practice, Analytics | Daily job trigger |

---

## Observability Stack

### Monitoring Architecture

```
Application Services
        │
        ▼ (OpenTelemetry SDK)
┌───────────────────┐
│   OTel Collector  │
└──┬────────────┬───┘
   │            │
   ▼            ▼
Prometheus   Jaeger
(Metrics)    (Traces)
   │
   ▼
Grafana (Dashboards)
   +
Alertmanager → PagerDuty / Slack

Logs → CloudWatch Logs / ELK Stack
Synthetic Monitoring → Datadog Synthetics
Uptime → Pingdom / UptimeRobot
```

### Key Metrics to Monitor

| Metric | Alert Threshold | Action |
|--------|----------------|--------|
| API Response Time (p99) | > 2 seconds | Scale up pods |
| Error Rate | > 1% | PagerDuty alert |
| AI Service Latency | > 5 seconds | Fallback model |
| DB Connection Pool | > 80% | Add read replicas |
| Kafka Consumer Lag | > 10,000 msgs | Scale consumers |
| Pod CPU Usage | > 75% | HPA trigger |
| Token Consumption Rate | > 80% quota | Rate limit AI calls |

---

## Authentication Flow

```
1. User → Login Page
2. Google OAuth / GitHub OAuth / Email+Password
3. Auth Service validates credentials
4. Auth Service generates JWT (Access Token: 1hr) + Refresh Token (7 days)
5. Tokens stored in httpOnly cookies + Redis (for invalidation)
6. Each request: API Gateway validates JWT signature
7. On expiry: Refresh token flow → new access token
8. On logout: Refresh token invalidated in Redis

Multi-tenant flow:
- tenantId embedded in JWT claims
- All DB queries scoped to tenantId
- Separate S3 buckets/prefixes per enterprise tenant
- Data isolation enforced at service level
```

---

## CI/CD Pipeline

```
Developer Push → GitHub
        │
        ▼
GitHub Actions (CI)
  ├── Unit Tests
  ├── Integration Tests
  ├── Static Analysis (SonarQube)
  ├── Security Scan (Snyk / OWASP ZAP)
  ├── Docker Build
  └── Push to ECR
        │
        ▼ (on merge to main)
ArgoCD (CD)
  ├── Deploy to Staging (EKS)
  ├── Run E2E Tests (Playwright)
  ├── Performance Tests (k6)
  └── Deploy to Production (blue-green)
        │
        ▼
Slack Notification → Team Channel
```

---

## Disaster Recovery

| Component | RPO | RTO | Strategy |
|-----------|-----|-----|---------|
| PostgreSQL | 5 min | 30 min | Multi-AZ + automated backups |
| MongoDB | 5 min | 30 min | Multi-AZ replica set |
| Redis | 0 | 5 min | ElastiCache replication group |
| S3 | 0 | Instant | Cross-region replication |
| EKS | N/A | 15 min | Multi-AZ node groups |
| Application | N/A | < 5 min | Rolling deployments, HPA |

**Backup Schedule:**
- PostgreSQL: Continuous WAL archiving + daily snapshots
- DocumentDB: Continuous backup, 35-day retention
- S3: Versioning enabled + Glacier Intelligent Tiering

---

*Architecture Version: 1.0 | Last Updated: 2026-02 | Avantika Platform Engineering*
