# Microservices & Cloud Deployment Guide — Avantika Interview Preparation

## Microservices Design Principles

1. **Single Responsibility** — Each service owns one bounded context
2. **API-First** — Services communicate via well-defined REST/gRPC contracts
3. **Event-Driven** — Async communication via Kafka for decoupling
4. **Database-Per-Service** — No shared databases; data sovereignty per service
5. **Failure Isolation** — Circuit breakers prevent cascading failures
6. **Observability-First** — Every service exposes health, metrics, traces

---

## Service Dependency Map

```
                          ┌─────────────┐
                          │ API Gateway  │
                          │  (NGINX/Kong)│
                          └──────┬──────┘
                                 │
            ┌────────────────────┼────────────────────┐
            │                    │                    │
     ┌──────▼──────┐    ┌────────▼──────┐   ┌────────▼──────┐
     │ Auth Service │    │ User Service  │   │Learning Service│
     │   (8081)    │    │   (8082)      │   │   (8083)       │
     └──────┬──────┘    └────────┬──────┘   └────────┬──────┘
            │                    │                    │
            └────────────────────┼────────────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │     Kafka Event Bus      │
                    │  (user.registered,       │
                    │   submission.completed,  │
                    │   interview.ended, ...)  │
                    └────────────┬────────────┘
                                 │
         ┌───────────────────────┼──────────────────────┐
         │                       │                      │
  ┌──────▼──────┐      ┌─────────▼───────┐    ┌────────▼──────┐
  │ Practice    │      │ Analytics       │    │ Notification  │
  │ Service     │      │ Service         │    │ Service       │
  │  (8084)     │      │  (8088)         │    │  (8089)       │
  └─────────────┘      └─────────────────┘    └───────────────┘

  ┌─────────────┐      ┌─────────────────┐    ┌───────────────┐
  │ AI Service  │      │ Interview Service│    │ Resume Service│
  │  (8085)     │      │  (8086)         │    │  (8087)       │
  └─────────────┘      └─────────────────┘    └───────────────┘
```

---

## Service Specifications

### Auth Service (Java / Spring Boot 3)

```yaml
Responsibility: User authentication, authorization, token management
Database: PostgreSQL (users, credentials, refresh_tokens)
Cache: Redis (sessions, blacklisted tokens)
Endpoints:
  - POST /auth/register
  - POST /auth/login
  - POST /auth/oauth/{provider}
  - POST /auth/token/refresh
  - POST /auth/logout
Events Published:
  - user.registered (topic)
  - user.login (topic)
External Dependencies:
  - Google OAuth API
  - GitHub OAuth API
  - SendGrid (email verification)
Scaling: Stateless, horizontally scalable, 3-10 pods
Resources: 256m CPU, 512Mi RAM per pod
```

### Practice Service (Java / Spring Boot 3)

```yaml
Responsibility: DSA problems, MCQ, code execution, submissions
Database:
  - PostgreSQL (submissions, mcq_attempts)
  - MongoDB (problem content, test cases, solutions)
Cache: Redis (problem cache, user solved set)
External Dependencies:
  - Judge0 API (code execution sandbox) OR self-hosted
Events Published:
  - practice.submission.accepted
  - practice.submission.attempted
  - practice.mcq.completed
Scaling: CPU-intensive for code execution, 5-20 pods
Resources: 500m CPU, 1Gi RAM per pod
```

**Code Execution Architecture:**

```
Submission → Practice Service → Job Queue (SQS/Kafka)
        │
        ▼
Code Execution Worker (isolated container):
  ├── Pull code from queue
  ├── Spin isolated Docker sandbox (Judge0 or gVisor)
  ├── Run against all test cases (time + memory limited)
  ├── Return results via queue
  └── Worker auto-scales based on queue depth
```

### AI Service (Python / FastAPI)

```yaml
Responsibility: LLM orchestration, code review, resume analysis, AI chat
Runtime: Python 3.12 + FastAPI + Uvicorn
LLM Clients: anthropic, openai (fallback)
Database: MongoDB (AI conversations, feedback)
Cache: Redis (semantic cache, token budgets)
Vector Store: Pinecone (embeddings for RAG, recommendations)
Events Consumed:
  - interview.ai.session.start
Events Published:
  - ai.tokens.consumed
  - interview.ai.completed
Scaling: GPU nodes for inference, 2-8 pods
Resources: 1000m CPU, 2Gi RAM, optional GPU (g4dn.xlarge)
```

```python
# AI Service main.py structure
from fastapi import FastAPI
from contextlib import asynccontextmanager
from anthropic import AsyncAnthropic

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: initialize clients, warm up models
    app.state.anthropic = AsyncAnthropic()
    app.state.pinecone = init_pinecone()
    app.state.redis = await init_redis()
    yield
    # Shutdown: cleanup

app = FastAPI(lifespan=lifespan)

# Routers
app.include_router(interview_router, prefix="/interview")
app.include_router(code_review_router, prefix="/code")
app.include_router(resume_router, prefix="/resume")
app.include_router(mentor_router, prefix="/mentor")
```

### Interview Service (Node.js / Express + Socket.io)

```yaml
Responsibility: Mock interview scheduling, WebRTC signaling, recording
Runtime: Node.js 22 + TypeScript
Database: PostgreSQL (sessions, schedules)
Cache: Redis (active sessions, peer matching)
Realtime: Socket.io (WebSocket)
File Storage: S3 (interview recordings)
Events Published:
  - interview.session.scheduled
  - interview.session.completed
Scaling: Sticky sessions for WebSocket (3-6 pods)
Resources: 250m CPU, 512Mi RAM per pod
```

### Analytics Service (Java / Spring Boot)

```yaml
Responsibility: Progress tracking, leaderboards, reports, readiness scores
Database: PostgreSQL (aggregated metrics), Elasticsearch (log analysis)
Cache: Redis (leaderboard sorted sets)
Events Consumed:
  - practice.submission.accepted
  - interview.session.completed
  - learning.module.completed
  - user.streak.updated
Processing: Batch jobs (daily reports) + real-time updates
Scaling: 2-5 pods, scale up for batch processing
Resources: 500m CPU, 1Gi RAM per pod
```

---

## Kubernetes Configurations

### Namespace & RBAC

```yaml
# namespaces.yaml
apiVersion: v1
kind: Namespace
metadata:
  name: avantika-prod
  labels:
    app.kubernetes.io/managed-by: helm
---
apiVersion: v1
kind: Namespace
metadata:
  name: avantika-monitoring
```

### ConfigMap Pattern

```yaml
# config/learning-service-config.yaml
apiVersion: v1
kind: ConfigMap
metadata:
  name: learning-service-config
  namespace: avantika-prod
data:
  SPRING_PROFILES_ACTIVE: "prod"
  SERVER_PORT: "8083"
  KAFKA_BOOTSTRAP_SERVERS: "kafka.avantika-infra:9092"
  REDIS_HOST: "redis.avantika-infra"
  MONGODB_DATABASE: "avantika_content"
```

### Secret Management

```yaml
# Secrets managed via AWS Secrets Manager + External Secrets Operator
apiVersion: external-secrets.io/v1beta1
kind: SecretStore
metadata:
  name: aws-secrets-manager
  namespace: avantika-prod
spec:
  provider:
    aws:
      service: SecretsManager
      region: ap-south-1
      auth:
        jwt:
          serviceAccountRef:
            name: external-secrets-sa
---
apiVersion: external-secrets.io/v1beta1
kind: ExternalSecret
metadata:
  name: db-secrets
  namespace: avantika-prod
spec:
  refreshInterval: 1h
  secretStoreRef:
    name: aws-secrets-manager
    kind: SecretStore
  target:
    name: db-secrets
  data:
    - secretKey: password
      remoteRef:
        key: avantika/prod/postgres
        property: password
```

### Service Mesh (Istio)

```yaml
# VirtualService for traffic management
apiVersion: networking.istio.io/v1alpha3
kind: VirtualService
metadata:
  name: ai-service
  namespace: avantika-prod
spec:
  hosts:
    - ai-service
  http:
    - timeout: 60s        # AI responses can be slow
      retries:
        attempts: 2
        perTryTimeout: 30s
        retryOn: 5xx,retriable-4xx
      route:
        - destination:
            host: ai-service
            port:
              number: 8085
---
# Circuit breaker (DestinationRule)
apiVersion: networking.istio.io/v1alpha3
kind: DestinationRule
metadata:
  name: ai-service-cb
spec:
  host: ai-service
  trafficPolicy:
    outlierDetection:
      consecutive5xxErrors: 3
      interval: 10s
      baseEjectionTime: 30s
      maxEjectionPercent: 50
```

---

## Helm Chart Structure

```
helm/
├── charts/
│   ├── auth-service/
│   │   ├── Chart.yaml
│   │   ├── values.yaml
│   │   ├── values-prod.yaml
│   │   └── templates/
│   │       ├── deployment.yaml
│   │       ├── service.yaml
│   │       ├── hpa.yaml
│   │       ├── pdb.yaml          # Pod Disruption Budget
│   │       └── servicemonitor.yaml  # Prometheus scraping
│   ├── practice-service/
│   ├── ai-service/
│   └── ...
└── avantika-platform/            # Umbrella chart
    ├── Chart.yaml
    ├── values.yaml
    └── requirements.yaml         # All sub-charts
```

```yaml
# Sample values.yaml for ai-service
replicaCount: 2
image:
  repository: 123456789.dkr.ecr.ap-south-1.amazonaws.com/avantika/ai-service
  tag: "1.2.3"
  pullPolicy: IfNotPresent

resources:
  requests:
    memory: "1Gi"
    cpu: "500m"
  limits:
    memory: "2Gi"
    cpu: "1000m"

autoscaling:
  enabled: true
  minReplicas: 2
  maxReplicas: 8
  targetCPUUtilizationPercentage: 70

env:
  ANTHROPIC_MODEL: "claude-sonnet-4-6"
  PINECONE_ENVIRONMENT: "us-east-1-aws"

tolerations:
  - key: "gpu-node"
    operator: "Equal"
    value: "true"
    effect: "NoSchedule"
```

---

## CI/CD Pipeline (GitHub Actions + ArgoCD)

### GitHub Actions Workflow

```yaml
# .github/workflows/service-ci.yml
name: Service CI

on:
  push:
    branches: [main, develop]
    paths:
      - 'services/learning-service/**'

env:
  SERVICE_NAME: learning-service
  ECR_REPOSITORY: avantika/learning-service
  AWS_REGION: ap-south-1

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Set up JDK 21
        uses: actions/setup-java@v4
        with:
          java-version: '21'
          distribution: 'temurin'

      - name: Run unit tests
        run: ./mvnw test
        working-directory: services/learning-service

      - name: Run integration tests
        run: ./mvnw verify -P integration-test
        working-directory: services/learning-service

      - name: SonarQube analysis
        uses: SonarSource/sonarcloud-github-action@master
        env:
          SONAR_TOKEN: ${{ secrets.SONAR_TOKEN }}

      - name: Security scan (Snyk)
        uses: snyk/actions/maven@master
        env:
          SNYK_TOKEN: ${{ secrets.SNYK_TOKEN }}

  build-push:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: ${{ secrets.AWS_ROLE_ARN }}
          aws-region: ${{ env.AWS_REGION }}

      - name: Login to Amazon ECR
        id: login-ecr
        uses: aws-actions/amazon-ecr-login@v2

      - name: Build and push Docker image
        env:
          ECR_REGISTRY: ${{ steps.login-ecr.outputs.registry }}
          IMAGE_TAG: ${{ github.sha }}
        run: |
          docker build -t $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
            services/$SERVICE_NAME/
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG
          docker tag $ECR_REGISTRY/$ECR_REPOSITORY:$IMAGE_TAG \
                     $ECR_REGISTRY/$ECR_REPOSITORY:latest
          docker push $ECR_REGISTRY/$ECR_REPOSITORY:latest

      - name: Update Helm values (triggers ArgoCD)
        run: |
          git config --global user.email "ci@avantika.io"
          git config --global user.name "Avantika CI"
          sed -i "s|tag: .*|tag: \"${{ github.sha }}\"|" \
            helm/charts/$SERVICE_NAME/values-prod.yaml
          git add helm/charts/$SERVICE_NAME/values-prod.yaml
          git commit -m "ci: update $SERVICE_NAME image to ${{ github.sha }}"
          git push
```

### ArgoCD Application

```yaml
# argocd/apps/avantika-prod.yaml
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata:
  name: avantika-prod
  namespace: argocd
spec:
  project: avantika
  source:
    repoURL: https://github.com/avantika-io/platform-gitops
    targetRevision: main
    path: helm/avantika-platform
    helm:
      valueFiles:
        - values-prod.yaml
  destination:
    server: https://kubernetes.default.svc
    namespace: avantika-prod
  syncPolicy:
    automated:
      prune: true
      selfHeal: true
    syncOptions:
      - CreateNamespace=true
      - PrunePropagationPolicy=foreground
```

---

## Kafka Event Schema (Avro)

```json
// user.registered event schema
{
  "namespace": "io.avantika.events",
  "type": "record",
  "name": "UserRegistered",
  "fields": [
    { "name": "eventId",    "type": "string" },
    { "name": "userId",     "type": "string" },
    { "name": "email",      "type": "string" },
    { "name": "fullName",   "type": "string" },
    { "name": "tier",       "type": "string", "default": "free" },
    { "name": "provider",   "type": "string" },
    { "name": "occurredAt", "type": "long",   "logicalType": "timestamp-millis" }
  ]
}

// practice.submission.completed event schema
{
  "namespace": "io.avantika.events",
  "type": "record",
  "name": "SubmissionCompleted",
  "fields": [
    { "name": "eventId",      "type": "string" },
    { "name": "submissionId", "type": "string" },
    { "name": "userId",       "type": "string" },
    { "name": "problemId",    "type": "string" },
    { "name": "status",       "type": "string" },
    { "name": "language",     "type": "string" },
    { "name": "runtimeMs",    "type": ["null", "int"], "default": null },
    { "name": "xpEarned",     "type": "int", "default": 0 },
    { "name": "occurredAt",   "type": "long" }
  ]
}
```

---

## Environment Strategy

| Environment | Purpose | Auto-deploy | Data |
|-------------|---------|-------------|------|
| **dev** | Local development | No | Mock data |
| **staging** | Pre-production testing | Yes (on PR merge) | Anonymized prod copy |
| **prod** | Live platform | Yes (on main merge) | Real data |
| **dr** | Disaster recovery | Manual | Backup data |

### Feature Flags

Feature flags managed via **Flagsmith** (self-hosted):

```java
// Feature flag usage in service
@Service
public class AIInterviewService {
    @Autowired
    private FlagsmithClient flagsmith;

    public InterviewSession startInterview(User user, InterviewRequest req) {
        // Check if streaming enabled for this user
        boolean streamingEnabled = flagsmith.isFeatureEnabled(
            "ai_interview_streaming",
            FlagsmithUser.builder().identifier(user.getId()).build()
        );

        // New model rollout (10% of users)
        boolean useNewModel = flagsmith.isFeatureEnabled(
            "claude_opus_experiment",
            FlagsmithUser.builder().identifier(user.getId()).build()
        );

        String model = useNewModel ? "claude-opus-4-6" : "claude-sonnet-4-6";
        // ...
    }
}
```

---

## Monitoring & Alerting

### Prometheus Rules

```yaml
# alerts/avantika-alerts.yaml
groups:
  - name: avantika.slos
    rules:
      - alert: HighAPILatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "API p99 latency > 2s for {{ $labels.service }}"

      - alert: HighErrorRate
        expr: rate(http_requests_total{status=~"5.."}[5m]) / rate(http_requests_total[5m]) > 0.01
        for: 2m
        labels:
          severity: critical
        annotations:
          summary: "Error rate > 1% on {{ $labels.service }}"

      - alert: AIServiceDown
        expr: up{job="ai-service"} == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: "AI Service is DOWN - degraded user experience"

      - alert: KafkaConsumerLag
        expr: kafka_consumer_group_lag > 10000
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: "Kafka consumer lag > 10,000 messages for {{ $labels.group }}"
```

### Grafana Dashboards

| Dashboard | Key Panels |
|-----------|-----------|
| Platform Overview | Active users, API latency, error rate, AI usage |
| Service Health | Pod status, CPU/Memory, request rate per service |
| Business Metrics | Signups/day, conversions, MRR, churn indicators |
| AI Performance | Token usage, cost/day, latency, satisfaction scores |
| Infrastructure | Node health, EKS capacity, RDS connections, Redis memory |

---

## SLA Targets

| Service | Availability | Latency (p99) |
|---------|-------------|--------------|
| Platform (overall) | 99.9% | < 2 seconds |
| Auth Service | 99.99% | < 200ms |
| Practice Service | 99.9% | < 500ms |
| AI Service | 99.5% | < 8 seconds |
| Interview Recording | 99.5% | < 3 seconds |
| Analytics | 99.5% | < 3 seconds |

---

## Security Hardening

```yaml
# Pod Security Standards
apiVersion: policy/v1beta1
kind: PodSecurityPolicy
metadata:
  name: avantika-restricted
spec:
  privileged: false
  allowPrivilegeEscalation: false
  readOnlyRootFilesystem: true
  runAsNonRoot: true
  runAsUser:
    rule: MustRunAsNonRoot
  seccompProfile:
    type: RuntimeDefault
  capabilities:
    drop: [ALL]

# Network Policy — services only talk to what they need
apiVersion: networking.k8s.io/v1
kind: NetworkPolicy
metadata:
  name: practice-service-policy
  namespace: avantika-prod
spec:
  podSelector:
    matchLabels:
      app: practice-service
  policyTypes:
    - Ingress
    - Egress
  ingress:
    - from:
        - podSelector:
            matchLabels:
              app: api-gateway
  egress:
    - to:
        - podSelector:
            matchLabels:
              app: postgres
    - to:
        - podSelector:
            matchLabels:
              app: redis
    - to:
        - podSelector:
            matchLabels:
              app: kafka
```

---

## Infrastructure as Code (Terraform)

```
terraform/
├── environments/
│   ├── prod/
│   │   ├── main.tf
│   │   ├── variables.tf
│   │   └── terraform.tfvars
│   └── staging/
├── modules/
│   ├── eks/               # EKS cluster
│   ├── rds/               # PostgreSQL
│   ├── documentdb/        # MongoDB
│   ├── elasticache/       # Redis
│   ├── opensearch/        # Elasticsearch
│   ├── s3/                # Storage buckets
│   ├── cloudfront/        # CDN
│   ├── waf/               # Web Application Firewall
│   └── monitoring/        # CloudWatch, alarms
└── README.md
```

```hcl
# modules/eks/main.tf (excerpt)
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "avantika-${var.environment}"
  cluster_version = "1.30"
  vpc_id          = module.vpc.vpc_id
  subnet_ids      = module.vpc.private_subnets

  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    general = {
      instance_types = ["t3.xlarge"]
      min_size       = 3
      max_size       = 15
      desired_size   = 5
    }

    compute = {
      instance_types = ["c5.2xlarge"]
      min_size       = 2
      max_size       = 10
      desired_size   = 3
    }

    ai_ml = {
      instance_types = ["g4dn.xlarge"]
      min_size       = 1
      max_size       = 5
      desired_size   = 2
      taints = [{
        key    = "gpu-node"
        value  = "true"
        effect = "NO_SCHEDULE"
      }]
    }
  }
}
```

---

*Microservices & Deployment Guide v1.0 | DevOps/Platform Engineering Team — Avantika*
