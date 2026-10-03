export type DocBlock =
  | { type: "lead"; text: string }
  | { type: "p"; text: string }
  | { type: "h2"; text: string; id: string }
  | { type: "h3"; text: string; id: string }
  | { type: "code"; lang: string; code: string; title?: string }
  | { type: "callout"; variant: "tip" | "note" | "warn"; title: string; text: string }
  | { type: "list"; ordered?: boolean; items: string[] }
  | { type: "table"; head: string[]; rows: string[][] }
  | { type: "api"; method: "GET" | "POST"; path: string; desc: string };

export type DocPage = {
  slug: string;
  title: string;
  description: string;
  group: string;
  minutes: number;
  blocks: DocBlock[];
};

export const DOC_PAGES: DocPage[] = [
  {
    slug: "introduction",
    title: "Introduction",
    description: "What DailyForge is, who it's for, and how the pieces fit together.",
    group: "Start here",
    minutes: 3,
    blocks: [
      {
        type: "lead",
        text: "DailyForge is a docs portal and control plane for publishing one developer challenge every day — a structured pipeline that takes a challenge from idea to a dated, test-backed, XP-scored entry on the daily calendar.",
      },
      { type: "h2", id: "the-loop", text: "The daily loop" },
      {
        type: "p",
        text: "Every challenge follows the same lifecycle. An author drafts it (in the studio or over the API), attaches a test suite, assigns a difficulty and XP value, and schedules a publish date. At midnight UTC the challenge goes live, developers solve it, and submissions are judged against the suite.",
      },
      { type: "list", items: [
        "`Draft` — title, prompt, constraints, examples and starter code",
        "`Verify` — a suite of public test cases authors must provide",
        "`Schedule` — a `publish_date` on the daily calendar, one slot per day",
        "`Ship` — developers fetch today's challenge, solve it, submit, earn XP",
      ]},
      { type: "h2", id: "three-surfaces", text: "Three surfaces" },
      { type: "api", method: "GET", path: "/docs/quickstart", desc: "Read — follow the guides from zero to a shipped challenge." },
      { type: "api", method: "POST", path: "/create", desc: "Create — the challenge studio with live payload preview." },
      { type: "api", method: "GET", path: "/challenges", desc: "Solve — the archive of every published daily." },
      { type: "callout", variant: "tip", title: "Opinionated on purpose", text: "One challenge per day is a constraint, not a limitation. It keeps difficulty curves deliberate and means the leaderboard compares everyone on the same problem." },
    ],
  },
  {
    slug: "quickstart",
    title: "Quickstart",
    description: "From zero to a scheduled daily challenge in under five minutes.",
    group: "Start here",
    minutes: 5,
    blocks: [
      { type: "lead", text: "This guide walks through the fastest path: check what's live today, create a challenge through the studio, then do the same thing with a single API call." },
      { type: "h2", id: "see-the-loop", text: "1. Fetch today's challenge" },
      { type: "p", text: "The rotation always exposes the most recent challenge whose publish date is today or earlier:" },
      { type: "code", lang: "bash", title: "terminal", code: `curl -s http://localhost:3000/api/challenges/today | jq '.data | { slug, title, difficulty, xp }'` },
      { type: "code", lang: "json", title: "response", code: `{
  "slug": "rate-limit-the-rush",
  "title": "Rate Limit the Rush",
  "difficulty": "hard",
  "xp": 300
}` },
      { type: "h2", id: "create-in-the-studio", text: "2. Create it in the studio" },
      { type: "p", text: "Open the challenge studio. The form on the left writes the challenge; the right pane shows the exact JSON payload that will hit the API — nothing hidden." },
      { type: "api", method: "POST", path: "/create", desc: "Author a challenge with the visual builder, live payload preview, and instant publish-date validation." },
      { type: "h2", id: "create-over-the-api", text: "3. Or create it over the API" },
      { type: "code", lang: "bash", title: "terminal", code: `curl -s -X POST http://localhost:3000/api/challenges \\
  -H 'content-type: application/json' \\
  -d '{
    "title": "Invert the Singly Linked List",
    "summary": "Reverse a list node-by-node, iteratively.",
    "difficulty": "easy",
    "language": "TypeScript",
    "publishDate": "2026-03-02",
    "starterCode": "function reverse(head: ListNode | null) {\\n  // prev, curr, next\\n}",
    "expectedTokens": ["while"],
    "testCases": [
      { "name": "reverses three nodes", "code": "listToArr(reverse(fromArr([1,2,3]))) == [3,2,1]" }
    ]
  }'` },
      { type: "callout", variant: "note", title: "Slugs are derived", text: "The slug is slugified from the title server-side. If it collides, a numeric suffix is appended (`two-sum-sorted-2`)." },
      { type: "h2", id: "next", text: "4. Next steps" },
      { type: "list", ordered: true, items: [
        "Read [Challenge anatomy](/docs/anatomy) for the full field-by-field schema",
        "Learn the test harness expectations in [Writing tests](/docs/test-harness)",
        "Automate your rotation with [Scheduling](/docs/scheduling)",
      ]},
    ],
  },
  {
    slug: "anatomy",
    title: "Challenge anatomy",
    description: "Every field on a challenge, what it does, and how it's validated.",
    group: "Challenges",
    minutes: 6,
    blocks: [
      { type: "lead", text: "A challenge is one row with a strict schema. This page is the field-by-field reference — the same shape you see in the studio, the API, and the database." },
      { type: "h2", id: "schema", text: "Schema reference" },
      { type: "table",
        head: ["Field", "Type", "Required", "Notes"],
        rows: [
          ["title", "string (4–120)", "yes", "Displayed everywhere; the slug is derived from it"],
          ["summary", "string ≤ 200", "yes", "One line for cards and the daily digest"],
          ["description", "markdown-ish text", "yes", "Blank-line separated paragraphs; `backticks` render as code"],
          ["difficulty", "easy · medium · hard · expert", "yes", "Drives the default XP and the badge"],
          ["language", "string", "yes", "Free-form; keep to canonical names"],
          ["publishDate", "YYYY-MM-DD", "yes", "UTC calendar slot; future dates stay hidden"],
          ["xp", "integer 0–1000", "no", "Defaults from difficulty (50/150/300/500)"],
          ["estimatedMinutes", "integer", "no", "Shown as a time budget on the card"],
          ["tags", "string[]", "no", "Lowercase, max 6"],
          ["constraints", "string[]", "no", "Rendered as the numbered rule list"],
          ["examples", "{ input, output, explanation? }[]", "no", "Public examples, max 4"],
          ["starterCode", "string", "no", "Pre-fills the runner on the challenge page"],
          ["expectedTokens", "string[]", "no", "Heuristic tokens the runner scans for"],
          ["testCases", "{ name, code }[]", "no", "The public suite, shown on the page"],
        ]},
      { type: "h2", id: "stored-shape", text: "The stored shape" },
      { type: "code", lang: "typescript", title: "challenge.ts", code: `type Challenge = {
  id: string;              // uuid
  slug: string;            // "rate-limit-the-rush"
  title: string;
  summary: string;
  description: string;     // \\n\\n separated paragraphs
  difficulty: "easy" | "medium" | "hard" | "expert";
  language: string;        // "Go", "TypeScript", "SQL"...
  xp: number;
  estimatedMinutes: number;
  tags: string[];
  constraints: string[];
  examples: { input: string; output: string; explanation?: string }[];
  starterCode: string;
  expectedTokens: string[];
  testCases: { name: string; code: string }[];
  publishDate: string;     // YYYY-MM-DD, UTC
  createdAt: string;       // ISO timestamp
};` },
      { type: "callout", variant: "warn", title: "One slot per day", text: "Publishing is date-based, not draft-based. If two challenges share a publish date, the archive shows both — but the rotation endpoint prefers the most recently created. Keep the calendar tidy." },
    ],
  },
  {
    slug: "authoring",
    title: "Authoring workflow",
    description: "How to write challenges people actually finish — and finish smiling.",
    group: "Challenges",
    minutes: 7,
    blocks: [
      { type: "lead", text: "The best daily challenges are small, sharp, and fair. This page is the house style guide — the same review checklist applied to every challenge on the calendar." },
      { type: "h2", id: "the-shape", text: "The shape of a good daily" },
      { type: "list", items: [
        "`One idea` — teach exactly one concept (a stale closure, an islands query, a token bucket)",
        "`Twenty minutes` — if the expert lane takes an hour, it's not a daily",
        "`No trick questions` — the constraints section must contain every gotcha",
        "`Verifiable` — at least three public tests a reader can reason about",
      ]},
      { type: "h2", id: "voice", text: "Prompt voice" },
      { type: "p", text: "Write in second person, present tense, concrete nouns. Start with the situation, give the invariant, end with a single hint line that starts with `Hint:`. Never open with background trivia." },
      { type: "code", lang: "typescript", title: "description.md", code: `A polling component refetches every 5 seconds — except its
effect closure captured the query params from the very first
render, so changing the filter never changes what gets fetched.

Refactor usePoll(callback, interval) so the interval always
invokes the most recent callback without resetting the timer.

Hint: keep the latest callback in a ref and let the effect
depend only on the interval.` },
      { type: "h2", id: "checklist", text: "Ship checklist" },
      { type: "list", ordered: true, items: [
        "Starter code compiles/parses and clearly marks the extension point",
        "At least one example has an `explanation`",
        "Every constraint is testable; every test maps to a constraint",
        "`expectedTokens` is absent from the starter (or the check is free XP)",
        "Difficulty matches the rubric in [Difficulty & XP](/docs/difficulty-xp)",
      ]},
      { type: "callout", variant: "tip", title: "Read yesterday's first", text: "Skim the archive before scheduling. Dailies work best as a curriculum — Tuesday's two-pointers challenge makes Wednesday's sliding window land." },
    ],
  },
  {
    slug: "test-harness",
    title: "Writing tests",
    description: "How the public suite is structured and how submissions are judged.",
    group: "Challenges",
    minutes: 6,
    blocks: [
      { type: "lead", text: "Every challenge carries a public test suite. It sets the contract, teaches the edge cases, and feeds the runner on the challenge page." },
      { type: "h2", id: "suite-shape", text: "Suite structure" },
      { type: "code", lang: "json", title: "testCases", code: `"testCases": [
  { "name": "evicts the least recent", "code": "get(2) == -1 after put(3,3)" },
  { "name": "get refreshes recency", "code": "get(1); put(3,3) keeps key 1" },
  { "name": "update refreshes too",   "code": "put(2,9); evict order changes" }
]` },
      { type: "list", items: [
        "`name` — a behavior, not a quantity: 'rejects when empty', never 'test 2'",
        "`code` — the assertion as a one-liner in the challenge language",
        "3–6 cases: happy path, each documented edge case, one stress case",
      ]},
      { type: "h2", id: "how-judging-works", text: "How the runner judges" },
      { type: "p", text: "The hosted runner in this portal is a demonstration harness: it scans the submission for the challenge's `expectedTokens` and requires the solution to actually change relative to the starter. All public tests pass or fail together, and the result is stored as a submission row." },
      { type: "table", head: ["Signal", "Weight", "Why"], rows: [
        ["expectedTokens present", "required", "Proves the intended technique was attempted"],
        ["Code differs from starter", "required", "Empty submissions never pass"],
        ["Public tests", "all-or-nothing", "Reported as passed/total on the receipt"],
      ]},
      { type: "callout", variant: "warn", title: "Heuristic, by design", text: "Token scanning is intentionally lenient — the portal is for authors, not gatekeeping. Plug a real sandbox (isolated VM, container, or judge0) behind POST /api/submissions when you need adversarial judging." },
      { type: "h2", id: "picking-tokens", text: "Picking expectedTokens" },
      { type: "code", lang: "typescript", title: "good vs. noise", code: `// good — the technique itself
"expectedTokens": ["setTimeout", "clearTimeout"]

// good — the API that proves you understood
"expectedTokens": ["row_number", "over"]

// noise — present in every plausible attempt
"expectedTokens": ["function", "return"]` },
    ],
  },
  {
    slug: "difficulty-xp",
    title: "Difficulty & XP",
    description: "The rubric authors use to score a challenge, and how XP is awarded.",
    group: "Challenges",
    minutes: 4,
    blocks: [
      { type: "lead", text: "Difficulty is a promise about the shape of the thinking, not the volume of typing. XP follows difficulty by default, and authors can tune it within bounds." },
      { type: "h2", id: "rubric", text: "The rubric" },
      { type: "table", head: ["Level", "Default XP", "Time budget", "Signature"], rows: [
        ["easy", "50 XP", "5–15 min", "One standard technique, warmup speed"],
        ["medium", "150 XP", "15–25 min", "One insight + one standard technique"],
        ["hard", "300 XP", "25–40 min", "Composition of ideas, or an unfamiliar API"],
        ["expert", "500 XP", "40–60 min", "Type-level, concurrency, or deep language mechanics"],
      ]},
      { type: "h2", id: "calibration", text: "Calibrating a challenge" },
      { type: "list", ordered: true, items: [
        "Solve it yourself and time it. Your time × 2.5 is the median time",
        "If the aha is 'just know this API', that's medium at best — unless the API is genuinely obscure",
        "Set `estimatedMinutes` to the median, round to 5",
        "Only override default XP when scope genuinely exceeds the level (cap: 1000)",
      ]},
      { type: "callout", variant: "note", title: "XP economy", text: "XP is awarded on the first passing submission per challenge. Failing attempts are stored but award nothing — retries are free." },
      { type: "code", lang: "json", title: "POST /api/submissions → receipt", code: `{
  "data": {
    "status": "passed",
    "passedTests": 4,
    "totalTests": 4,
    "xpAwarded": 300
  }
}` },
    ],
  },
  {
    slug: "scheduling",
    title: "Scheduling & rotation",
    description: "How the daily calendar picks what goes live, and how to plan a season.",
    group: "Automation",
    minutes: 5,
    blocks: [
      { type: "lead", text: "Scheduling is the product. A challenge isn't 'published' — it has a date, and the rotation surfaces exactly one date at a time." },
      { type: "h2", id: "how-rotation-works", text: "How rotation works" },
      { type: "list", ordered: true, items: [
        "Every challenge carries a `publishDate` (UTC calendar day)",
        "`/api/challenges/today` returns the most recent challenge with `publishDate ≤ today`",
        "Challenges with a future date are hidden from the archive and search",
        "Missed days simply never surface — the calendar is a sequence, not a queue",
      ]},
      { type: "code", lang: "bash", title: "terminal — preview the rotation", code: `# What's live right now
curl -s http://localhost:3000/api/challenges/today

# What authors have queued (includes future dates, needs the flag)
curl -s 'http://localhost:3000/api/challenges?upcoming=true'` },
      { type: "h2", id: "planning-a-season", text: "Planning a season" },
      { type: "p", text: "Programming a week at a time keeps difficulty arcs coherent. The house pattern: easy Monday, medium Tuesday/Wednesday, hard Thursday, wildcard Friday (SQL, CSS, a debugging puzzle), expert Saturday. Sunday repeats the community favorite." },
      { type: "callout", variant: "tip", title: "Batch with the API", text: "Script your season: loop over a JSON file of drafts and POST /api/challenges once per entry. Slugs and defaults are handled server-side, so a draft can be as small as title, difficulty, language and publishDate." },
      { type: "h2", id: "timezones", text: "Timezones" },
      { type: "p", text: "All scheduling is UTC. A challenge goes live at 00:00 UTC and stays live until the next date with a scheduled challenge. Display localization is a client concern — the API always speaks `YYYY-MM-DD`." },
    ],
  },
  {
    slug: "api-reference",
    title: "API reference",
    description: "Every endpoint, every parameter, with copy-paste examples.",
    group: "Developers",
    minutes: 8,
    blocks: [
      { type: "lead", text: "The REST API is the same one the portal UI uses — there are no private endpoints. All responses are JSON in the shape `{ data }` or `{ error, detail? }`." },
      { type: "h2", id: "endpoints", text: "Endpoints" },
      { type: "api", method: "GET", path: "/api/challenges", desc: "List published challenges. Query: difficulty, language, upcoming=true." },
      { type: "api", method: "POST", path: "/api/challenges", desc: "Create and schedule a challenge. Returns the stored record with its slug." },
      { type: "api", method: "GET", path: "/api/challenges/today", desc: "The challenge currently live on the daily rotation." },
      { type: "api", method: "GET", path: "/api/challenges/:slug", desc: "One challenge by slug, 404 on unknown or future-dated slugs." },
      { type: "api", method: "POST", path: "/api/submissions", desc: "Judge a solution against the public suite. Body: { challengeId, code }." },
      { type: "api", method: "GET", path: "/api/health", desc: "Liveness probe — checks the database connection." },
      { type: "h2", id: "list", text: "List challenges" },
      { type: "code", lang: "bash", title: "terminal", code: `curl -s 'http://localhost:3000/api/challenges?difficulty=medium&language=TypeScript'` },
      { type: "code", lang: "json", title: "response — 200 OK", code: `{
  "data": [
    {
      "id": "5f2c…",
      "slug": "debounce-the-feed",
      "title": "Debounce the Feed",
      "difficulty": "medium",
      "language": "TypeScript",
      "xp": 150,
      "publishDate": "2026-03-01",
      "tags": ["typescript", "functions", "timers", "performance"]
    }
  ],
  "meta": { "count": 1 }
}` },
      { type: "h2", id: "create", text: "Create a challenge" },
      { type: "table", head: ["Field", "Rule"], rows: [
        ["title", "required, 4–120 chars, slugified server-side"],
        ["summary", "required, ≤ 200 chars"],
        ["description", "required, ≥ 40 chars"],
        ["difficulty", "easy | medium | hard | expert"],
        ["language", "required"],
        ["publishDate", "required, YYYY-MM-DD"],
        ["xp / estimatedMinutes / tags / constraints / examples / starterCode / expectedTokens / testCases", "optional — see Challenge anatomy"],
      ]},
      { type: "code", lang: "bash", title: "terminal", code: `curl -s -X POST http://localhost:3000/api/challenges \\
  -H 'content-type: application/json' \\
  -d '{ "title": "Collapse the Whitespace", "summary": "Trim and squeeze a string in one pass.", "description": "…", "difficulty": "easy", "language": "Rust", "publishDate": "2026-03-09" }'` },
      { type: "code", lang: "json", title: "response — 201 Created", code: `{ "data": { "slug": "collapse-the-whitespace", "id": "9b1e…", "publishDate": "2026-03-09" } }` },
      { type: "h2", id: "submit", text: "Submit a solution" },
      { type: "code", lang: "bash", title: "terminal", code: `curl -s -X POST http://localhost:3000/api/submissions \\
  -H 'content-type: application/json' \\
  -d '{ "challengeId": "5f2c…", "code": "function debounce(fn, wait){ let t; ... }" }'` },
      { type: "code", lang: "json", title: "response — 200 OK", code: `{
  "data": {
    "id": "c81a…",
    "status": "passed",
    "passedTests": 4,
    "totalTests": 4,
    "xpAwarded": 150
  }
}` },
      { type: "h2", id: "errors", text: "Errors" },
      { type: "code", lang: "json", title: "response — 422 Unprocessable Content", code: `{
  "error": "validation_failed",
  "detail": { "title": ["Required"] }
}` },
      { type: "callout", variant: "note", title: "Rate limits", text: "None on local development. In production, put the API behind your gateway and limit POST routes per IP." },
    ],
  },
  {
    slug: "webhooks",
    title: "Webhooks",
    description: "Push events when challenges publish and submissions pass. (Beta)",
    group: "Developers",
    minutes: 4,
    blocks: [
      { type: "lead", text: "Webhooks push portal events to your infrastructure — a Slack bot, a leaderboard service, a Discord announcement — the moment they happen." },
      { type: "callout", variant: "warn", title: "Beta namespace", text: "The webhook delivery service is in beta. The event payloads below are stable; register-by-API lands next. This page documents the contract so integrations can be built today against the payload shapes." },
      { type: "h2", id: "events", text: "Events" },
      { type: "table", head: ["Event", "Fires when", "Key payload fields"], rows: [
        ["challenge.published", "The rotation flips at 00:00 UTC", "slug, title, difficulty, xp, publishDate"],
        ["challenge.created", "POST /api/challenges succeeds", "slug, publishDate"],
        ["submission.passed", "A submission passes the suite", "challengeSlug, xpAwarded"],
      ]},
      { type: "h2", id: "payload", text: "Payload shape" },
      { type: "code", lang: "json", title: "challenge.published", code: `{
  "id": "evt_7f2a…",
  "type": "challenge.published",
  "created": "2026-03-02T00:00:00.000Z",
  "data": {
    "slug": "typed-event-emitter",
    "title": "Typed Event Emitter",
    "difficulty": "expert",
    "xp": 500,
    "publishDate": "2026-03-02"
  }
}` },
      { type: "h2", id: "verifying", text: "Verifying signatures" },
      { type: "p", text: "Every delivery carries an `X-DailyForge-Signature` header: an HMAC-SHA256 of the raw request body using your endpoint secret. Always verify before parsing." },
      { type: "code", lang: "typescript", title: "verify.ts", code: `import { createHmac, timingSafeEqual } from "crypto";

function verify(body: string, signature: string, secret: string) {
  const expected = "sha256=" + createHmac("sha256", secret)
    .update(body)
    .digest("hex");
  return timingSafeEqual(Buffer.from(signature), Buffer.from(expected));
}` },
    ],
  },
];

export const DOC_GROUPS: { group: string; pages: { slug: string; title: string; minutes: number }[] }[] = (() => {
  const order = ["Start here", "Challenges", "Automation", "Developers"];
  return order
    .map((group) => ({
      group,
      pages: DOC_PAGES.filter((p) => p.group === group).map((p) => ({
        slug: p.slug,
        title: p.title,
        minutes: p.minutes,
      })),
    }))
    .filter((g) => g.pages.length > 0);
})();

export function getDocPage(slug: string): DocPage | undefined {
  return DOC_PAGES.find((p) => p.slug === slug);
}

export function getDocNeighbors(slug: string) {
  const flat = DOC_GROUPS.flatMap((g) => g.pages);
  const i = flat.findIndex((p) => p.slug === slug);
  return {
    prev: i > 0 ? flat[i - 1] : undefined,
    next: i >= 0 && i < flat.length - 1 ? flat[i + 1] : undefined,
  };
}
