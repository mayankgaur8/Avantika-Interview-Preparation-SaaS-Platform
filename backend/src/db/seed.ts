/**
 * Seed default plans into the database.
 * Run once: npm run seed --workspace=backend
 * Safe to re-run — skips if plans already exist.
 */
import { getDb } from '../config/database';

const plans = [
  {
    id: 'plan_free',
    name: 'Free',
    level: 'free',
    amount: 0,
    currency: 'INR',
    duration_days: 36500, // ~100 years (permanent free)
    features: [
      '5 Daily challenges',
      '50 MCQ questions',
      'Basic learning paths',
      'Community access',
      '1 mock interview/month',
    ],
    limits: {
      daily_challenges: 5,
      mcq_questions: 50,
      mock_interviews: 1,
      ai_interviews: 0,
      resume_analyses: 0,
    },
  },
  {
    id: 'plan_basic',
    name: 'Basic',
    level: 'basic',
    amount: 49900, // ₹499 in paise
    currency: 'INR',
    duration_days: 30,
    features: [
      'Unlimited daily challenges',
      '500 MCQ questions',
      'All learning paths',
      'Community access',
      '5 mock interviews/month',
      'Resume analyzer (3 analyses)',
      'Job board access',
    ],
    limits: {
      daily_challenges: -1,
      mcq_questions: 500,
      mock_interviews: 5,
      ai_interviews: 2,
      resume_analyses: 3,
    },
  },
  {
    id: 'plan_pro',
    name: 'Pro',
    level: 'pro',
    amount: 99900, // ₹999 in paise
    currency: 'INR',
    duration_days: 30,
    features: [
      'Everything in Basic',
      'Unlimited MCQ + Coding practice',
      'Unlimited mock interviews',
      'AI Interview Coach (unlimited)',
      'Resume analyzer (unlimited)',
      'System design lab',
      'Analytics & progress reports',
      'Priority community support',
      'Certifications',
    ],
    limits: {
      daily_challenges: -1,
      mcq_questions: -1,
      mock_interviews: -1,
      ai_interviews: -1,
      resume_analyses: -1,
    },
  },
  {
    id: 'plan_enterprise',
    name: 'Enterprise',
    level: 'enterprise',
    amount: 299900, // ₹2999 in paise
    currency: 'INR',
    duration_days: 30,
    features: [
      'Everything in Pro',
      'Team management (up to 20 seats)',
      'Custom learning paths',
      'Dedicated account manager',
      'Bulk resume review',
      'Priority 24/7 support',
      'White-label options',
      'API access',
    ],
    limits: {
      daily_challenges: -1,
      mcq_questions: -1,
      mock_interviews: -1,
      ai_interviews: -1,
      resume_analyses: -1,
      team_seats: 20,
    },
  },
];

function seed(): void {
  const db = getDb();

  const existing = (db.prepare('SELECT COUNT(*) as count FROM plans').get() as { count: number }).count;
  if (existing > 0) {
    console.log('Plans already seeded. Run DELETE FROM plans first to re-seed.');
    process.exit(0);
  }

  const insert = db.prepare(`
    INSERT INTO plans (id, name, level, amount, currency, duration_days, features_json, limits_json, active, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
  `);

  const now = Date.now();
  for (const plan of plans) {
    insert.run(
      plan.id,
      plan.name,
      plan.level,
      plan.amount,
      plan.currency,
      plan.duration_days,
      JSON.stringify(plan.features),
      JSON.stringify(plan.limits),
      now,
    );
    console.log(`  Seeded plan: ${plan.name} (₹${plan.amount / 100})`);
  }

  console.log('\nAll plans seeded successfully!');
}

seed();
