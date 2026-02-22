// ============================================================
// AVANTIKA — Complete Mock Data
// ============================================================

export const currentUser = {
  id: 'user_01',
  name: 'Avantika Sharma',
  email: 'avantika@example.com',
  username: 'avantika_sharma',
  avatar: 'AS',
  tier: 'pro' as const,
  currentRole: 'Software Engineer',
  targetRole: 'Senior Backend Engineer',
  targetCompany: 'Google',
  yearsExperience: 3,
  country: 'India',
  joinedAt: '2024-01-15',
  streak: 14,
  longestStreak: 21,
  xp: 4850,
  level: 12,
  xpToNextLevel: 150,
  interviewReadiness: 72,
  bio: 'Aspiring Senior SDE passionate about distributed systems and DSA.',
};

// ============================================================
// LEARNING PATHS
// ============================================================
export const learningPaths = [
  {
    id: 'lp1',
    slug: 'dsa-mastery',
    title: 'DSA Mastery',
    description: 'Complete Data Structures & Algorithms from arrays to graphs and dynamic programming.',
    category: 'topic',
    level: 'all',
    estimatedHours: 120,
    modulesCount: 32,
    enrolledCount: 48200,
    rating: 4.8,
    isPremium: false,
    progress: 65,
    enrolled: true,
    icon: '🧩',
    color: 'blue',
    topics: ['Arrays', 'Trees', 'Graphs', 'DP', 'Sorting'],
  },
  {
    id: 'lp2',
    slug: 'system-design-mastery',
    title: 'System Design Mastery',
    description: 'HLD, LLD, distributed systems, scalability patterns, and real-world architectures.',
    category: 'topic',
    level: 'mid',
    estimatedHours: 80,
    modulesCount: 24,
    enrolledCount: 31500,
    rating: 4.9,
    isPremium: true,
    progress: 30,
    enrolled: true,
    icon: '🏗️',
    color: 'purple',
    topics: ['HLD', 'LLD', 'CAP', 'Microservices', 'Caching'],
  },
  {
    id: 'lp3',
    slug: 'backend-engineering',
    title: 'Backend Engineering',
    description: 'Spring Boot, REST APIs, microservices, databases, and cloud deployment.',
    category: 'role',
    level: 'mid',
    estimatedHours: 100,
    modulesCount: 28,
    enrolledCount: 22100,
    rating: 4.7,
    isPremium: true,
    progress: 0,
    enrolled: false,
    icon: '⚙️',
    color: 'green',
    topics: ['Spring Boot', 'REST', 'PostgreSQL', 'Redis', 'Docker'],
  },
  {
    id: 'lp4',
    slug: 'frontend-expert',
    title: 'Frontend Expert',
    description: 'React, TypeScript, performance, accessibility, and frontend system design.',
    category: 'role',
    level: 'all',
    estimatedHours: 90,
    modulesCount: 26,
    enrolledCount: 19800,
    rating: 4.6,
    isPremium: false,
    progress: 0,
    enrolled: false,
    icon: '🎨',
    color: 'pink',
    topics: ['React', 'TypeScript', 'CSS', 'Performance', 'Testing'],
  },
  {
    id: 'lp5',
    slug: 'cloud-devops',
    title: 'Cloud & DevOps',
    description: 'AWS, Kubernetes, Docker, CI/CD pipelines, and infrastructure as code.',
    category: 'role',
    level: 'senior',
    estimatedHours: 110,
    modulesCount: 30,
    enrolledCount: 15400,
    rating: 4.8,
    isPremium: true,
    progress: 0,
    enrolled: false,
    icon: '☁️',
    color: 'cyan',
    topics: ['AWS', 'Kubernetes', 'Terraform', 'CI/CD', 'Monitoring'],
  },
  {
    id: 'lp6',
    slug: 'ai-ml-engineering',
    title: 'AI/ML Engineering',
    description: 'LLMs, RAG systems, vector databases, prompt engineering, and AI agents.',
    category: 'role',
    level: 'senior',
    estimatedHours: 95,
    modulesCount: 22,
    enrolledCount: 12300,
    rating: 4.9,
    isPremium: true,
    progress: 0,
    enrolled: false,
    icon: '🤖',
    color: 'orange',
    topics: ['LLMs', 'RAG', 'Pinecone', 'Agents', 'Fine-tuning'],
  },
  {
    id: 'lp7',
    slug: 'faang-prep',
    title: 'FAANG Interview Prep',
    description: 'Complete preparation for top-tier companies: DSA + System Design + Behavioral.',
    category: 'company',
    level: 'all',
    estimatedHours: 150,
    modulesCount: 40,
    enrolledCount: 38900,
    rating: 4.9,
    isPremium: true,
    progress: 0,
    enrolled: false,
    icon: '🎯',
    color: 'yellow',
    topics: ['Google', 'Amazon', 'Meta', 'Microsoft', 'Apple'],
  },
  {
    id: 'lp8',
    slug: 'fresher-kickstart',
    title: 'Fresher Kickstart',
    description: 'Everything a fresh graduate needs to land their first tech job.',
    category: 'level',
    level: 'fresher',
    estimatedHours: 60,
    modulesCount: 18,
    enrolledCount: 52100,
    rating: 4.7,
    isPremium: false,
    progress: 0,
    enrolled: false,
    icon: '🚀',
    color: 'teal',
    topics: ['C++', 'Java', 'DSA Basics', 'Resume', 'Aptitude'],
  },
];

export const pathModules = [
  { id: 'm1', title: 'Arrays & Strings', duration: 90, type: 'video', completed: true, locked: false },
  { id: 'm2', title: 'Two Pointers & Sliding Window', duration: 75, type: 'video', completed: true, locked: false },
  { id: 'm3', title: 'Hash Maps & Sets', duration: 60, type: 'video', completed: true, locked: false },
  { id: 'm4', title: 'Stack & Queue', duration: 80, type: 'video', completed: true, locked: false },
  { id: 'm5', title: 'Binary Search', duration: 65, type: 'video', completed: false, locked: false },
  { id: 'm6', title: 'Linked Lists', duration: 85, type: 'video', completed: false, locked: false },
  { id: 'm7', title: 'Trees & BST', duration: 100, type: 'video', completed: false, locked: false },
  { id: 'm8', title: 'Heaps & Priority Queues', duration: 70, type: 'video', completed: false, locked: false },
  { id: 'm9', title: 'Graphs — BFS & DFS', duration: 110, type: 'video', completed: false, locked: true },
  { id: 'm10', title: 'Dynamic Programming', duration: 150, type: 'video', completed: false, locked: true },
  { id: 'm11', title: 'Greedy Algorithms', duration: 80, type: 'video', completed: false, locked: true },
  { id: 'm12', title: 'Backtracking', duration: 90, type: 'video', completed: false, locked: true },
];

// ============================================================
// DSA PROBLEMS
// ============================================================
export const dsaProblems = [
  {
    id: 'p1', slug: 'two-sum', title: 'Two Sum',
    difficulty: 'easy', acceptance: 49.1, submissions: '15.2M',
    companies: ['Google', 'Amazon', 'Facebook'],
    topics: ['Array', 'Hash Table'],
    status: 'accepted',
    isPremium: false,
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to target.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'nums[0] + nums[1] == 9, return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'nums[1] + nums[2] == 6, return [1, 2].' },
    ],
    constraints: ['2 ≤ nums.length ≤ 10⁴', '-10⁹ ≤ nums[i] ≤ 10⁹', 'Only one valid answer exists.'],
    starterCode: {
      java: `class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        // Your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def twoSum(self, nums: List[int], target: int) -> List[int]:\n        # Your solution here\n        pass`,
      javascript: `/**\n * @param {number[]} nums\n * @param {number} target\n * @return {number[]}\n */\nvar twoSum = function(nums, target) {\n    // Your solution here\n    \n};`,
    },
  },
  {
    id: 'p2', slug: 'valid-parentheses', title: 'Valid Parentheses',
    difficulty: 'easy', acceptance: 40.3, submissions: '11.8M',
    companies: ['Google', 'Microsoft', 'Amazon'],
    topics: ['String', 'Stack'],
    status: 'attempted',
    isPremium: false,
    description: 'Given a string s containing just the characters `(`, `)`, `{`, `}`, `[` and `]`, determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: '' },
      { input: 's = "()[]{}"', output: 'true', explanation: '' },
      { input: 's = "(]"', output: 'false', explanation: '' },
    ],
    constraints: ['1 ≤ s.length ≤ 10⁴', 's consists of parentheses only.'],
    starterCode: {
      java: `class Solution {\n    public boolean isValid(String s) {\n        // Your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def isValid(self, s: str) -> bool:\n        # Your solution here\n        pass`,
      javascript: `var isValid = function(s) {\n    // Your solution here\n    \n};`,
    },
  },
  {
    id: 'p3', slug: 'merge-intervals', title: 'Merge Intervals',
    difficulty: 'medium', acceptance: 46.8, submissions: '8.4M',
    companies: ['Google', 'Amazon', 'Bloomberg'],
    topics: ['Array', 'Sorting'],
    status: 'not_attempted',
    isPremium: false,
    description: 'Given an array of intervals, merge all overlapping intervals, and return an array of the non-overlapping intervals.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Intervals [1,3] and [2,6] overlap.' },
    ],
    constraints: ['1 ≤ intervals.length ≤ 10⁴'],
    starterCode: {
      java: `class Solution {\n    public int[][] merge(int[][] intervals) {\n        // Your solution here\n        \n    }\n}`,
      python: `class Solution:\n    def merge(self, intervals: List[List[int]]) -> List[List[int]]:\n        pass`,
      javascript: `var merge = function(intervals) {\n    \n};`,
    },
  },
  {
    id: 'p4', slug: 'lru-cache', title: 'LRU Cache',
    difficulty: 'medium', acceptance: 41.5, submissions: '6.2M',
    companies: ['Amazon', 'Microsoft', 'Goldman Sachs'],
    topics: ['Hash Table', 'Linked List', 'Design'],
    status: 'not_attempted',
    isPremium: false,
    description: 'Design a data structure that follows the constraints of a Least Recently Used (LRU) cache.',
    examples: [
      { input: 'LRUCache(2)\nput(1,1)\nput(2,2)\nget(1)\nput(3,3)\nget(2)', output: '1\n-1', explanation: '' },
    ],
    constraints: ['1 ≤ capacity ≤ 3000'],
    starterCode: {
      java: `class LRUCache {\n    public LRUCache(int capacity) {\n        \n    }\n    \n    public int get(int key) {\n        \n    }\n    \n    public void put(int key, int value) {\n        \n    }\n}`,
      python: `class LRUCache:\n    def __init__(self, capacity: int):\n        pass\n    \n    def get(self, key: int) -> int:\n        pass\n    \n    def put(self, key: int, value: int) -> None:\n        pass`,
      javascript: `class LRUCache {\n    constructor(capacity) {\n        \n    }\n    get(key) {}\n    put(key, value) {}\n}`,
    },
  },
  {
    id: 'p5', slug: 'word-ladder', title: 'Word Ladder',
    difficulty: 'hard', acceptance: 36.2, submissions: '3.1M',
    companies: ['Google', 'Amazon', 'Facebook'],
    topics: ['BFS', 'Hash Table', 'String'],
    status: 'not_attempted',
    isPremium: false,
    description: 'Given two words (beginWord and endWord) and a dictionary, find the length of the shortest transformation sequence.',
    examples: [
      { input: 'beginWord="hit", endWord="cog", wordList=["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'hit → hot → dot → dog → cog' },
    ],
    constraints: ['1 ≤ beginWord.length ≤ 10'],
    starterCode: {
      java: `class Solution {\n    public int ladderLength(String beginWord, String endWord, List<String> wordList) {\n        \n    }\n}`,
      python: `class Solution:\n    def ladderLength(self, beginWord: str, endWord: str, wordList: List[str]) -> int:\n        pass`,
      javascript: `var ladderLength = function(beginWord, endWord, wordList) {\n    \n};`,
    },
  },
  {
    id: 'p6', slug: 'climbing-stairs', title: 'Climbing Stairs',
    difficulty: 'easy', acceptance: 52.1, submissions: '9.8M',
    companies: ['Amazon', 'Apple', 'Adobe'],
    topics: ['Dynamic Programming', 'Memoization'],
    status: 'accepted',
    isPremium: false,
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can climb 1 or 2 steps. How many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, 2+1' },
    ],
    constraints: ['1 ≤ n ≤ 45'],
    starterCode: {
      java: `class Solution {\n    public int climbStairs(int n) {\n        \n    }\n}`,
      python: `class Solution:\n    def climbStairs(self, n: int) -> int:\n        pass`,
      javascript: `var climbStairs = function(n) {\n    \n};`,
    },
  },
];

// ============================================================
// MCQ QUESTIONS
// ============================================================
export const mcqTopics = [
  { id: 't1', name: 'Java Core', icon: '☕', questionsCount: 450, avgScore: 72 },
  { id: 't2', name: 'Python', icon: '🐍', questionsCount: 380, avgScore: 68 },
  { id: 't3', name: 'Data Structures', icon: '🌲', questionsCount: 520, avgScore: 65 },
  { id: 't4', name: 'Algorithms', icon: '⚡', questionsCount: 480, avgScore: 61 },
  { id: 't5', name: 'System Design', icon: '🏗️', questionsCount: 310, avgScore: 58 },
  { id: 't6', name: 'Databases', icon: '🗄️', questionsCount: 290, avgScore: 70 },
  { id: 't7', name: 'Operating Systems', icon: '💻', questionsCount: 240, avgScore: 63 },
  { id: 't8', name: 'Computer Networks', icon: '🌐', questionsCount: 210, avgScore: 66 },
  { id: 't9', name: 'Cloud & AWS', icon: '☁️', questionsCount: 320, avgScore: 55 },
  { id: 't10', name: 'Spring Boot', icon: '🍃', questionsCount: 280, avgScore: 69 },
  { id: 't11', name: 'React & Frontend', icon: '⚛️', questionsCount: 350, avgScore: 74 },
  { id: 't12', name: 'DevOps & Docker', icon: '🐳', questionsCount: 200, avgScore: 60 },
];

export const mcqQuestions = [
  {
    id: 'q1',
    question: 'What is the time complexity of QuickSort in the worst case?',
    options: ['O(n log n)', 'O(n²)', 'O(n)', 'O(log n)'],
    correct: 1,
    explanation: 'QuickSort has O(n²) worst-case when the pivot is always the smallest or largest element (e.g., already sorted array with last element as pivot). Average case is O(n log n).',
    topic: 'Algorithms',
    difficulty: 'medium',
  },
  {
    id: 'q2',
    question: 'Which data structure is used internally by Java\'s HashMap?',
    options: ['Red-Black Tree', 'Array of Linked Lists (Chaining)', 'B+ Tree', 'Skip List'],
    correct: 1,
    explanation: 'Java\'s HashMap uses an array of buckets, where each bucket is a linked list (chain). Since Java 8, when chain length exceeds 8, it converts to a Red-Black Tree for O(log n) lookup.',
    topic: 'Java Core',
    difficulty: 'medium',
  },
  {
    id: 'q3',
    question: 'In a microservices architecture, what is the Saga pattern used for?',
    options: [
      'Service discovery and load balancing',
      'Managing distributed transactions across services',
      'API rate limiting and throttling',
      'Circuit breaking for fault tolerance',
    ],
    correct: 1,
    explanation: 'Saga pattern manages distributed transactions by breaking them into a sequence of local transactions. Each step publishes an event, and compensating transactions are triggered on failures.',
    topic: 'System Design',
    difficulty: 'hard',
  },
  {
    id: 'q4',
    question: 'What does the CAP theorem state about distributed systems?',
    options: [
      'A system can be Consistent, Available, and Partition-tolerant at the same time',
      'A system can guarantee at most 2 of: Consistency, Availability, Partition tolerance',
      'Consistency always takes priority over Availability',
      'Partition tolerance can be eliminated with proper network design',
    ],
    correct: 1,
    explanation: 'CAP theorem states that a distributed system can guarantee at most 2 of 3 properties: Consistency (every read sees the most recent write), Availability (every request gets a response), and Partition Tolerance (system continues despite network partitions).',
    topic: 'System Design',
    difficulty: 'medium',
  },
  {
    id: 'q5',
    question: 'What is the difference between INNER JOIN and LEFT JOIN in SQL?',
    options: [
      'No difference — they return the same results',
      'INNER JOIN returns only matching rows; LEFT JOIN returns all left table rows with NULLs for non-matches',
      'LEFT JOIN is faster than INNER JOIN',
      'INNER JOIN includes duplicate rows; LEFT JOIN removes them',
    ],
    correct: 1,
    explanation: 'INNER JOIN returns only rows where there is a match in both tables. LEFT JOIN (LEFT OUTER JOIN) returns all rows from the left table and matching rows from the right table; non-matching rows have NULL values.',
    topic: 'Databases',
    difficulty: 'easy',
  },
  {
    id: 'q6',
    question: 'Which HTTP method is idempotent but NOT safe?',
    options: ['GET', 'PUT', 'POST', 'DELETE'],
    correct: 3,
    explanation: 'DELETE is idempotent (deleting same resource twice has same effect) but not safe (it modifies server state). PUT is also idempotent. GET is both safe and idempotent. POST is neither.',
    topic: 'System Design',
    difficulty: 'medium',
  },
  {
    id: 'q7',
    question: 'In Java, what is the difference between ArrayList and LinkedList?',
    options: [
      'ArrayList is thread-safe; LinkedList is not',
      'ArrayList uses array (O(1) random access); LinkedList uses nodes (O(n) random access)',
      'LinkedList allows duplicates; ArrayList does not',
      'ArrayList is immutable; LinkedList is mutable',
    ],
    correct: 1,
    explanation: 'ArrayList is backed by an array offering O(1) random access but O(n) insertion/deletion in the middle. LinkedList uses doubly-linked nodes offering O(1) insert/delete at ends but O(n) random access.',
    topic: 'Java Core',
    difficulty: 'easy',
  },
  {
    id: 'q8',
    question: 'What is the purpose of Redis EXPIRE command?',
    options: [
      'Delete all keys immediately',
      'Set a time-to-live on a key so it auto-deletes after N seconds',
      'Evict least recently used keys',
      'Backup data to disk',
    ],
    correct: 1,
    explanation: 'EXPIRE sets a TTL (time-to-live) in seconds on a key. After the timeout, Redis automatically deletes the key. Useful for session management, caching, and rate limiting.',
    topic: 'Databases',
    difficulty: 'easy',
  },
  {
    id: 'q9',
    question: 'What is a Python decorator?',
    options: [
      'A design pattern for UI components',
      'A function that takes a function and returns a modified version of it',
      'A type of class inheritance in Python',
      'A way to define abstract methods',
    ],
    correct: 1,
    explanation: 'A decorator is a function that wraps another function, extending its behavior without modifying it. Syntactically denoted with @. Common uses: logging, authentication, caching, timing.',
    topic: 'Python',
    difficulty: 'easy',
  },
  {
    id: 'q10',
    question: 'Which AWS service provides managed Kubernetes?',
    options: ['EC2', 'ECS', 'EKS', 'Lambda'],
    correct: 2,
    explanation: 'Amazon EKS (Elastic Kubernetes Service) is the managed Kubernetes service. ECS is Amazon\'s proprietary container orchestration. EC2 is raw VMs. Lambda is serverless functions.',
    topic: 'Cloud & AWS',
    difficulty: 'easy',
  },
];

// ============================================================
// AI INTERVIEW QUESTIONS & RESPONSES
// ============================================================
export const aiInterviewResponses = {
  systemDesign: [
    {
      trigger: 'url shortener',
      response: `Great question! Let me ask a few clarifying questions first:

1. **Scale**: How many URL shortening requests per day? (100M? 1B?)
2. **Read vs Write ratio**: Typically reads >> writes for URL shorteners
3. **Custom aliases**: Should users be able to define custom short codes?
4. **Analytics**: Do we need click tracking, geolocation data?
5. **Expiration**: Should URLs expire after N days?

Take your time to think through these before we design the system. What would you estimate the scale to be?`,
    },
    {
      trigger: 'scale requirements',
      response: `Excellent! With 100M requests/day, let me calculate:

**Capacity Estimation:**
- 100M requests/day = ~1,160 req/second (average)
- Peak: ~3x = 3,500 req/sec
- Storage: 100M URLs × 500 bytes = 50GB/day
- Short code: 6 chars (base62) = 62⁶ ≈ 56 billion unique codes

**High-Level Design:**

\`\`\`
Client → Load Balancer → [URL Service] → PostgreSQL (URL mappings)
                                      → Redis (Hot URLs cache)
Redirect: Client → CDN/Cache → 301 Redirect
\`\`\`

For the short code generation, I see two approaches:
1. **Hash-based**: MD5/SHA-256 of long URL, take first 6 chars
2. **Counter-based**: Global counter → Base62 encode

Which approach would you prefer and why? What are the trade-offs?`,
    },
  ],
  dsa: [
    {
      trigger: 'start',
      response: `Welcome to your DSA interview! I'm your interviewer today.

Let's start with a classic problem:

**Problem: Two Sum**

Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to target.

You may assume that each input would have exactly one solution, and you may not use the same element twice.

**Example:**
- Input: nums = [2, 7, 11, 15], target = 9
- Output: [0, 1]
- Explanation: nums[0] + nums[1] = 2 + 7 = 9

Before jumping to code, could you walk me through your thought process? What's the naive approach, and can we do better?`,
    },
  ],
};

// ============================================================
// FORUM POSTS
// ============================================================
export const forumPosts = [
  {
    id: 'fp1',
    author: { name: 'Rahul Mehta', avatar: 'RM', role: 'Google SDE2' },
    category: 'interview-experience',
    company: 'Google',
    title: 'Google L4 Interview Experience — System Design + DSA (Bangalore, 2025)',
    excerpt: 'Just got my Google offer! Here\'s a complete breakdown of all 5 rounds...',
    content: `Just received my Google L4 offer after a 3-month preparation journey! Here's the full breakdown:

**Round 1: DSA (45 min)**
- Two coding problems: Medium difficulty
- Problem 1: Sliding window + hash map
- Problem 2: Graph BFS

**Round 2: System Design (60 min)**
- Design Google Maps (simplified)
- Focus on geospatial indexing, routing algorithms

**Round 3: Behavioral (45 min)**
- Leadership principles questions
- Used STAR format throughout

**Key Tips:**
1. Always clarify requirements before jumping to solution
2. Think out loud — they want to see your thought process
3. Test your code with edge cases

Happy to answer any questions!`,
    upvotes: 342,
    comments: 48,
    views: 12450,
    tags: ['google', 'l4', 'system-design', 'dsa'],
    isVerified: true,
    createdAt: '2025-03-15',
  },
  {
    id: 'fp2',
    author: { name: 'Priya Nair', avatar: 'PN', role: 'Amazon SDE1' },
    category: 'interview-experience',
    company: 'Amazon',
    title: 'Amazon SDE2 Bar Raiser — How I Prepared for Leadership Principles',
    excerpt: 'The bar raiser round at Amazon is notorious. Here\'s what worked for me...',
    content: `Amazon's bar raiser is the most unique interview I\'ve faced. Here\'s my preparation strategy:

**The 14 Leadership Principles you MUST know:**
- Customer Obsession, Ownership, Invent and Simplify...

**My STAR Story Bank:**
I created 20 stories, each mapped to multiple LPs. Key stories:
1. Disagreed with tech lead about architecture choice (Disagree and Commit)
2. Delivered project under tight deadline (Deliver Results)
3. Identified production bug before release (High Standards)

**Technical Rounds:**
2 DSA rounds + 1 System Design + Bar Raiser

DM me if you want my full story bank template!`,
    upvotes: 218,
    comments: 31,
    views: 8900,
    tags: ['amazon', 'behavioral', 'leadership-principles'],
    isVerified: false,
    createdAt: '2025-04-02',
  },
  {
    id: 'fp3',
    author: { name: 'Arjun Singh', avatar: 'AS', role: 'Microsoft SDE3' },
    category: 'dsa',
    company: null,
    title: 'How I went from 0 to solving Hard LeetCode in 3 months',
    excerpt: 'My systematic approach to DSA preparation that actually worked...',
    content: `3 months ago I couldn't solve Medium problems. Today I solved 3 Hards in my interview. Here's my exact roadmap:

**Month 1: Foundation**
- Arrays, Strings: 30 problems
- HashMap, Sets: 20 problems
- Two Pointers, Sliding Window: 25 problems

**Month 2: Trees & Graphs**
- Binary Trees (all traversals): 30 problems
- BST operations: 15 problems
- Graph BFS/DFS: 25 problems

**Month 3: Advanced**
- Dynamic Programming (patterns): 40 problems
- Heap/Priority Queue: 20 problems
- Mock interviews: 2/week

**Key Insight:** Don't just solve problems — understand patterns!`,
    upvotes: 456,
    comments: 67,
    views: 18200,
    tags: ['dsa', 'study-plan', 'leetcode'],
    isVerified: true,
    createdAt: '2025-02-20',
  },
  {
    id: 'fp4',
    author: { name: 'Sneha Patel', avatar: 'SP', role: 'Senior SDE' },
    category: 'career',
    company: null,
    title: 'Salary Negotiation Guide — How I got 30% more than the initial offer',
    excerpt: 'Don\'t leave money on the table. Here\'s my exact negotiation script...',
    content: `I negotiated a 30% salary increase. Here's the exact conversation:

**Rule 1:** Never reveal your current salary
**Rule 2:** Let them make the first offer
**Rule 3:** Always counter — even if the offer seems good

**My Script:**
"Thank you so much for the offer! I'm really excited about the role. Based on my research and market data, I was expecting something in the range of X to Y. Is there flexibility?"

**What they responded:**
They came up 25%. I asked about stock vesting and got an extra signing bonus.

Total increase: 30% base + 40% better stock vesting.`,
    upvotes: 389,
    comments: 52,
    views: 15600,
    tags: ['salary', 'negotiation', 'career'],
    isVerified: false,
    createdAt: '2025-01-10',
  },
];

// ============================================================
// CERTIFICATIONS
// ============================================================
export const certifications = [
  {
    id: 'cert1',
    title: 'DSA Proficiency',
    subtitle: 'Data Structures & Algorithms',
    icon: '🧩',
    color: 'blue',
    difficulty: 'Intermediate',
    questions: 50,
    duration: 90,
    passingScore: 75,
    earned: true,
    score: 88,
    earnedDate: '2025-02-14',
    skills: ['Arrays', 'Trees', 'Graphs', 'DP', 'Sorting'],
    description: 'Validates your understanding of fundamental and advanced data structures and algorithms.',
  },
  {
    id: 'cert2',
    title: 'System Design Expert',
    subtitle: 'HLD & Distributed Systems',
    icon: '🏗️',
    color: 'purple',
    difficulty: 'Advanced',
    questions: 40,
    duration: 75,
    passingScore: 80,
    earned: false,
    score: null,
    earnedDate: null,
    skills: ['HLD', 'LLD', 'Scalability', 'Caching', 'Databases'],
    description: 'Demonstrates expertise in designing large-scale distributed systems.',
  },
  {
    id: 'cert3',
    title: 'Java Backend Developer',
    subtitle: 'Spring Boot & Microservices',
    icon: '☕',
    color: 'green',
    difficulty: 'Intermediate',
    questions: 45,
    duration: 80,
    passingScore: 75,
    earned: false,
    score: null,
    earnedDate: null,
    skills: ['Java', 'Spring Boot', 'REST APIs', 'JPA', 'Security'],
    description: 'Validates Java Spring Boot backend development competency.',
  },
  {
    id: 'cert4',
    title: 'Cloud Practitioner',
    subtitle: 'AWS Core Services',
    icon: '☁️',
    color: 'cyan',
    difficulty: 'Beginner',
    questions: 35,
    duration: 60,
    passingScore: 70,
    earned: false,
    score: null,
    earnedDate: null,
    skills: ['EC2', 'S3', 'RDS', 'Lambda', 'VPC'],
    description: 'Covers fundamental AWS cloud services and architecture concepts.',
  },
  {
    id: 'cert5',
    title: 'Full Stack Developer',
    subtitle: 'React + Node.js',
    icon: '🔗',
    color: 'orange',
    difficulty: 'Intermediate',
    questions: 55,
    duration: 100,
    passingScore: 75,
    earned: false,
    score: null,
    earnedDate: null,
    skills: ['React', 'TypeScript', 'Node.js', 'REST', 'MongoDB'],
    description: 'End-to-end web development certification covering frontend and backend.',
  },
];

// ============================================================
// ANALYTICS DATA
// ============================================================
export const analyticsData = {
  weeklyActivity: [
    { day: 'Mon', problems: 5, mcqs: 15, studyHours: 2.5 },
    { day: 'Tue', problems: 3, mcqs: 20, studyHours: 2 },
    { day: 'Wed', problems: 7, mcqs: 10, studyHours: 3 },
    { day: 'Thu', problems: 4, mcqs: 25, studyHours: 2.5 },
    { day: 'Fri', problems: 6, mcqs: 18, studyHours: 3.5 },
    { day: 'Sat', problems: 10, mcqs: 30, studyHours: 5 },
    { day: 'Sun', problems: 2, mcqs: 8, studyHours: 1 },
  ],
  interviewScores: [
    { date: 'Week 1', score: 5.5, domain: 'DSA' },
    { date: 'Week 2', score: 6.2, domain: 'DSA' },
    { date: 'Week 3', score: 6.8, domain: 'System Design' },
    { date: 'Week 4', score: 7.1, domain: 'DSA' },
    { date: 'Week 5', score: 7.5, domain: 'Behavioral' },
    { date: 'Week 6', score: 7.9, domain: 'System Design' },
    { date: 'Week 7', score: 8.2, domain: 'DSA' },
    { date: 'Week 8', score: 8.5, domain: 'Full Stack' },
  ],
  skillScores: [
    { skill: 'DSA', score: 78, required: 85 },
    { skill: 'System\nDesign', score: 55, required: 80 },
    { skill: 'Java', score: 88, required: 80 },
    { skill: 'Cloud', score: 42, required: 70 },
    { skill: 'Behavioral', score: 70, required: 75 },
    { skill: 'Databases', score: 72, required: 75 },
  ],
  topicBreakdown: [
    { topic: 'Arrays & Strings', solved: 45, total: 60, accuracy: 82 },
    { topic: 'Trees & Graphs', solved: 28, total: 55, accuracy: 74 },
    { topic: 'Dynamic Programming', solved: 15, total: 50, accuracy: 61 },
    { topic: 'Sliding Window', solved: 22, total: 28, accuracy: 89 },
    { topic: 'Binary Search', solved: 18, total: 25, accuracy: 85 },
    { topic: 'Stack & Queue', solved: 20, total: 25, accuracy: 90 },
    { topic: 'Heap', solved: 10, total: 20, accuracy: 68 },
    { topic: 'Backtracking', solved: 8, total: 25, accuracy: 55 },
  ],
  heatmapData: generateHeatmap(),
};

function generateHeatmap() {
  const data: { date: string; count: number }[] = [];
  const today = new Date();
  for (let i = 364; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    // Random activity with higher probability on weekdays
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const rand = Math.random();
    let count = 0;
    if (rand > (isWeekend ? 0.5 : 0.25)) {
      count = Math.floor(Math.random() * 8) + 1;
    }
    data.push({ date: dateStr, count });
  }
  return data;
}

// ============================================================
// DAILY CHALLENGE DATA
// ============================================================
export const dailyChallenge = {
  date: new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' }),
  problem: dsaProblems[2],
  mcqs: mcqQuestions.slice(0, 5),
  concept: {
    title: 'CAP Theorem',
    summary: 'In distributed systems, you can only guarantee 2 of 3: Consistency, Availability, Partition Tolerance.',
    readTime: '5 min',
  },
  leaderboard: [
    { rank: 1, name: 'Rohit Kumar', xp: 180, country: '🇮🇳' },
    { rank: 2, name: 'Sarah Chen', xp: 165, country: '🇺🇸' },
    { rank: 3, name: 'Ahmed Hassan', xp: 155, country: '🇦🇪' },
    { rank: 4, name: 'Avantika Sharma', xp: 140, country: '🇮🇳', isCurrentUser: true },
    { rank: 5, name: 'Priya Nair', xp: 135, country: '🇮🇳' },
    { rank: 6, name: 'Lucas Silva', xp: 120, country: '🇧🇷' },
  ],
};

// ============================================================
// SYSTEM DESIGN PROBLEMS
// ============================================================
export const systemDesignProblems = [
  { id: 'sd1', title: 'Design URL Shortener (bit.ly)', difficulty: 'medium', category: 'Web Systems', companies: ['Google', 'Amazon'], popular: true, completed: false },
  { id: 'sd2', title: 'Design Twitter / Social Feed', difficulty: 'hard', category: 'Social Media', companies: ['Twitter', 'Facebook'], popular: true, completed: false },
  { id: 'sd3', title: 'Design Netflix Video Streaming', difficulty: 'hard', category: 'Streaming', companies: ['Netflix', 'YouTube'], popular: true, completed: true },
  { id: 'sd4', title: 'Design Uber / Ride Sharing', difficulty: 'hard', category: 'Real-time Systems', companies: ['Uber', 'Lyft'], popular: false, completed: false },
  { id: 'sd5', title: 'Design WhatsApp Messaging', difficulty: 'hard', category: 'Messaging', companies: ['Meta', 'Telegram'], popular: true, completed: false },
  { id: 'sd6', title: 'Design Google Search Autocomplete', difficulty: 'medium', category: 'Search', companies: ['Google'], popular: false, completed: false },
  { id: 'sd7', title: 'Design Rate Limiter', difficulty: 'medium', category: 'API Gateway', companies: ['AWS', 'Cloudflare'], popular: true, completed: true },
  { id: 'sd8', title: 'Design Distributed Cache', difficulty: 'hard', category: 'Caching', companies: ['Redis', 'Amazon'], popular: false, completed: false },
  { id: 'sd9', title: 'Design Notification System', difficulty: 'medium', category: 'Push Systems', companies: ['Amazon', 'Google'], popular: false, completed: false },
  { id: 'sd10', title: 'Design E-Commerce Checkout', difficulty: 'hard', category: 'E-commerce', companies: ['Amazon', 'Flipkart'], popular: false, completed: false },
];

// ============================================================
// MOCK INTERVIEWS HISTORY
// ============================================================
export const interviewHistory = [
  { id: 'i1', date: '2025-04-10', domain: 'System Design', type: 'AI', score: 8.2, status: 'completed', duration: 45 },
  { id: 'i2', date: '2025-04-05', domain: 'DSA', type: 'AI', score: 7.8, status: 'completed', duration: 40 },
  { id: 'i3', date: '2025-03-28', domain: 'Behavioral', type: 'Peer', score: 8.5, status: 'completed', duration: 35 },
  { id: 'i4', date: '2025-03-20', domain: 'Full Stack', type: 'AI', score: 7.2, status: 'completed', duration: 50 },
  { id: 'i5', date: '2025-04-15', domain: 'System Design', type: 'AI', score: null, status: 'scheduled', duration: null },
];
